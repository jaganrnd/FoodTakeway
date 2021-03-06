"use strict"; //hello


let formatTitleCard = Accounts => {
    let elements = [];
    
    Accounts.forEach(Account =>
        elements.push({
            title: Account.get("Name"),
            subtitle: Account.get("Description"),
            "image_url": Account.get("Picture_URL__c"),
            "buttons": [
                {
                    "type":"postback",
                    "title":Account.get("Type"),
                    "payload": "Show_Branches," + Account.getId() + "," + Account.get("Name") + "," + Account.get("Type")                      
                }	    
	    ]
	    
        })
    );
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};


let formatQuickReplies = Accounts => {    
  let elements = [];
    Accounts.forEach(Account =>          
        elements.push({
             "content_type":"text",
             "title":Account.get("Name"),
             "payload":"Show_Branches,"         
         })
    );
    return {
        "text": "Please choose your location:",
         "quick_replies": elements
    };  
};

let formatOpenBranches= (Accounts,lat,lng) => {
    let elements = [];
    Accounts.forEach(Account =>
        elements.push({
            title: Account.get("Name"),
            subtitle: Account.get("Description"),
            "image_url": Account.get("Picture_URL__c"),
            "buttons": [
                {
                    "type":"postback",
                    "title":"DELIVERY MENU",
                    "payload": "Main_Menu," + Account.getId() + "," + "" + "," + lat + "," +lng
                    
                }]
        })
    );
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};

/*let formatMainMenus= MainMenus => {
  let elements = [];
    MainMenus.forEach(Menu__c =>
        elements.push({
            "title": Menu__c.get("Name"),
            //"subtitle": Menu.get("Name"),
            "image_url": "https://farm8.staticflickr.com/7060/13265139384_9f686fb476_o.jpg",
            "buttons": [
                {
                    "type":"postback",
                    "title":"View Me",
                    "payload": "Sub_Menu,"
                    
                }]
        })
    );
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};*/



let formatMainMenus= (MainMenus,opportunity,account) => {
  let elements = [];
    MainMenus.forEach(Menu__c =>
        elements.push({
            "title": Menu__c.get("Product__r").Name,
            "subtitle": Menu__c.get("Product__r").Description,
            "image_url": Menu__c.get("Product__r").PICURL__c,
            "buttons": [
                {
                    "type":"postback",
                    "title":"SHOW ITEMS",
                    "payload": "Sub_Menu,"  +  Menu__c.get("Account__c") + "," + Menu__c.get("Product__c") + "," + opportunity + "," + account
                    
                }]
        })
    );
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};

let formatSubMenus= (SubMenus,Opporunity,Account) => {
  let elements = [];
    SubMenus.forEach(Menu__c =>
        elements.push({
            "title": Menu__c.get("Product__r").Name,
            "subtitle": Menu__c.get("Product__r").Description,
            "image_url": Menu__c.get("Product__r").PICURL__c,
	    //"image_url": Menu__c.get("Product__r").EmbedImage__c,
            "buttons": [
                {
                    "type":"postback",
                    "title":"ADD TO CART - ₹" + Menu__c.get("Price__c"),
                    "payload": "Quantity,"  +  Menu__c.get("Id") + "," + Opporunity + "," + Account
                    
                }]
        })
    );
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};
/*
let formatSubMenus= (SubMenus,Opporunity,Account) => {
  let elements = [];
	
	var i=0;
    SubMenus.forEach(Menu__c =>{
	if(i<3){
        elements.push({
            "title": Menu__c.get("Product__r").Name,
            "subtitle": Menu__c.get("Product__r").Description,
            "image_url": Menu__c.get("Product__r").PICURL__c,
	    //"image_url": Menu__c.get("Product__r").EmbedImage__c,
            "buttons": [
                {
                    "type":"postback",
                    "title":"ADD TO CART - ₹" + Menu__c.get("Price__c"),
                    "payload": "Quantity,"  +  Menu__c.get("Id") + "," + Opporunity + "," + Account
                    
                }]
        })
    }
	i++;}
    );
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "list",
		"top_element_style": "compact",
                "elements": elements,
		     "buttons": [
			{
			    "title": "View More",
			    "type": "postback",
			    "payload": "payload"                        
			}
		    ]  
            }
        }
    };
};
*/
/* Hitendar */
let formatQuantity= (SelectedMenu,Opportunity, Account, oli) => {
    let elements = [];    
    //Stringify the data that you want to pass as a payload	   
    //var obj = { 'PrevMenuSelection': SelectedMenu[0].get("Product__c") + "," + SelectedMenu[0].get("Price__c") };    
    var obj = { 'PrevMenuSelection': SelectedMenu[0].get("Product__c") ,  'Price':  SelectedMenu[0].get("Price__c"), 'OpportunityId' : Opportunity, 'AccountId' : Account, 'OLIId' : oli };	
    var shouldSend = JSON.stringify(obj);
    console.log( 'After Stringify**' +  shouldSend );    
  /* //And then parse JSON string when you recieve the payload.
   var jsonContent  = JSON.parse(shouldSend);   
   console.log( 'Immediate After Parsing**' + jsonContent );	
   console.log( 'After Parsed Values**' + jsonContent.PrevMenuSelection );		
   console.log( 'Incoming Product**' + jsonContent[0]);	*/			
    for (var i = 1; i <= SelectedMenu[0].get("Quantity__c"); i++) {
		elements.push({
			"content_type":"text",
			"title":i,
			//"payload":"Save_Order," + SelectedMenu[0].get("Product__c") + "," + SelectedMenu[0].get("Quantity__c") + "," + SelectedMenu[0].get("Price__c")		
			"payload":shouldSend 		
		});
	    	console.log('jus verification count loopthrough**' + shouldSend);
	}
    return {
	"text": "How many items of" + '<-->' + SelectedMenu[0].get("Product__r").Name + '<-->' + "do you need?",    
         "quick_replies": elements
    };  	
};

let formatShareLocation = () =>{
	return {
		"quick_replies":[
		      {
			"content_type":"location",
		      }
		    ]
	};
};
/* Hitendar */

let formatShowCart = (SelectedItems, accountId) => {
  let elements = [];
    SelectedItems.forEach(opportunitylineitem  =>
			  
        elements.push({
            "title": opportunitylineitem.get("product2").Name,
            "subtitle": "Quantity:" +  opportunitylineitem.get("quantity") + "," + "Price:" + opportunitylineitem.get("TotalPrice"),
            "image_url": opportunitylineitem.get("product2").PICURL__c,
            "buttons": [
		    
                {
                    "type":"postback",
                    "title":"Change Quantity",
                    "payload": "Change_Quantity,"  +  opportunitylineitem.getId() + "," + opportunitylineitem.get("opportunityid") + "," + accountId
                   
                },
	        {
                    "type":"postback",
                    "title":"Remove",
                    "payload": "Remove,"  +  opportunitylineitem.getId() + "," + opportunitylineitem.get("opportunityid") + "," + accountId
                   
                },
		/*
		{
                    "type":"postback",
                    "title":"Add More Items",
                    "payload": "Main_Menu," + accountId + "," + opportunitylineitem.get("opportunityid")
                   
                },
		{
                    "type":"web_url",
		    "url":"https://www.payumoney.com/pay/#/merchant/367CEAEDF82D367BD2D99C2A064FC7A7?param=Kolapasi",	
                    "title":"Place Order",
		    "webview_height_ratio": "compact",	
                     //"messenger_extensions": true,                      
                }
		
		 {
		    "type":"postback",
                    "title":"Place Order",	
		    "payload":"No_Enf," + opportunitylineitem.get("opportunityid")
                }
	    */
	    ]
	    
        })
			  
    );
	
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        } 
    };
};

let placeOrder = (SelectedItems, accountId) => {
	return {
		attachment:{
			"type": "template",
			"payload": {
			    "template_type":"button",
			    "text":"What's next?",
			    "buttons":[
			      {
				"type":"postback",
				"title":"Order More",
				"payload":"Main_Menu," + accountId + "," + SelectedItems[0].get("opportunityid")
			      },
			      {
				"type":"postback",
				"title":"Place Order",
				"payload":"No_Enf," + SelectedItems[0].get("opportunityid")
			      }
			    ]
			}
		    }
	}
};

let formatOrder = (SelectedItems, contactDetail) => {
    let elements = [];
    SelectedItems.forEach(opportunitylineitem   =>
        elements.push({
            "title":opportunitylineitem.get("product2").Name,
            //"subtitle":"Quantity:" +  opportunitylineitem.get("quantity") + "," + "Price:" + opportunitylineitem.get("TotalPrice"),
            "subtitle":"Quantity:" +  opportunitylineitem.get("quantity") + "," + "Price:" + opportunitylineitem.get("ListPrice"),
	    //"quantity": opportunitylineitem.get("quantity"),
            "price": opportunitylineitem.get("TotalPrice"),
            "currency":"INR",
            "image_url": opportunitylineitem.get("product2").PICURL__c,
	})
    );
	console.log('Current Time Stand in Seconds***'+Math.floor(Date.now() / 1000));
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "receipt",
                "recipient_name": SelectedItems[0].get("Opportunity").Name,
                "order_number":SelectedItems[0].get("Opportunity").Order_Number__c,
                "currency":"INR",
                "payment_method":"Online Payment",        
                "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
                "timestamp":Math.floor(Date.now() / 1000) + 45000, 
                "elements": elements,
                "address":{
                    "street_1":contactDetail.get("MailingStreet"),		    
                    "street_2":"",
                    "city":contactDetail.get("MailingCity"),		    
                    "postal_code":contactDetail.get("MailingPostalCode"),
                    "state":contactDetail.get("MailingState"),
                    "country":contactDetail.get("MailingCountry"),
                },
                "summary":{
                    "subtotal":SelectedItems[0].get("Opportunity").Amount,
                    "shipping_cost":0.00,
                    "total_tax":SelectedItems[0].get("Opportunity").Tax__c,
                    "total_cost": SelectedItems[0].get("Opportunity").Exact_Amount__c,
                 }
            }
        }
    };
};

let confirmPhone= (phoneNumber,OpptyId) => {
  let elements = [];
	console.log('webURL**'+'https://kolapasi-developer-edition.ap2.force.com?id='+OpptyId);
        elements.push({
            "title": "Please proceed to pay if below is your contact number or enter new one",
            "subtitle": phoneNumber,
            "buttons": [
                {
			//Commented since link is not redirecting via mobile browser
		    	 "type":"web_url",			
			//"url":"https://test.payu.in/_payment?key=MTeytuI5&txnid=12234445&amount=100&productinfo=test123&surl=test1.com&hash=386007ebcfb8eee2fc32d9ab41930aa7f1dfe7c93d82a5156f9a2e80bede590293af84b5f7b7cf989869a9d6e2109e5e3c75e4662f5c0d4f758b91284bba0202&firstname=hk&email=h@gmail.com&phone=8888888888&furl=test1.com&service_provider=payu_paisa",
			//"url":"https://test.payu.in/_payment",
			
			//"url" :"https://kolapasi-developer-edition.ap2.force.com?id=0062800000Ji6cu",
			"url" :"https://kolapasi-developer-edition.ap7.force.com?id="+OpptyId,
			"title":"Proceed to Pay",
			"webview_height_ratio": "FULL",
			"webview_share_button": "hide" //newly added on sunday april 8th
			
			//"type":"postback",
			//"title":"Proceed to CheckOut",
			//"payload":"Make_Payment,"
                    
                }]
        })
    
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};
let proceedToPay = (OpptyId) => {
  let elements = [];
	console.log('webURL**'+'https://kolapasi-developer-edition.ap2.force.com?id='+OpptyId);
        elements.push({
            "title": "Thanks for sharing your phone number",
            "subtitle": "",
            "buttons": [
                {
			//Commented since link is not redirecting via mobile browser
		    	 "type":"web_url",			
			//"url":"https://test.payu.in/_payment?key=MTeytuI5&txnid=12234445&amount=100&productinfo=test123&surl=test1.com&hash=386007ebcfb8eee2fc32d9ab41930aa7f1dfe7c93d82a5156f9a2e80bede590293af84b5f7b7cf989869a9d6e2109e5e3c75e4662f5c0d4f758b91284bba0202&firstname=hk&email=h@gmail.com&phone=8888888888&furl=test1.com&service_provider=payu_paisa",
			//"url":"https://test.payu.in/_payment",
			
			//"url" :"https://kolapasi-developer-edition.ap2.force.com?id=0062800000Ji6cu",
			"url" :"https://kolapasi-developer-edition.ap7.force.com?id="+OpptyId,
			"title":"Proceed to Pay",
			"webview_height_ratio": "FULL"
			
			//"type":"postback",
			//"title":"Proceed to CheckOut",
			//"payload":"Make_Payment,"
                    
                }]
        })
    
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};

let formatFeedBack = () => {
    let elements = [];
        elements.push({
            title: 'Thank You',
            subtitle: 'Your Feedback is Noted. Click on "Continue Chatting" to continue chatting with me.',
            "image_url": '',
            "buttons": [
                {
                    "type":"postback",
                    "title":'Continue Chatting',
                    "payload": "Get_Started"
                }	    
	    ]
	    
        })
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};


exports.formatTitleCard = formatTitleCard;
exports.formatQuickReplies = formatQuickReplies;
exports.formatOpenBranches = formatOpenBranches;
exports.formatMainMenus = formatMainMenus;
exports.formatSubMenus = formatSubMenus;
exports.formatQuantity = formatQuantity;
exports.formatShowCart = formatShowCart;
exports.formatOrder = formatOrder;
exports.confirmPhone = confirmPhone;
exports.formatShareLocation = formatShareLocation;
exports.proceedToPay = proceedToPay;
exports.placeOrder = placeOrder;
exports.formatFeedBack = formatFeedBack;

