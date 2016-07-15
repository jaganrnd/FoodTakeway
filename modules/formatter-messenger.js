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


let formatModel = Opportunities => {
    /*let elements = [];
    Opportunities.forEach(opportunity =>
        elements.push({
            title: opportunity.get("Name"),
            subtitle: opportunity.get("Account").Name + " · $" + opportunity.get("Amount"),
            "image_url": "https://s3-us-west-1.amazonaws.com/sfdc-demo/messenger/opportunity500x260.png",
            "buttons": [
                {
                    "type": "web_url",
                    "url": "https://login.salesforce.com/" + opportunity.getId(),
                    "title": "Open in Salesforce"
                }]
        })
    );*/
    return {
        "attachment": {
           // "type": "image",
            //"payload": {
              //  "url":"https://media.gq.com/photos/5583cb8309f0bee56442585f/master/pass/style-blogs-the-gq-eye-sunglasses-628.gif"
            //}
            "type":"audio",
             "payload":{
                "url":"hhttp://www.readthewords.com/work/output/instant_42016.458.mp3"
              }
        }
    };  
};


/*let formatOrder = Opportunities => {
    let elements = [];
    Opportunities.forEach(opportunity =>
        elements.push({
            "title":"Classic White T-Shirt",
            "subtitle":"100% Soft and Luxurious Cotton",
            "quantity":2,
            "price":50,
            "currency":"USD",
            "image_url":"http://www.customembossers.com/images/made-to-order-logo.png"
            "summary":({
                  "subtotal":75.00,
                  "shipping_cost":4.95,
                  "total_tax":6.19,
                  "total_cost":56.14
            })
        })
    );
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "receipt",
                "recipient_name":"Stephane Crozatier",
                "order_number":"12345678902",
                "currency":"USD",
                "payment_method":"Visa 2345",        
                "order_url":"https://www.godaddy.com",
                "timestamp":"1428444852", 
                "elements": elements
            }
        }
    };*/
};


exports.formatAccounts = formatAccounts;
exports.formatContacts = formatContacts;
exports.formatOpportunities = formatOpportunities;
exports.formatOpp = formatOpp;
exports.formatModel = formatModel;
//exports.formatOrder = formatOrder;
