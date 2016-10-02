"use strict";


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
                    "title":"Hit Me",
                    "payload": "Am_Hungry," + opportunity.getId() + "," + opportunity.get("Name")
                    
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
                    "title":"Show Menu",
                    "payload": "Show_Menu," + product2.getId() + "," + product2.get("Name")
                    
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


let formatMenu = Products => {
    let elements = [];
    Products.forEach(Menu__c  =>
        elements.push({
            title: Menu__c .get("Name"),
            subtitle: Menu__c.get("Price__c"),
            "image_url": Menu__c.get("PICURL__c"),
            "buttons": [
                {
                    /*"type": "web_url",
                    "url": "https://login.salesforce.com/" + opportunity.getId(),
                    "title": "Buy"*/
                    
                    "type":"postback",
                    "title":"Pick Me",
                    //"payload": "Create_Invoice," + Menu__c.getId() + "," + Menu__c.get("Name")
                    "payload": "Create_Invoice," + Menu__c.getId() + "," + Menu__c.get("Name") +"," + Menu__c.get("Product__c")
                    
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



exports.formatContacts = formatContacts;
exports.formatOpportunities = formatOpportunities;
exports.formatOpp = formatOpp;
exports.formattone = formattone;
exports.formatnewModel = formatnewModel;
exports.formatQuickReplies = formatQuickReplies;
exports.formatWayfarerModels = formatWayfarerModels;
exports.formatTitleCard = formatTitleCard;
exports.formatShops = formatShops;
exports.formatMenu = formatMenu;

