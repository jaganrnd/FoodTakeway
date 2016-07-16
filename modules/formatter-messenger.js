"use strict";

let formatAccounts = accounts => {
    let elements = [];
    accounts.forEach(account =>
        elements.push({
            title: account.get("Name"),
            subtitle: account.get("BillingStreet") + ", " + account.get("BillingCity") + " " + account.get("BillingState") + " · " + account.get("Phone"),
            "image_url": account.get("Picture_URL__c"),
            "buttons": [{
                "type":"postback",
                "title":"View Contacts",
                "payload": "view_contacts," + account.getId() + "," + account.get("Name")
            },{
                "type": "web_url",
                "url": "https://login.salesforce.com/" + account.getId(),
                "title": "Open in Salesforce"
            },
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

let formatContacts = contacts => {
    let elements = [];
    contacts.forEach(contact => {
        elements.push({
            title: contact.get("Name"),
            subtitle: contact.get("Title") + " at " + contact.get("Account").Name + " · " + contact.get("MobilePhone"),
            "image_url": contact.get("Picture_URL__c"),
            "buttons": [
                {
                    "type": "postback",
                    "title": "View Notes",
                    "payload": "view_notes," + contact.getId() + "," + contact.get("Name")
                },
                {
                    "type": "web_url",
                    "url": "https://login.salesforce.com/" + contact.getId(),
                    "title": "Open in Salesforce"
                }]
        })
    });
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

let formatOpportunities = opportunities => {
    let elements = [];
    opportunities.forEach(opportunity =>
        elements.push({
            title: opportunity.get("Name"),
            subtitle: opportunity.get("Account").Name + " · $" + opportunity.get("Amount"),
            "image_url": "https://s3-us-west-1.amazonaws.com/sfdc-demo/messenger/opportunity500x260.png",
            "buttons": [
                {
                    "type":"postback",
                    "title":"Close Won",
                    "payload": "close_won," + opportunity.getId() + "," + opportunity.get("Name")
                },
                {
                    "type":"postback",
                    "title":"Close Lost",
                    "payload": "close_lost," + opportunity.getId() + "," + opportunity.get("Name")
                },
                {
                    "type": "web_url",
                    "url": "https://login.salesforce.com/" + opportunity.getId(),
                    "title": "Open in Salesforce"
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

let formatOpp = Opportunities => {
    let elements = [];
    Opportunities.forEach(opportunity =>
        elements.push({
            title: opportunity.get("Name"),
            //subtitle: opportunity.get("Account").Name + " · $" + opportunity.get("Amount"),
            "image_url": "https://s3-us-west-1.amazonaws.com/sfdc-demo/messenger/opportunity500x260.png",
            "buttons": [
                {
                    "type": "web_url",
                    "url": "https://login.salesforce.com/" + opportunity.getId(),
                    "title": "Open in Salesforce"
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

let formattone = Opportunities => {
        return {
            "attachment": {
                "type":"audio",
                 "payload":{
                    "url":"http://www.readthewords.com/work/output/instant_42016.458.mp3"
                  }
            }
        };  
    }; 

let formatnewModel = Opportunities => {
        return {
            "attachment": {
                "type": "image",
                "payload": {
                    "url":"https://media.gq.com/photos/5583cb8309f0bee56442585f/master/pass/style-blogs-the-gq-eye-sunglasses-628.gif"
                }
            }
        };  
    };
    
let formatQuickReplies = Opportunities => {    
    let quick_replies = [];
    Opportunities.forEach(opportunity =>
        quick_replies.push({
                    "content_type":"text",
                    "title":"Red",
                    "payload":"close_won," + opportunity.getId() + "," + opportunity.get("Name")
        })
    );
    return {
            "text":"Pick a color:",
            "quick_replies": quick_replies
            };
};



















exports.formatAccounts = formatAccounts;
exports.formatContacts = formatContacts;
exports.formatOpportunities = formatOpportunities;
exports.formatOpp = formatOpp;
exports.formattone = formattone;
exports.formatnewModel = formatnewModel;
exports.formatQuickReplies = formatQuickReplies;
