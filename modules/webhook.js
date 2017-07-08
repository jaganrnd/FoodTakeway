"use strict"; //hello

var PAYMENT_BASE_URL = 'https://test.payumoney.com';

let request = require('request'),
    salesforce = require('./salesforce'),
    formatter = require('./formatter-messenger'),
    payumoney = require('./payumoney');

let sendMessage = (message, recipient) => {
    return new Promise((resolve, reject) => {           
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
	resolve(true);
    });
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
            
//CHECK0UT
let proceedcheckout = () => {  
  return new Promise((resolve, reject) => {           
        request({
           url: 'https://test.payu.in/_payment',		
	   qs: {key:"ODXCt7nX",
		 txnid:"1234",
		 amount:"100",
		 productinfo:"test123",
		 surl:"test1.com",
		 hash:"75cf4d5f755f7575e98e65f653f27141a025229179c9f15dc5c067cb24aa0139d98b12a8c840bf3886dc41174d0d47ac606c881b0a6e15527a7bf4d54faad948",		 
		 firstname:"hk",
		 email:"h@gmail.com",
		 phone:"8888888888",		 
		 furl:"test1.com",		 
                 service_provider:"payu_paisa"},			
            method: 'GET'
        }, (error, response) => {
            if (error) {
                console.log('Error sending message: ', error);
                reject(error);
            } else if (response.body.error) {
                console.log('ERROR PAYMENT : ', response.body.error);
            } else {
                console.log("INNER PAYMENT");               
		console.log('PAYMENT RESPONSE HEADER**' + response.header);    
		console.log('PAYMENT RESPONSE BODY**' + response.body);
                //resolve(JSON.parse(response.body));
            }    
        });    
    });      
};
//CHECK0UT



let getAddress = (lat, lng, parentAccountId,sender) => {
            console.log('Yappa Inside Callout pa', lat);
            console.log('Yappa Inside Callout pa', lng);
            console.log('Inside Callout');
  	    console.log('URL***'+'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&location_type=GEOMETRIC_CENTER&key=AIzaSyCOKmcmLPD3KqyfaiMTr3GIcXTPYJVKNa4');
            request({
                //https://maps.googleapis.com/maps/api/geocode/json?latlng=12.977165,80.138902&key=AIzaSyCOKmcmLPD3KqyfaiMTr3GIcXTPYJVKNa4
                url:'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&location_type=GEOMETRIC_CENTER&key=AIzaSyCOKmcmLPD3KqyfaiMTr3GIcXTPYJVKNa4',
                //qs: {latlng:{lat,lng}, key: 'AIzaSyCOKmcmLPD3KqyfaiMTr3GIcXTPYJVKNa4'},
                //sendMessage({text: ` Latitude "${lat}" `}, sender);
                method: 'GET',
            }, (error, response, request) => {
                if (error) {
                    console.log('Error sending message: ', error);
                }else if (response) {
                    console.log('Responseuu*** ', JSON.parse(response.body));
			console.log('Responseuu123*** ', JSON.parse(response.body).results);
		    /*
		    var subLocality = JSON.parse(response.body).results[0].address_components[2].long_name;
		    console.log('sub locality***'+subLocality);
		    salesforce.findOpenBranches('0012800000tbvur',subLocality).then(Accounts => {
		    */
		    salesforce.findOpenBranchesLatLong('0012800000tbvur',lat,lng).then(Accounts => {
			    if(Accounts.length > 0){
				sendMessage({text: `Below is the nearest branche available. Please proceed if you need to order food`}, sender);
                            	sendMessage(formatter.formatOpenBranches(Accounts,lat,lng), sender);  
			    }
			    else{
			    	sendMessage({text: `Sorry. There is no branch available near by :(`}, sender);
			    }
                     }); 
                }else if (response.body.error) {
                    console.log('Error: ', response.body.error);
                }
            });
};

function adddomain(){
	 //https://graph.facebook.com/v2.6/me/thread_settings?access_token=PAGE_ACCESS_TOKEN
	 console.log('Going to whitelist Domain**');	
	 request({
	    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
	    qs: {access_token: process.env.FB_PAGE_TOKEN},
	    method: 'POST',
	    json:{
		setting_type : "domain_whitelisting",
		whitelisted_domains : ["https://payumoney.com",
				       "https://peterssendreceiveapp.ngrok.io/shop_collection",
				       "https://peterssendreceiveapp.ngrok.io/collection",
				       "https://peterssendreceiveapp.ngrok.io/shop?item=102",
				       "https://kolapasi-developer-edition.ap2.force.com",
				       "https://test.payu.in/_payment"],
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

// GET STARTED BUTTON - START
function addGetStartedButton(sender){
	 console.log('Going to GetStarted Flow**');	
	 var messageData = {
          "get_started":[
             {
              "payload":"Play Game"
             }
       	   ]
	 }
	 request({
	    url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
	    qs: {access_token: process.env.FB_PAGE_TOKEN},
	    method: 'POST',
	    json:{
 		 recipient: {id:sender},
       		 message: messageData,
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
// GET STARTED BUTTON - END
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
		console.log('Event.Message.Text length**' + event.message.text.length);
		
		if(event.message.text == 'hi' || event.message.text == 'Hi' || event.message.text == 'Hello' || event.message.text == 'hello'){
			console.log('Normal Flow**');	
			adddomain();  // WHITELISTING DOMAINS
			processText(event.message.text, sender); // WHY KILLING SAMBU MAVAN
		}
		else if(event.message.text == 'bye' || event.message.text == 'Bye'){
			adddomain();
			sendMessage({
					"attachment": {
						"type": "template",
						"payload": {
						    "template_type": "list",
						    "elements": [
							{
							    "title": "Classic T-Shirt Collection",
							    "image_url": "https://peterssendreceiveapp.ngrok.io/img/collection.png",
							    "subtitle": "See all our colors",
							    "default_action": {
								"type": "web_url",
								"url": "https://peterssendreceiveapp.ngrok.io/shop_collection",
								"messenger_extensions": true,
								"webview_height_ratio": "tall",
								"fallback_url": "https://peterssendreceiveapp.ngrok.io/"
							    },
							    "buttons": [
								{
								    "title": "View",
								    "type": "web_url",
								    "url": "https://peterssendreceiveapp.ngrok.io/collection",
								    "messenger_extensions": true,
								    "webview_height_ratio": "tall",
								    "fallback_url": "https://peterssendreceiveapp.ngrok.io/"                        
								}
							    ]
							},
							{
							    "title": "Classic Black T-Shirt",
							    "image_url": "https://peterssendreceiveapp.ngrok.io/img/black-t-shirt.png",
							    "subtitle": "100% Cotton, 200% Comfortable",
							    "default_action": {
								"type": "web_url",
								"url": "https://peterssendreceiveapp.ngrok.io/view?item=102",
								"messenger_extensions": true,
								"webview_height_ratio": "tall",
								"fallback_url": "https://peterssendreceiveapp.ngrok.io/"
							    },
							    "buttons": [
								{
								    "title": "Shop Now",
								    "type": "web_url",
								    "url": "https://peterssendreceiveapp.ngrok.io/shop?item=102",
								    "messenger_extensions": true,
								    "webview_height_ratio": "tall",
								    "fallback_url": "https://peterssendreceiveapp.ngrok.io/"                        
								}
							    ]                
							}
						    ],
						     "buttons": [
							{
							    "title": "View More",
							    "type": "postback",
							    "payload": "payload"                        
							}
						    ]  
						}
					    }
			},sender);
		}
		else if(event.message.text.length  == 10){
			console.log('Phone Number entered***');	
			if(!isNaN(event.message.text)){
				salesforce.updatePhone(event.message.text, null, null,sender);
			}
			salesforce.getRecentOpportunityFromContactId(sender).then(oppId =>{
				sendMessage(formatter.proceedToPay(oppId), sender);  
			});
			//sendMessage({text: `Please share your location for delivery`}, sender);
			//sendMessage(formatter.formatShareLocation(), sender);  
			//console.log('location Display');
			//sendMessage({text: "Thanks for sharing your number. We will contact you shortly"}, sender);
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
			
			var opportunityId = quickpayload1.OpportunityId;
			console.log('Quick Reply Payload OppId**' + opportunityId); 
			
			var accountId = quickpayload1.AccountId;
			console.log('Quick Reply Payload AccId**' + accountId); 
			
			var OLIId = quickpayload1.OLIId;
			console.log('Quick Reply Payload OLIId**' + OLIId); 
		
			//salesforce.createOpportunityProduct(prevProduct,Price,SelectedQuantity);
			
			salesforce.createOpportunityProduct(prevProduct,Price,SelectedQuantity,opportunityId,OLIId).then(PriceBookId => {
				
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
                                                "payload":"Main_Menu," + accountId + "," + opportunityId
                                              },
					      {
                                                "type":"postback",
                                                "title":"👍 No- (Place Order)",
                                                "payload":"No_Enf," + opportunityId
                                              },	    
                                              {
                                                "type":"postback",
                                                "title":"🎁 Show Cart.",
                                                "payload":"Show_Cart," + opportunityId +  "," + accountId
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
			
        }
	//Newly addded
	else if (event.message && event.message.attachments) {
		var parentAccountId;
		console.log('location payload***'+event.message.quick_reply);
		
		if(event.message.quick_reply){
			parentAccountId = JSON.parse(event.message.quick_reply.payload).parentAccountId;
		}
                console.log('Inside Location Loop ', event.message.attachments[0].type);
		console.log('Inside Location Loop payload', event.message.attachments[0].payload);
                if(event.message.attachments[0].type == 'location'){
                    console.log('GETHU DA................');
                    var lat = event.message.attachments[0].payload.coordinates.lat;
                    var lng = event.message.attachments[0].payload.coordinates.long;
                    //sendMessage({text: `Thanks For Sharing Your Location. We will contact you shortly`}, sender);
		    getAddress(lat,lng,parentAccountId,sender);
		    //salesforce.updatePhone(null, lat, lng,sender);
                    /*sendMessage({text: ` Latitude "${lat}" `}, sender);
                    sendMessage({text: ` Longitude "${lng}" `}, sender);
                    getAddress(lat,lng);
		    */
			
                }
        }    
	    
	//Newly added
	else if (event.postback) {		
		console.log("Postback received only for type postback and not for quick replies:****** " + JSON.stringify(event.postback));						
                let payload = event.postback.payload.split(",");
		
                 if (payload[0] === "Show_Branches" && payload[3] == 'Order Food'){     
			 
                     console.log('payload[1]' + payload[1]);
		     console.log('payload[3]' + payload[3]);
		     var obj = { 'parentAccountId': payload[1]};
	 	     var payloadParameters = JSON.stringify(obj);
		     console.log('payload parameters'+payloadParameters);
                     sendMessage({text: "Please share your location to help you with nearest branches. Make sure your Location in ON", 
				     quick_replies: [
				    	 {
					  "content_type":"location",
					  "title":"Share Location",
					  "payload": payloadParameters
					}
					     ]
				    }, sender);
		     
		     
                 }
		
		
		//NEWLY ADDED ON 25 - JULY - 2017		
		else if(payload[3] == 'Feedback/Enquiry'){
			    sendMessage({text: `Please feel free to Feedback/Enquiry.We are happy to hear from you :) :)`}, sender);  
			    //sendMessage({text: `🏀`}, sender);    
			    console.log('Incoming feedback**');   
		}		
		//NEWLY ADDED ON 25 - JULY - 2017
		
		
		else if(payload[3] == 'Play Game'){
			    sendMessage({text: `Click the ball and start playing !!`}, sender);  
			    sendMessage({text: `🏀`}, sender);    
		    }
                 else if (payload[0] === "Main_Menu"){     
                     console.log('Selected branch will show their available menus' + payload[1]);  
		     var newOpp;
		      //Hitendar
		      getUserInfo(sender).then(response => {    
			  console.log('Existin opp ****'+payload[2]);
			  if(payload[2] == null || payload[2] == ''){
			       salesforce.createOpportunity(response.first_name,response.last_name,sender,payload[1],payload[3],payload[4]).then(Opportunity => {    
			       newOpp = Opportunity;
			       console.log('created opportunitity '+newOpp);
			       //Hitendar
				      salesforce.findMainMenus(payload[1]).then(MainMenus => {   
					  console.log('Going inside main menus');
					  sendMessage({text: `Please swipe to your right 👉🏼👉🏼`}, sender);     
					  sendMessage(formatter.formatMainMenus(MainMenus,newOpp,payload[1]), sender);  
				     }); 
			       }); 
			  }
			  else{
				  console.log('Existing opportunitity '+payload[2]);
				  salesforce.findMainMenus(payload[1]).then(MainMenus => {   
					  console.log('Going inside main menus');
					  sendMessage({text: `Please swipe to your right 👉🏼👉🏼`}, sender);
					  sendMessage(formatter.formatMainMenus(MainMenus,payload[2],payload[1]), sender);  
				     });
			  }
		      });
		         
                 }else if (payload[0] === "Sub_Menu"){     
                     
                     console.log('Origin Branch - payload [1]**' + payload[1]);    
                     console.log('Origin parent product - payload [2]**' + payload[2]); 
                     console.log('Opportunity - Payload[3]'+payload[3]);
			 
                     salesforce.findSubMenus(payload[1], payload[2]).then(SubMenus => {   
                          console.log('Going inside Sub menus');
			  sendMessage({text: `Please swipe to your right 👉🏼👉🏼`}, sender);   
                          sendMessage(formatter.formatSubMenus(SubMenus,payload[3],payload[4]), sender);  // Hitendar
                     });   
                     
                 } 
                //Hitendar
	 	else if (payload[0] === "Quantity"){                          
                     console.log('Origin Branch - payload [1]**' + payload[1]);    		     
		     console.log('Origin Branch - payload [2]**' + payload[2]);    		     
		     console.dir('Origin Branch - payload [2]**' + payload[2]);    		     
                     salesforce.getSelectedMenu(payload[1]).then(SelectedMenu => {   
                          console.log('Going inside quantity');
                          sendMessage(formatter.formatQuantity(SelectedMenu,payload[2],payload[3]), sender);  // Hitendar			  
                     }); 
		     
                 } 
                 //Hitendar
		else if (payload[0] === "Order_More"){ 
			console.log('Order More**');
		}
		else if (payload[0] === "Change_Quantity"){ 
			console.log('Change Quantity**');
			salesforce.getSelectedMenuFromOli(payload[1],payload[3]).then(SelectedMenu => {   
                          console.log('Going inside quantity');
                          sendMessage(formatter.formatQuantity(SelectedMenu,payload[2],payload[3],payload[1]), sender);  // Hitendar			  
                     }); 
		}
		else if (payload[0] == "Remove"){
			console.log('Remove Cart**');
			salesforce.removeOLI(payload[1]).then(SelectedMenu => {   
                          console.log('OLI Removed*');
			  sendMessage({text: `Selected item has been removed from your cart`}, sender);
                          salesforce.findOpportunityLineItem(payload[2]).then(SelectedItems  => {   
			  
			  adddomain(); // Whitelist domain for payumoney URL	
				
                          console.log('Before Show Cart Formatting');
		          if(SelectedItems == null){
			  	console.log('account Id***'+payload[3]);
				salesforce.findMainMenus(payload[3]).then(MainMenus => {   
					 console.log('Going inside main menus');
					  sendMessage({text: `There is no item in your cart now. Please select from menu`}, sender);
					  sendMessage(formatter.formatMainMenus(MainMenus,payload[2],payload[3]), sender);  
				     });
			  }
		          			
			  else{	
				  sendMessage({text: `Here is your cart  🍜`}, sender);

				  sendMessage(formatter.formatShowCart(SelectedItems, payload[3]), sender);  // Hitendar
			  }
		          
			  	
				
                        });   			  
                     }); 
		}
		else if (payload[0] === "No_Enf"){ 
			console.log('No Enough**');
			salesforce.findOpportunityLineItem(payload[1], true).then(SelectedItems  => {   			  		         		          							
			  sendMessage({text: `Preparing Receipt for you `}, sender);	
			  salesforce.getContactDetails(sender).then(contacDetail =>{
                          sendMessage(formatter.formatOrder(SelectedItems, contacDetail), sender).then(orderSent => {   // Hitendar		          			  					
				  sendMessage({text: `❤️`}, sender);
					  if(contacDetail.get("mobilePhone") == null || contacDetail.get("mobilePhone") == ''){
					  	sendMessage({text: `Please enter your phone number without code `}, sender);
					  }
					  else{
						  console.log('oppId****'+payload[1]);
					  	sendMessage(formatter.confirmPhone(contacDetail.get("mobilePhone"),payload[1]), sender); //Included OpptyId(April4)
					  }
				  });
			  });
                        });   
		}
		//CHECKOUT 
		else if (payload[0] === "Make_Payment"){ 
			console.log('Inside checkout flow**');
			//proceedcheckout();			
		}	
		else if (payload[0] === "Number_Confirmed"){ 
			console.log('Number confirmed');
			//sendMessage({text: `Please share your location for delivery`}, sender);
			//sendMessage(formatter.formatShareLocation(), sender);  
			console.log('location Display');
			sendMessage({text: "Thanks for sharing your number. We will contact you shortly"}, sender);
			/*payumoney.paymentFields.then(fields =>{
				console.log('fields***'+fields);
			});*/
		}
		else if (payload[0] === "Show_Cart"){ 
			console.log('Show Cart**' + payload[1] );
			
			salesforce.findOpportunityLineItem(payload[1]).then(SelectedItems  => {   
			  
			  adddomain(); // Whitelist domain for payumoney URL	
				
                          console.log('Before Show Cart Formatting');
		         
		          			
			if(SelectedItems == null){
			  	
				console.log('account Id***'+payload[2]);
				salesforce.findMainMenus(payload[2]).then(MainMenus => {   
					  console.log('Going inside main menus');
					  sendMessage({text: `There is no item in your cart now. Please select from menu`}, sender);
					  sendMessage(formatter.formatMainMenus(MainMenus,payload[1],payload[2]), sender);  
				     });
			  }
		          			
			  else{	
				  sendMessage({text: `Here is your cart  🍜`}, sender);

				  sendMessage(formatter.formatShowCart(SelectedItems, payload[2]), sender).then(result => {
					  sendMessage(formatter.placeOrder(SelectedItems, payload[2]), sender);  // Hitendar
				  });
				  
				  
			  }
		          
			  	
				
                        });   
			
		}
		
		
        }
	    
    }    
    res.sendStatus(200);
};

exports.handleGet = handleGet;
exports.handlePost = handlePost;
exports.getUserInfo = getUserInfo;
exports.getAddress = getAddress;
exports.proceedcheckout = proceedcheckout;
