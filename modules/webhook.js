"use strict";

let request = require('request'),
    salesforce = require('./salesforce'),
    formatter = require('./formatter-messenger');

let sendMessage = (message, recipient) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipient},
            message: message
        }
    }, (error, response) => {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

let processText = (text, sender)  => {
    let match;
    match = text.match(/help/i);
    if (match) {
        sendMessage({text:
            `You can ask me things like:
    Search account Acme
    Search Acme in accounts
    Search contact Smith
    What are my top 3 opportunities?
    Search opportunity dell
        `}, sender);
        return;
    }
    
    //HACKATHON
    
    let match0;
    match0 = text.match(/hi/i);
    if (match0) {
        sendMessage({text:
            `Welcome to the world of Rayban.
             Hey do you want shop 
             with me ???
             If so ---> 
             Type YES 
                  `}, sender);
        return;
    }
    
    let match1;
    match1 = text.match(/YES/i);
    if (match1) {
        sendMessage({text:
            `How Can I Help You :
            Search sunglasses for me !!!!!!!!
            Show new Model
                `}, sender);
        return;
    }
    
    match1 = text.match(/Show new (.*)/i);
    if (match1) {
        salesforce.getdummyOpportunities(match1[1]).then(Opportunities => {
            sendMessage({text: `Processing your request "${match1[1]}":`}, sender);
            //sendMessage(formatter.formatnewModel(Opportunities), sender);
            sendMessage(formatter.formatQuickReplies(Opportunities), sender);
        });
        return;
    }
    
    
    let match2;
    match2 = text.match(/Wayfarer/i);
    if (match2) {
        salesforce.findWayfarerOpportunities(match2).then(Opportunities => {    
            sendMessage({text:`Searching Wayfarer Models`}, sender);
            sendMessage(formatter.formatWayfarerModels(Opportunities), sender)
        });
        return;
    }
    
    //HACKATHON
    
    match = text.match(/search account (.*)/i);
    if (match) {
        salesforce.findAccount(match[1]).then(accounts => {
            sendMessage({text: `Here are the accounts I found matching "${match[1]}":`}, sender);
            sendMessage(formatter.formatAccounts(accounts), sender)
        });
        return;
    }

    match = text.match(/search (.*) in accounts/i);
    if (match) {
        salesforce.findAccount(match[1]).then(accounts => {
            sendMessage({text: `Here are the accounts I found matching "${match[1]}":`}, sender);
            sendMessage(formatter.formatAccounts(accounts), sender)
        });
        return;
    }

    match = text.match(/search contact (.*)/i);
    if (match) {
        salesforce.findContact(match[1]).then(contacts => {
            sendMessage({text: `Here are the contacts I found matching "${match[1]}":`}, sender);
            sendMessage(formatter.formatContacts(contacts), sender)
        });
        return;
    }

    match = text.match(/top (.*) opportunities/i);
    if (match) {
        salesforce.findOpportunities(match[1]).then(opportunities => {
            sendMessage({text: `Here are your top ${match[1]} opportunities:`}, sender);
            sendMessage(formatter.formatOpportunities(opportunities), sender)
        });
        return;
    }
    
    match = text.match(/search opportunity (.*)/i);
    if (match) {
        salesforce.findOpportunities(match[1]).then(Opportunities => {
            sendMessage({text: `Here are the Opportunities "${match[1]}":`}, sender);
            sendMessage(formatter.formatOpp(Opportunities), sender)
        });
        return;
    }
};

let handleGet = (req, res) => {
    if (req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
};

let handlePost = (req, res) => {
    let events = req.body.entry[0].messaging;
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        let sender = event.sender.id;
        if (process.env.MAINTENANCE_MODE && ((event.message && event.message.text) || event.postback)) {
            sendMessage({text: `Sorry I'm taking a break right now.`}, sender);
        } else if (event.message && event.message.text) {
            processText(event.message.text, sender);
        } else if (event.postback) {
            let payload = event.postback.payload.split(",");
            if (payload[0] === "view_contacts") {
                sendMessage({text: "OK, looking for your contacts at " + payload[2] + "..."}, sender);
                salesforce.findContactsByAccount(payload[1]).then(contacts => sendMessage(formatter.formatContacts(contacts), sender));
            } else if (payload[0] === "close_won") {
                sendMessage({text: `OK, I closed the opportunity "${payload[2]}" as "Close Won". Way to go Christophe!`}, sender);
            } else if (payload[0] === "close_lost") {
                sendMessage({text: `I'm sorry to hear that. I closed the opportunity "${payload[2]}" as "Close Lost".`}, sender);
            }
        }
    }
    res.sendStatus(200);
};

exports.handleGet = handleGet;
exports.handlePost = handlePost;
