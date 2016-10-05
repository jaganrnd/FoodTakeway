"use strict";


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
                    "title":"Hit Me",
                    "payload": "Show_Branches," + Account.getId() + "," + Account.get("Name")
                    
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

let formatOpenBranches= Accounts => {
    let elements = [];
    Accounts.forEach(Account =>
        elements.push({
            title: Account.get("Name"),
            subtitle: Account.get("Description"),
            "image_url": Account.get("Picture_URL__c"),
            "buttons": [
                {
                    "type":"postback",
                    "title":"Hit Me",
                    "payload": "Main_Menu," + Account.getId() + "," + Account.get("Name")
                    
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



let formatMainMenus= MainMenus => {
  let elements = [];
    MainMenus.forEach(Menu__c =>
        elements.push({
            "title": Menu__c.get("Product__r").Name,
            "subtitle": Menu__c.get("Product__r").Description,
            "image_url": Menu__c.get("Product__r").PICURL__c,
            "buttons": [
                {
                    "type":"postback",
                    "title":"View Me",
                    "payload": "Sub_Menu,"  +  Menu__c.get("Account__c") + "," + Menu__c.get("Product__c")
                    
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

let formatSubMenus= SubMenus => {
  let elements = [];
    SubMenus.forEach(Menu__c =>
        elements.push({
            "title": Menu__c.get("Product__r").Name,
            "subtitle": Menu__c.get("Product__r").Description,
            "image_url": Menu__c.get("Product__r").PICURL__c,
            "buttons": [
                {
                    "type":"postback",
                    "title":"View Me",
                    "payload": "Quantity,"  +  Menu__c.get("Id") 
                    
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
/* Hitendar */
let formatQuantity= SelectedMenu => {
    let elements = [];
    console.log(SelectedMenu[0]);
    for (var i = 1; i <= 5; i++) {
		elements.push({
			"content_type":"text",
			"title":i,
			"payload":"Show_Branches,"
		});
	}
    return {
        "text": "Please select quantity",
         "quick_replies": elements
    };  
	
};
/* Hitendar */

exports.formatTitleCard = formatTitleCard;
exports.formatQuickReplies = formatQuickReplies;
exports.formatOpenBranches = formatOpenBranches;
exports.formatMainMenus = formatMainMenus;
exports.formatSubMenus = formatSubMenus;
exports.formatQuantity = formatQuantity;
