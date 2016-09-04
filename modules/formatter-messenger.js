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
    
/*let formatQuickReplies = Opportunities => {    
    let quick_replies  = [];
    Opportunities.forEach(opportunity =>
        quick_replies.push({
                "content_type":"text",
                "title":"Rectangular",
                "payload":"close_won," + opportunity.getId() + "," + opportunity.get("Name")
                
        })
    );
    return {
            "text":"Pick a Model:",
            "quick_replies": quick_replies
            };
};*/


let formatQuickReplies = Opportunities => {    
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


let formatWayfarerModels = Opportunities => {
    let elements = [];
    Opportunities.forEach(opportunity =>
        elements.push({
            title: opportunity.get("Name"),
            subtitle: opportunity.get("Description"),
            "image_url": opportunity.get("Picture_URL__c"),
            "buttons": [
                {
                    /*"type": "web_url",
                    "url": "https://login.salesforce.com/" + opportunity.getId(),
                    "title": "Buy"*/
                    
                    "type":"postback",
                    "title":"Buy",
                    "payload": "Order_Now," + opportunity.getId() + "," + opportunity.get("Name")
                    
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


let formatTitleCard = Opportunities => {
    let elements = [];
    Opportunities.forEach(opportunity =>
        elements.push({
            title: opportunity.get("Name"),
            subtitle: opportunity.get("Description"),
            "image_url": opportunity.get("Picture_URL__c"),
            "buttons": [
                {
                    /*"type": "web_url",
                    "url": "https://login.salesforce.com/" + opportunity.getId(),
                    "title": "Buy"*/
                    
                    "type":"postback",
                    "title":"Order",
                    "payload": "Make_Order," + opportunity.getId() + "," + opportunity.get("Name")
                    
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




let formatShops = Products => {
    let elements = [];
    Products.forEach(product2 =>
        elements.push({
            title: product2.get("Name"),
            subtitle: product2.get("Description"),
            "image_url": product2.get("PICURL__c"),
            "buttons": [
                {
                    /*"type": "web_url",
                    "url": "https://login.salesforce.com/" + opportunity.getId(),
                    "title": "Buy"*/
                    
                    "type":"postback",
                    "title":"Order",
                    "payload": "Make_Order," + product2.getId() + "," + product2.get("Name")
                    
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


//new
let formatOrder = Opportunities => {
    let elements = [];
    Opportunities.forEach(opportunity =>
        elements.push({
            "title":opportunity.get("Name"),
            "subtitle":opportunity.get("Type"),
            "quantity":1,
            "price":opportunity.get("Amount"),
            "currency":"INR",
            "image_url":opportunity.get("Picture_URL__c")
        })
    );
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "receipt",
                "recipient_name":"JAGU",
                "order_number":"12345678902",
                "currency":"INR",
                "payment_method":"Visa 2345",        
                "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
                "timestamp":"1428444852", 
                "elements": elements,
                "address":{
                    "street_1":"1 Hacker Way",
                    "street_2":"",
                    "city":"Menlo Park",
                    "postal_code":"94025",
                    "state":"CA",
                    "country":"US"
                },
                "summary":{
                    "subtotal":1500,
                    "shipping_cost":4.95,
                    "total_tax":6.19,
                    "total_cost":1511
                 }
            }
        }
    };
};

//end


exports.formatAccounts = formatAccounts;
exports.formatContacts = formatContacts;
exports.formatOpportunities = formatOpportunities;
exports.formatOpp = formatOpp;
exports.formattone = formattone;
exports.formatnewModel = formatnewModel;
exports.formatQuickReplies = formatQuickReplies;
exports.formatWayfarerModels = formatWayfarerModels;
exports.formatTitleCard = formatTitleCard;
exports.formatShops = formatShops;
exports.formatOrder = formatOrder;
