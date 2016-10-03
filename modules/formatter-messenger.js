"use strict";

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



exports.formatShops = formatShops;
exports.formatMenu = formatMenu;

