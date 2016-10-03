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

let addPersistentMenu = ()=> {     
    request({
        url: 'https://graph.facebook.com/v2.6/me/thread_settings',
        qs: { access_token: process.env.FB_PAGE_TOKEN },
        method: 'POST',
        json:{
                setting_type : "call_to_actions",
                thread_state : "existing_thread",
                call_to_actions:[
                        {
                          type:"postback",
                          title:"View Branches",
                          payload:"joke"
                        },
                        {
                          type:"postback",
                          title:"View Selected Items",
                          payload:"joke"
                        },
                        {
                          type:"postback",
                          title:"Cancel My Order",
                          payload:"joke"
                        }
                  ]
        }
    }, (error, response) => {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    });
};
                     
                     
                     
let processText = (text, sender)  => {                 
   let match8;
    match8 = text.match(/hi/i);
    if (match8) {
     getUserInfo(sender).then(response => {         
            sendMessage({text:
                `Hey ${response.first_name} ....
            "Kolapasi" welcomes you 🙏 🙏
             Curious to know about me ? 🍲
             Please hit - who are you`
            }, sender);
            addPersistentMenu();
            sendMessage({attachment:{
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                 "elements": [
                                        {
                                            "title": "Welcome to Kolapasi",  
                                             "image_url": "https://scontent.xx.fbcdn.net/v/t1.0-9/11781623_993915574001257_7180529943084905758_n.jpg?oh=e24a1a4fad74700eefa11694aec0b903&oe=587AA6D9",
                                             "subtitle": "Takeaway places(InandAround) --> Adyar | Ashok Nagar | Choolaimedu | Mogappair",  
                                            "buttons":[
                                              {
                                                "type":"postback",
                                                "title":"Start Ordering",
                                                "payload":"Show_Branches,"  + kolapasi
                                              }
                                            ]                                             
                                        }
                                 ]
                            }
                        }
            }, sender);  
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
                     
                     console.log('payload[1]**' + payload[1]);
                     
                     /*salesforce.findOpenBranches(kolapasi).then(Accounts => {
                                   console.log('waiting for formatting');                                
                     });*/                                           
                     
                 } 
        }
    }    
    res.sendStatus(200);
};

exports.handleGet = handleGet;
exports.handlePost = handlePost;
exports.getUserInfo = getUserInfo;
