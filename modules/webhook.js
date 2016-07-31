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

/*let getAddress = (lat, lng) => {
    
            console.log('Yappa Inside Callout pa', lat);
            console.log('Yappa Inside Callout pa', lng);
            console.log('Inside Callout');
            
            request({
                //https://maps.googleapis.com/maps/api/geocode/json?latlng=12.977165,80.138902&key=AIzaSyCOKmcmLPD3KqyfaiMTr3GIcXTPYJVKNa4
                url:'https://maps.googleapis.com/maps/api/geocode/json',
                qs: {latlng:{{lat,lng}, key: 'AIzaSyCOKmcmLPD3KqyfaiMTr3GIcXTPYJVKNa4'},
                //sendMessage({text: ` Latitude "${lat}" `}, sender);
                method: 'GET',
            }, (error, response, request) => {
                if (error) {
                    console.log('Error sending message: ', error);
                }else if (response) {
                    console.log('Responseuu*** ', response.body);
                }else if (response.body.error) {
                    console.log('Error: ', response.body.error);
                }
            });
        
};*/

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
        
        getUserInfo(sender).then(response => {
          sendMessage({text:`Hey ${response.first_name} !!!! 🙏 🙏
        Welcome to the world of 
        Rayban 👓 👓 👓 👓
        Am Rayban bot <(")
        Need my assistant to 
        choose model. 👷 ?? 
        Type yes 👍`}, sender);
        });
        
       /* sendMessage({text:
        `Hey ${response.first_name} !!!! 🙏 🙏
             Welcome to the world of 
             Rayban 👓 👓 👓 👓
             Am Rayban bot <(")
             I can help you to choose 
             model.
             Need my assistant 👷 ??
             Type yes 👍
            `}, sender);*/
            
        /*sendMessage({attachment:{
                        "type": "image",
                        "payload": {
                            "url":"http://www.ray-ban.com/_repository/_gui/2010/ray-ban-logo-social.jpg"
                        }
                    }
            }, sender);*/
      
        
        return;
    }
    
    let match1;
    match1 = text.match(/YES/i);
    if (match1) {
        sendMessage({text:
        `How Can I Help You :
        
            Search sunglasses 🔍🔍
            
            Show new Model ⚡ ⚡
            
            Share your location to 
            know near by Stores ↹
            
            Gift your loved ones 🎁 💕 
                `}, sender);
                /*sendMessage({attachment:{
                            "type": "image",
                            "payload": {
                                "url":"https://blog.mysms.com/wp-content/uploads/2014/05/blog-location.png"
                            }
                        }
                    }, sender);*/        
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
            sendMessage({text:`Searching Wayfarer Models....`}, sender);
            sendMessage(formatter.formatWayfarerModels(Opportunities), sender)
        });
        return;
    }
    
    
    let match3;
    match3 = text.match(/Aviator/i);
    if (match3) {
        salesforce.findWayfarerOpportunities(match3).then(Opportunities => {    
            sendMessage({text:`Searching Aviator Models....`}, sender);
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
        }else if (event.message && event.message.text) {
            processText(event.message.text, sender);
        }else if (event.message && event.message.attachments) {
                console.log('Inside Location Loop ', event.message.attachments[0].type);
                if(event.message.attachments[0].type == 'location'){
                    console.log('GETHU DA................');
                    var lat = event.message.attachments[0].payload.coordinates.lat;
                    var lng = event.message.attachments[0].payload.coordinates.long;
                    sendMessage({text: `Thanks For Sharing Your Location`}, sender);
                    sendMessage({text: ` Latitude "${lat}" `}, sender);
                    sendMessage({text: ` Longitude "${lng}" `}, sender);
                    //getAddress(lat,lng);
                }
        } 
        else if (event.postback) {
            let payload = event.postback.payload.split(",");
            if (payload[0] === "view_contacts") {
                sendMessage({text: "OK, looking for your contacts at " + payload[2] + "..."}, sender);
                salesforce.findContactsByAccount(payload[1]).then(contacts => sendMessage(formatter.formatContacts(contacts), sender));
            } else if (payload[0] === "close_won") {
                sendMessage({text: `OK, I closed the opportunity "${payload[2]}" as "Close Won". Way to go Christophe!`}, sender);
            } else if (payload[0] === "close_lost") {
                sendMessage({text: `I'm sorry to hear that. I closed the opportunity "${payload[2]}" as "Close Lost".`}, sender);
            } else if(payload[0] === "Order_Now") {
                        sendMessage({text: `Processing your order .Please wait....... 🕗`}, sender);
                        console.log(payload[1]);
                        console.log(payload[2]);
                        console.log(payload[3]);
                        getUserInfo(sender).then(response => {
                            salesforce.createCase(payload[1],response.first_name).then(c => {
                                sendMessage({
                                        text: 
                                        `${response.first_name} processed your order successfully.👍
                                            Please share your location to ship the order 🚗`
                                        }, sender);
                                });
                            }    
                        });    
                       salesforce.prepareOrder(payload[1],response.first_name).then(Opportunities => {
                       sendMessage({attachment:{
                                          "type":"template",
                                          "payload":{
                                            "template_type":"receipt",
                                            "recipient_name": response.first_name,
                                            "order_number":"12345678902",
                                            "currency":"USD",
                                            "payment_method":"Visa 2345",        
                                            "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
                                            "timestamp":"1428444852", 
                                            "elements":[
                                              {
                                                "title":"Classic White T-Shirt",
                                                "subtitle":"100% Soft and Luxurious Cotton",
                                                "quantity":2,
                                                "price":50,
                                                "currency":"USD",
                                                "image_url":"http://petersapparel.parseapp.com/img/whiteshirt.png"
                                              },
                                              {
                                                "title":"Classic Gray T-Shirt",
                                                "subtitle":"100% Soft and Luxurious Cotton",
                                                "quantity":1,
                                                "price":25,
                                                "currency":"USD",
                                                "image_url":"http://petersapparel.parseapp.com/img/grayshirt.png"
                                              }
                                            ],
                                            "address":{
                                              "street_1":"1 Hacker Way",
                                              "street_2":"",
                                              "city":"Menlo Park",
                                              "postal_code":"94025",
                                              "state":"CA",
                                              "country":"US"
                                            },
                                            "summary":{
                                              "subtotal":75.00,
                                              "shipping_cost":4.95,
                                              "total_tax":6.19,
                                              "total_cost":56.14
                                            },
                                            "adjustments":[
                                              {
                                                "name":"New Customer Discount",
                                                "amount":20
                                              },
                                              {
                                                "name":"$10 Off Coupon",
                                                "amount":10
                                              }
                                            ]
                                        }    
                                    }
                            }, sender);
            } 
        }
    }
    res.sendStatus(200);
};

exports.handleGet = handleGet;
exports.handlePost = handlePost;
exports.getUserInfo = getUserInfo;
