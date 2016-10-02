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
        
         //new
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
                                                "payload":"Show_Broch"
                                              }
                                            ]                                             
                                        }
                                 ]
                            }
                        }
            }, sender);

         
         
         //new
         
         
         
    });    
        return;
    }
    
    let match9;
    match9 = text.match(/who are (.*)/i);    
    if (match9) {
        console.log('Inside match9');
        salesforce.findTitleCard(match9[1]).then(Opportunities => {    
            sendMessage(formatter.formatTitleCard(Opportunities), sender)
        });
        return;
    }    
    
    let match10;
    match10 = text.match(/location - (.*)/i);    
    if (match10) {
        console.log('Inside match10');
        salesforce.findShops(match10[1]).then(Products => {    
            sendMessage(formatter.formatShops(Products), sender)
        });
        return;
    }    
        
        
    //HACKATHON
    
    
    let match0;
    match0 = text.match(/hii/i);
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
        
        
        return;
        
    }
    
    let match1;
    match1 = text.match(/YESUUUU/i);
    if (match1) {
        sendMessage({text:
        `How Can I Help You :
        
            Search sunglasses 🔍🔍
            
            Show new Model ⚡ ⚡
            
            Share your location to 
            know near by Stores ↹
            
            Gift your loved ones 🎁 💕 
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
                } else if (payload[0] === "Show_Broch"){

                           sendMessage({
                                        "text":"Pick 1 model:",
                                        "quick_replies":[
                                            {
                                                "content_type":"text",
                                                "title":"Biryani",
                                                "payload":"close_won"
                                            },
                                            {
                                                "content_type":"text",
                                                "title":"Dry Items",
                                                "payload":"close_won"
                                            },
                                            {
                                                "content_type":"text",
                                                "title":"Gravies",
                                                "payload":"close_won"
                                            },
                                            {
                                                "content_type":"text",
                                                "title":"Dinner Only",
                                                "payload":"close_won"
                                            },
                                            {
                                                "content_type":"text",
                                                "title":"KolapasiSpecialCombo",
                                                "payload":"close_won"
                                            }]   
                                }, sender);
            
                } else if(payload[0] === "Order_Now") {
                            sendMessage({text: `Processing your order .Please wait....... 🕗`}, sender);
                            console.log('payload 1 ' , payload[1]);
                            console.log('payload 2 ', payload[2]);
                            
                            //NOW COMMENTED
                            getUserInfo(sender).then(response => {
                                salesforce.createCase(payload[1],response.first_name).then(() => {
                                   sendMessage({
                                            text: 
                                            `${response.first_name} processed your order successfully.👍 '
                                                Please find the attached order 🚗`
                                            }, sender);
                                });
                            });  
                            //NOW COMMENTED
                            
                }else if (payload[0] === "Am_Hungry") {
                    console.log('payload[2]**' + payload[2]);
                    
                    if(payload[2] === "Hungry?Lets go!!."){
                        sendMessage({text: `Please enter your location in this format location - pammal`}, sender);
                    }
                    
                    
                    
                }else if (payload[0] === "Show_Menu") {
                    console.log(payload[0]);  
                    console.log(payload[1]); // Return Id of the product choosen
                    
                    salesforce.findMenu(payload[1]).then(Products => {
                                   sendMessage({text: `Listing down menus for you 🍝`}, sender);
                                   sendMessage(formatter.formatMenu(Products), sender)
                    }); 
                } else if (payload[0] === "Create_Invoice") {
                    getUserInfo(sender).then(response => {
                        console.log('MENU ID**' + payload[1]);
                        console.log('MENU Name**' + payload[2]);
                        console.log('Shop Id**' + payload[3]);
                        /*salesforce.findProductId(payload[1]).then(ShopId => {
                                       console.log('Choosen ShopId**' + ShopId);
                                       salesforce.createInvoice(ShopId).then(() => {
                                           sendMessage({text: `Hey ${response.first_name} Noted !! Do you wish to order other items?`}, sender);
                                       });   
                        });*/ 
                        salesforce.createInvoice(payload[3],response.first_name,payload[2]).then(() => {
                           sendMessage({text: `Hey ${response.first_name} noted !!`}, sender);
                                   sendMessage({attachment:{
                                        "type": "template",
                                        "payload": {
                                            "template_type":"button",
                                            "text":"Would you like to order some more items from this shop?",
                                            "buttons":[
                                              {
                                                "type":"postback",
                                                "title":"Yes",
                                                "payload":"Order_More," + payload[3]
                                              },
                                              {
                                                "type":"postback",
                                                "title":"No- It`s enough.",
                                                "payload":"No_Enf,"
                                              }
                                            ]
                                        }
                                    }
                            }, sender);
                        });
                });
            }else if (payload[0] === "Order_More") {
                    
                    console.log('More products**' + payload[1]);
                   
                    salesforce.findMenu(payload[1]).then(Products => {
                                   sendMessage({text: `Ok showing menu items from the shop choosen before !!`}, sender);
                                   sendMessage(formatter.formatMenu(Products), sender)
                    });
                    
            }    
            else if (payload[0] === "No_Enf") {
                    sendMessage({text: `Cool !! Send your mobile number 📞 for door delivery`}, sender);
                    sendMessage({attachment:{
                            "type": "image",
                            "payload": {
                                //https://mir-s3-cdn-cf.behance.net/project_modules/disp/10772526268695.563539bc1a55a.gif
                                "url":"http://www.savegenie.mu/img/web-images/delivery-van-ani.gif"
                                
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
