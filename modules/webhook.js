"use strict";

let request = require('request'),
    salesforce = require('./salesforce'),
    formatter = require('./formatter-messenger');

let sendMessage = (message, recipient) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipient},
            message: message                       
        }
    }, (error, response) => {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

let getUserInfo = (userId) => {  
  return new Promise((resolve, reject) => {           
        request({
            url: `https://graph.facebook.com/v2.6/${userId}`,
            qs: {fields:"first_name,last_name,profile_pic", access_token: process.env.FB_PAGE_TOKEN},
            method: 'GET',
        }, (error, response) => {
            if (error) {
                console.log('Error sending message: ', error);
                reject(error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            } else {
                console.log(response.body);
                resolve(JSON.parse(response.body));
            }    
        });    
    });      
};    
             
let processText = (text, sender)  => {                 
   let match1;
    match1 = text.match(/hi/i);
    if (match1) {
         getUserInfo(sender).then(response => {         
                    sendMessage({text:
                        `Hey ${response.first_name} !
                       "Kolapasi" welcomes you ?? 
                      Happy to see you :) :)
                     Want to order food ? ?? ?? Please hit - First Menu
                      To know about other options swipe..??`
                    }, sender);
                   salesforce.findTitleCard(match1[0]).then(Accounts => {    
                        console.log('bfo formating');
                        sendMessage(formatter.formatTitleCard(Accounts), sender)
                    }); 
        });    
        return;
    }            
};

let handleGet = (req, res) => {
    if (req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
};

let handlePost = (req, res) => {   	
    let events = req.body.entry[0].messaging;
    for (let i = 0; i < events.length; i++) {
        let event = events[i]; 
        let sender = event.sender.id;
        if (process.env.MAINTENANCE_MODE && ((event.message && event.message.text) || event.postback)) {
            sendMessage({text: `Sorry I'm taking a break right now.`}, sender);
	}	    
	else if (event.message && event.message.text) {
		
		console.log('NOrmal FLow**');
		processText(event.message.text, sender);
		
		if (event.message.quick_reply){
			
			var SelectedQuantity = JSON.stringify(event.message.text);    
			console.log('Selected QUANTITY Stringify Inside**' + SelectedQuantity);
			
			var quickpayload0=event.message.quick_reply.payload;
			console.log('Quick Replies payload**' + quickpayload0);		

			var quickpayload1 =JSON.parse(event.message.quick_reply.payload);    
			console.log('Quick Replies payload KEY PARSING**' + quickpayload1.PrevMenuSelection); 	   		    

			var prevProduct = JSON.stringify(quickpayload1.PrevMenuSelection);    
			console.log('Quick Reply Payload PRODUCTID**' + prevProduct); 		    

			var Price = JSON.stringify(quickpayload1.Price);    
			console.log('Quick Reply Payload PRICE**' + Price); 
			
		}	
		
	}else if(event.message && (event.message.text && event.message.quick_reply) ){		
		
		console.log('Quick Reply Flow**');		    
		
		/*var SelectedQuantity = JSON.stringify(event.message.text);    
		console.log('Selected QUANTITY Stringify Inside**' + SelectedQuantity);*/
		
	     	
		var quickpayload0=event.message.quick_reply.payload;
		console.log('Quick Replies payload**' + quickpayload0);		
		
		var quickpayload1 =JSON.parse(event.message.quick_reply.payload);    
		console.log('Quick Replies payload KEY PARSING**' + quickpayload1.PrevMenuSelection); 	   		    
		
		var prevProduct = JSON.stringify(quickpayload1.PrevMenuSelection);    
		console.log('Quick Reply Payload PRODUCTID**' + prevProduct); 		    
	       	
		var Price = JSON.stringify(quickpayload1.Price);    
		console.log('Quick Reply Payload PRICE**' + Price); 
		
		salesforce.createOpportunityProduct(prevProduct,Price,SelectedQuantity).then(() => {    
			console.log('created opportunitityproduct');
	         });     		    		
        }else if (event.postback) {		
		console.log("Postback received only for type postback and not for quick replies:****** " + JSON.stringify(event.postback));						
                let payload = event.postback.payload.split(",");
                 if (payload[0] === "Show_Branches"){     
                     console.log('payload[1]' + payload[1]);
                     salesforce.findOpenBranches(payload[1]).then(Accounts => {    
                            sendMessage(formatter.formatOpenBranches(Accounts), sender);  
                     });                                                                
                 }
                 else if (payload[0] === "Main_Menu"){     
                     console.log('Selected branch will show their available menus' + payload[1]);  
		      //Hitendar
		      getUserInfo(sender).then(response => {         
			       salesforce.createOpportunity(response.first_name,response.last_name,sender).then(Opportunity => {    
				console.log('created opportunitity'+Opportunity);
			       }); 
		      });
		      //Hitendar
                      salesforce.findMainMenus(payload[1]).then(MainMenus => {   
                          console.log('Going inside main menus');
                          sendMessage(formatter.formatMainMenus(MainMenus), sender);  
                     });    
                 }else if (payload[0] === "Sub_Menu"){     
                     
                     console.log('Origin Branch - payload [1]**' + payload[1]);    
                     console.log('Origin parent product - payload [2]**' + payload[2]); 
                     
                     salesforce.findSubMenus(payload[1], payload[2]).then(SubMenus => {   
                          console.log('Going inside Sub menus');
                          sendMessage(formatter.formatSubMenus(SubMenus), sender);  // Hitendar
                     });   
                     
                 } 
                //Hitendar
	 	else if (payload[0] === "Quantity"){                          
                     console.log('Origin Branch - payload [1]**' + payload[1]);    		     
                     salesforce.getSelectedMenu(payload[1]).then(SelectedMenu => {   
                          console.log('Going inside quantity');
                          sendMessage(formatter.formatQuantity(SelectedMenu), sender);  // Hitendar			  
                     }); 
		     
                 } 
                 //Hitendar
        }
    }    
    res.sendStatus(200);
};

exports.handleGet = handleGet;
exports.handlePost = handlePost;
exports.getUserInfo = getUserInfo;
