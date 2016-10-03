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
        return {
            "text":"Pick 1 model:",
            "quick_replies":[
                {
                    "content_type":"text",
                    "title":"Square",
                    "payload":"close_won"
                },
                {
                    "content_type":"text",
                    "title":"Rectangular",
                    "payload":"close_won"
                },
                {
                    "content_type":"text",
                    "title":"Wayfarer",
                    "payload":"close_won"
                },
                {
                    "content_type":"text",
                    "title":"Aviator",
                    "payload":"close_won"
                }]   
        };    
};


exports.formatTitleCard = formatTitleCard;
exports.formatQuickReplies = formatQuickReplies;
