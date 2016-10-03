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

let getUserInfo = (userId) => {  
  return new Promise((resolve, reject) => {           
        request({
            url: `https://graph.facebook.com/v2.6/${userId}`,
            qs: {fields:"first_name,last_name,profile_pic", access_token: process.env.FB_PAGE_TOKEN},
            method: 'GET',
        }, (error, response) => {
            if (error) {
                console.log('Error sending message: ', error);
                reject(error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            } else {
                console.log(response.body);
                resolve(JSON.parse(response.body));
            }    
        });    
    });      
};    
             
let processText = (text, sender)  => {                 
   let match1;
    match1 = text.match(/hi/i);
    if (match1) {
         getUserInfo(sender).then(response => {         
                    sendMessage({text:
                        `Hey ${response.first_name} !
                        "Kolapasi" welcomes you 🙏 
                       Happy to see you.
                       Want to order food ? 🍲 🍲 Please hit - First Menu
                       To know about other options swipe..👉`
                    }, sender);
                   salesforce.findTitleCard(match1[0]).then(Accounts => {    
                        console.log('bfo formating');
                        sendMessage(formatter.formatTitleCard(Accounts), sender)
                    }); 
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
        }else if (event.message && event.message.text) {
            processText(event.message.text, sender);
        }else if (event.postback) {
                let payload = event.postback.payload.split(",");
                 if (payload[0] === "Show_Branches"){     
                     console.log('payload[1]' + payload[1]);
                     salesforce.findOpenBranches(payload[1]).then(Accounts => {    
                            //sendMessage(formatter.formatQuickReplies(Accounts), sender);  
                            sendMessage(formatter.formatOpenBranches(Accounts), sender);  
                     });                                                                
                 }
                /*else if (payload[0] === "Main_Menu"){     
                     console.log('Selected branch will show their available menus' + payload[1]);                                                              
                 }*/
                 else if (payload[0] === "Main_Menu"){     
                     console.log('Selected branch will show their available menus' + payload[1]);          
                      salesforce.findMainMenus(payload[1]).then(MainMenus => {         
                     });    
                 }  
        }
    }    
    res.sendStatus(200);
};

exports.handleGet = handleGet;
exports.handlePost = handlePost;
exports.getUserInfo = getUserInfo;
