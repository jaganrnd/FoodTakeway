"use strict";

let nforce = require('nforce'),

    SF_CLIENT_ID = process.env.SF_CLIENT_ID,
    SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET,
    SF_USER_NAME = process.env.SF_USER_NAME,
    SF_PASSWORD = process.env.SF_PASSWORD;

let org = nforce.createConnection({
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    //redirectUri: 'http://localhost:3000/oauth/_callback',Temp Comment Latest Check
    redirectUri: 'https://salesforcefbbot.herokuapp.com/webhook',
    mode: 'single',
    autoRefresh: true
});

let login = () => {
    org.authenticate({username: SF_USER_NAME, password: SF_PASSWORD}, err => {
        if (err) {
            console.error("Authentication error");
            console.error(err);
        } else {
            console.log("Authentication successful");
        }
    });
};

let findAccount = name => {
    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, BillingStreet, BillingCity, BillingState, Picture_URL__c, Phone FROM Account WHERE Name LIKE '%" + name + "%' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let accounts = resp.records;
                resolve(accounts);
            }
        });
    });

};

let findContact = name => {

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Title, Account.Name, Phone, MobilePhone, Email, Picture_URL__c FROM Contact WHERE Name LIKE '%" + name + "%' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let contacts = resp.records;
                resolve(contacts);
            }
        });
    });

};

let findContactsByAccount = accountId => {

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Title, Account.Name, Phone, MobilePhone, Email, Picture_URL__c FROM Contact WHERE Account.Id = '" + accountId + "' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let contacts = resp.records;
                resolve(contacts);
            }
        });
    });

};

let getTopOpportunities = count => {

    count = count || 5;

    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name, Amount, Probability, StageName, CloseDate, Account.Name, Account.Picture_URL__c FROM Opportunity WHERE isClosed=false ORDER BY amount DESC LIMIT " + count;
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.error(err);
                reject("An error as occurred");
            } else {
                resolve(resp.records);
            }
        });
    });

};

let findOpportunities = name => {
    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name FROM Opportunity WHERE Name LIKE '%" + name + "%' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let Opportunities = resp.records;
                resolve(Opportunities);
            }
        });
    });
};


let getdummyOpportunities = name => {
    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name FROM Opportunity WHERE Name LIKE '%" + name + "%' LIMIT 1";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let Opportunities = resp.records;
                resolve(Opportunities);
            }
        });
    });
};

let findWayfarerOpportunities = name => {
    return new Promise((resolve, reject) => {
        let q = "SELECT Id, Name,Picture_URL__c,Type,Description,Amount FROM Opportunity WHERE Type LIKE '%" + name + "%' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let Opportunities = resp.records;
                resolve(Opportunities);
            }
        });
    });
};

let findTitleCard = name => {
    return new Promise((resolve, reject) => {
        console.log('bfo query');
        console.log(name);
        let q = "SELECT Id, Name,Picture_URL__c,Type,Description,Amount FROM Opportunity WHERE type LIKE '%" + name + "%' ORDER BY amount LIMIT 5";
        console.log('after query');
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let Opportunities = resp.records;
                resolve(Opportunities);
            }
        });
    });
};


let findShops = name => {
    return new Promise((resolve, reject) => {
        console.log('bfo query');
        console.log(name);
        let q = "SELECT Id, Name,PICURL__c,LOCATION__c,Description FROM product2 WHERE LOCATION__c LIKE '%" + name + "%' LIMIT 5";
        console.log('after query');
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let Products = resp.records;
                resolve(Products);
            }
        });
    });
};

let findMenu = ProductId => {
    return new Promise((resolve, reject) => {
        console.log('Inside Menu Flow');
        console.log(ProductId);
        let q = "SELECT Id,Name,PICURL__c,Price__c,Product__c from Menu__c WHERE Product__c  = '" + ProductId + "' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let Products = resp.records;
                console.log('List of Menus' + resolve(Products));
                resolve(Products);
            }
        });
    });
};

let findProductId = MenuId => {
    return new Promise((resolve, reject) => {
        console.log('Inside product id flow**' + MenuId);
        let q = "Select id,name from product2 where Id IN (SELECT Product__c from Menu__c where id = '" + MenuId + "') LIMIT 1";
        console.log(q);
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                console.log('shop resp**' + resp.records.length);
                let ShopId = resp.records;
                resolve(ShopId);
            }
        });
    });
};


let createInvoice = (ShopId,customerName)  => {
    return new Promise((resolve, reject) => {
        console.log('before creating case check' + ShopId);
        let c = nforce.createSObject('Case');
        c.set('subject', `Facebook Customer`);
        c.set('description', customerName);
        c.set('origin', 'Facebook Bot');
        c.set('status', 'New');
        c.set('ProductLookUp__c', ShopId);
        c.set('Customer_Name__c', customerName);
        
        org.insert({sobject: c}, err => {
            if (err) {
                console.error(err);
                reject("An error occurred while creating a case");
            } else {
                console.error('created case**' + c);
                resolve(c);
            }
        });
    });
};



let prepareOrder = (name) => {
    return new Promise((resolve, reject) => {
        console.log('Inside Coming');
        let q = "SELECT Id, Name,Picture_URL__c,Type,Description,Amount FROM Opportunity WHERE Name LIKE '%" + name + "%' LIMIT 5";
        org.query({query: q}, (err, resp) => {
            if (err) {
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let Opportunities = resp.records;
                resolve(Opportunities);
            }
        });
    });
};



let createCase = (name,customerName)  => {
    return new Promise((resolve, reject) => {
        let c = nforce.createSObject('Case');
        c.set('subject', `Facebook Customer`);
        c.set('description', customerName );
        c.set('origin', 'Facebook Bot');
        c.set('status', 'New');
        c.set('Opportunity__c', name);
        c.set('Customer_Name__c', customerName);
        
        org.insert({sobject: c}, err => {
            if (err) {
                console.error(err);
                reject("An error occurred while creating a case");
            } else {
                resolve(c);
            }
        });
    });
};

/*let createCase = name  => {
    return new Promise((resolve, reject) => {
        let c = nforce.createSObject('Case');
        c.set('subject', `Facebook Customer`);
        //c.set('description', name );
        c.set('origin', 'Facebook Bot');
        c.set('status', 'New');
        c.set('Opportunity__c', name);
        
        org.insert({sobject: c}, err => {
            if (err) {
                console.error(err);
                reject("An error occurred while creating a case");
            } else {
                resolve(c);
            }
        });
    });
};*/



login();

exports.org = org;
exports.findAccount = findAccount;
exports.findContact = findContact;
exports.findContactsByAccount = findContactsByAccount;
exports.getTopOpportunities = getTopOpportunities;
exports.findOpportunities = findOpportunities;
exports.getdummyOpportunities = getdummyOpportunities;
exports.findWayfarerOpportunities = findWayfarerOpportunities;
exports.findTitleCard = findTitleCard;
exports.findShops = findShops;
exports.findMenu = findMenu;
exports.createCase = createCase;
exports.findProductId = findProductId;
exports.createInvoice = createInvoice;
exports.prepareOrder = prepareOrder;
