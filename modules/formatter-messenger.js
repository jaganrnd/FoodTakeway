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
        console.log('Account.getId()**' + Account.get("Id") );             
        elements.push({
             "content_type":"text",
             "title":Account.get("Name"),
             "payload":"Show_MainMenu," + Account.getId()
        
         })
    );
    return {
        "text": "Please choose your location:",
         "quick_replies": elements
    };  
};


exports.formatTitleCard = formatTitleCard;
exports.formatQuickReplies = formatQuickReplies;
