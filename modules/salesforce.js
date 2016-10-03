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

let findTitleCard = name => {
    
    return new Promise((resolve, reject) => {
        console.log('bfo query');
        console.log('Incoming title card name**' + name);
        let q = "SELECT Id,Name,Picture_URL__c,Title_Cards__c,Description FROM Account WHERE Title_Cards__c LIKE '%" + name + "%' LIMIT 5";
        console.log('after query');
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                console.log('uuuhhh**' + resp.records.length);
                let Accounts = resp.records;
                resolve(Accounts);
            }
        });
    });
};

let findOpenBranches = parentaccountid => {
    return new Promise((resolve, reject) => {
        console.log('bfo query');
        let q = "SELECT Id, Name,parent.name,IsOpen__c FROM Account WHERE parentid = '" + parentaccountid + "'";
        //select id,name,parent.name from account where parent.name = 'kolapasi'        
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                console.log('PASSU' + resp.records.length);
                let Accounts = resp.records;
                resolve(Accounts);
            }
        });
    });
};


login();

exports.org = org;
exports.findTitleCard = findTitleCard;
exports.findOpenBranches = findOpenBranches;

