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

let findOpenBranches = kolapasi => {
    return new Promise((resolve, reject) => {
        console.log('bfo query');
        console.log(name);
        let q = "SELECT Id, Name,parent.name,IsOpen__c FROM Account WHERE parent.name LIKE '%" + kolapasi + "%' AND IsOpen__c = TRUE ";
        //select id,name,parent.name from account where parent.name = 'kolapasi'        
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                let Accounts = resp.records;
                resolve(Accounts);
            }
        });
    });
};


login();

exports.org = org;
exports.findOpenBranches = findOpenBranches;

