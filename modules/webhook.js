"use strict"; //hello

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
            

function adddomain(){
	 console.log('Going to whitelist Domain**');	
	 request({
	    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
	    qs: {access_token: process.env.FB_PAGE_TOKEN},
	    method: 'POST',
	    json:{
		setting_type : "domain_whitelisting",
		whitelisted_domains : ["https://payumoney.com"],
		domain_action_type: "add"
	    }

	}, function(error, response, body) {
	    console.log(response);
	    if (error) {
		console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		console.log('Error: ', response.body.error);
	    }	    	 	 
	})
}

let processText = (text, sender)  => {                 
   let match1;
    match1 = text.match(/hi/i);
    if (match1) {
         getUserInfo(sender).then(response => {         
                    sendMessage({text:
                      `Hey ${response.first_name} !
                      "Kolapasi" welcomes you _/\_
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
		

		console.log('Event.Message.Text**' + event.message.text);
		
		if(event.message.text == 'hi'){
			console.log('Normal Flow**');	
			processText(event.message.text, sender); // WHY KILLING SAMBU MAVAN
		}
		if (event.message.quick_reply){
			
			var SelectedQuantity = event.message.text;  
			console.log('Selected QUANTITY Stringify Inside**' + SelectedQuantity);
			
			var quickpayload0=event.message.quick_reply.payload;
			console.log('Quick Replies payload**' + quickpayload0);		

			var quickpayload1 =JSON.parse(event.message.quick_reply.payload);    
			console.log('Quick Replies payload KEY PARSING12**' + quickpayload1.PrevMenuSelection); 	   		    

			var prevProduct = quickpayload1.PrevMenuSelection;
			console.log('Quick Reply Payload PRODUCTID**' + prevProduct); 		    

			var Price = quickpayload1.Price;
			console.log('Quick Reply Payload PRICE**' + Price); 
			
			var opportunity = quickpayload1.OpportunityId;
			console.log('Quick Reply Payload OppId**' + opportunity); 
		
			//salesforce.createOpportunityProduct(prevProduct,Price,SelectedQuantity);
			
			salesforce.createOpportunityProduct(prevProduct,Price,SelectedQuantity,opportunity).then(PriceBookId => {
				
				//console.log('PriceBookId paaaah' + PriceBookId);
				
				sendMessage({text: `Your menu and quanitiy selection has been added to the cart .. 📝 `}, sender);								
				
				sendMessage({attachment:{
                                        "type": "template",
                                        "payload": {
                                            "template_type":"button",
                                            "text":"Would you like to order some more food items?",
                                            "buttons":[
                                              {
                                                "type":"postback",
                                                "title":"👆 Yes",
                                                "payload":"Order_More,"
                                              },
					      {
                                                "type":"postback",
                                                "title":"👍 No- (Place Order)",
                                                "payload":"No_Enf," + opportunity
                                              },	    
                                              {
                                                "type":"postback",
                                                "title":"🎁 Show Cart.",
                                                "payload":"Show_Cart," + opportunity
                                              }
                                            ]
                                        }
                                    }
                                }, sender);
					
				
			 });
			
		        /*if(event.message.text != 'hi'){
				sendMessage({text: `Your menu and quanitiy selection has been added to the cart !!`}, sender);
				sendMessage({attachment:{
                                        "type": "template",
                                        "payload": {
                                            "template_type":"button",
                                            "text":"Would you like to order some more items from this shop?",
                                            "buttons":[
                                              {
                                                "type":"postback",
                                                "title":"Yes",
                                                "payload":"Order_More," + payload[3]
                                              },
                                              {
                                                "type":"postback",
                                                "title":"No- It`s enough.",
                                                "payload":"No_Enf,"
                                              }
                                            ]
                                        }
                                    }
                            }, sender);
			}*/
											
			
		}	
		
		
		
	}else if(event.message && (event.message.text && event.message.quick_reply) ){		
		
		console.log('Quick Reply Flow**');		    
		
		var SelectedQuantity = event.message.text;    
		console.log('Selected QUANTITY Stringify Inside**' + SelectedQuantity);
			     	
		var quickpayload0=event.message.quick_reply.payload;
		console.log('Quick Replies payload**' + quickpayload0);		
		
		var quickpayload1 =JSON.parse(event.message.quick_reply.payload);    
		console.log('Quick Replies payload KEY PARSING**' + quickpayload1.PrevMenuSelection); 	   		    
		
		var prevProduct = quickpayload1.PrevMenuSelection;
		console.log('Quick Reply Payload PRODUCTID**' + prevProduct); 		    
	       	
		var Price = quickpayload1.Price;
		console.log('Quick Reply Payload PRICE**' + Price); 
		
		salesforce.createOpportunityProduct(prevProduct,Price,SelectedQuantity).then(PriceBookEntryId => {    
			console.log('created opportunitityproduct');
	         });     	
			
        }else if (event.postback) {		
		console.log("Postback received only for type postback and not for quick replies:****** " + JSON.stringify(event.postback));						
                let payload = event.postback.payload.split(",");
                 if (payload[0] === "Show_Branches"){     
			 
                     console.log('payload[1]' + payload[1]);
		     console.log('payload[3]' + payload[3]);
			 
                     salesforce.findOpenBranches(payload[1]).then(Accounts => {    
                            sendMessage(formatter.formatOpenBranches(Accounts), sender);  
                     }); 
		     
		    if(payload[3] == 'Play Game'){
			    sendMessage({text: `Click the ball and start playing !!`}, sender);  
			    sendMessage({text: `🏀`}, sender);    
		    }		    
			 
                 }
                 else if (payload[0] === "Main_Menu"){     
                     console.log('Selected branch will show their available menus' + payload[1]);  
		     var newOpp;
		      //Hitendar
		      getUserInfo(sender).then(response => {         
			       salesforce.createOpportunity(response.first_name,response.last_name,sender,payload[1]).then(Opportunity => {    
			       newOpp = Opportunity;
			       console.log('created opportunitity '+newOpp);
			       //Hitendar
				      salesforce.findMainMenus(payload[1]).then(MainMenus => {   
					  console.log('Going inside main menus');
					  sendMessage(formatter.formatMainMenus(MainMenus,newOpp), sender);  
				     }); 
			       }); 
		      });
		         
                 }else if (payload[0] === "Sub_Menu"){     
                     
                     console.log('Origin Branch - payload [1]**' + payload[1]);    
                     console.log('Origin parent product - payload [2]**' + payload[2]); 
                     console.log('Opportunity - Payload[3]'+payload[3]);
			 
                     salesforce.findSubMenus(payload[1], payload[2]).then(SubMenus => {   
                          console.log('Going inside Sub menus');
                          sendMessage(formatter.formatSubMenus(SubMenus,payload[3]), sender);  // Hitendar
                     });   
                     
                 } 
                //Hitendar
	 	else if (payload[0] === "Quantity"){                          
                     console.log('Origin Branch - payload [1]**' + payload[1]);    		     
		     console.log('Origin Branch - payload [2]**' + payload[2]);    		     
		     console.dir('Origin Branch - payload [2]**' + payload[2]);    		     
                     salesforce.getSelectedMenu(payload[1]).then(SelectedMenu => {   
                          console.log('Going inside quantity');
                          sendMessage(formatter.formatQuantity(SelectedMenu,payload[2]), sender);  // Hitendar			  
                     }); 
		     
                 } 
                 //Hitendar
		else if (payload[0] === "Order_More"){ 
			console.log('Order More**');
		}	
		else if (payload[0] === "No_Enf"){ 
			console.log('No Enough**');
			salesforce.findOpportunityLineItem(payload[1]).then(SelectedItems  => {   			  		         		          							
			  sendMessage({text: `Preparing Receipt for you `}, sender);				  
                          sendMessage(formatter.formatOrder(SelectedItems), sender);  // Hitendar		          			  					
			  sendMessage({text: `❤️`}, sender);			
                        });   
		}
		else if (payload[0] === "Show_Cart"){ 
			console.log('Show Cart**' + payload[1] );
			
			salesforce.findOpportunityLineItem(payload[1]).then(SelectedItems  => {   
			  
			  adddomain(); // Whitelist domain for payumoney URL	
				
                          console.log('Before Show Cart Formatting');
		         
		          			
				
			  sendMessage({text: `Here is your cart  🍜`}, sender);
				
                          sendMessage(formatter.formatShowCart(SelectedItems), sender);  // Hitendar
		          
			  	
				
                        });   
			
		}
		
        }
    }    
    res.sendStatus(200);
};

exports.handleGet = handleGet;
exports.handlePost = handlePost;
exports.getUserInfo = getUserInfo;
