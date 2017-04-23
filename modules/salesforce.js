"use strict"; //hello

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
        let q = "SELECT Id,Name,Type,Picture_URL__c,Title_Cards__c,Description FROM Account WHERE Title_Cards__c LIKE '%" + name + "%' LIMIT 5";
        console.log('title card query' + q);
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

let findOpenBranches = (parentaccountid,subLocality) => {
    return new Promise((resolve, reject) => {
        console.log('bfo query');
	console.log('sublocality****'+subLocality);
        let q = "SELECT Id, Name,Picture_URL__c,parentid,parent.name,IsOpen__c,Description,Supported_Locality__c FROM Account WHERE parentid = '" + parentaccountid + "' AND IsOpen__c = TRUE";
        //select id,name,parent.name from account where parent.name = 'kolapasi'   
	console.log('open branch query' + q);        
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                console.log('Open Branches Count' + resp.records.length);
		var Accounts = [];
		for(var i = 0; i < resp.records.length; i++){
			console.log('resp.records[i].get("Supported_Locality__c")***'+resp.records[i].get("Supported_Locality__c"));
			if(resp.records[i].get("Supported_Locality__c") != null && resp.records[i].get("Supported_Locality__c").includes(subLocality)){
				Accounts.push(resp.records[i]);
			}
		}
                resolve(Accounts);
            }
        });
    });
};

let createOpportunity = (firstName, lastName, userId, accountId, lat, lng) => {
    return new Promise((resolve, reject) => {
	//Query if the contact already exists
	var contactId;
	let q = "SELECT Id FROM Contact WHERE FacebookId__c = '" + userId + "' ";
        //SELECT Id,Product__r.name,Product__r.PICURL__c FROM Menu__c where Account__c = '0012800000tbvuw' AND Product__r.Family = 'Parent'       
       console.log('Contact Query***' + q); 
       org.query({query: q}, (err, resp) => {
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                console.log('Contact count' + resp.records.length);
		contactId = resp.records[0].get("Id");
		console.log('Contact ID***' + contactId);
            }
	    if(contactId == null || contactId == ''){ 
		//Create Contact    
		let con = nforce.createSObject('Contact');
		con.set('firstName', firstName);
		con.set('lastName', lastName);
		con.set('FacebookId__c', userId);
		con.set('mailinglatitude',lat);
		con.set('mailinglongitude',lng);
		org.insert({sobject: con}, err => {
		    if (err) {
			console.error(err);
			reject("An error occurred while creating a Contact");
		    } 
		    else{
			console.log('Contact Created '+con.get("Id"));
		    	contactId = con.get("Id");
		    }
		});
	}
	       else{
	       		updatePhone(null,lat,lng,userId);
	       }
	
	//Create Opportunity    
	let opp = nforce.createSObject('Opportunity');
        opp.set('name', firstName + lastName);
	opp.set('StageName','Order Initiated');
	opp.set('CloseDate',Date.now());
	opp.set('Contact__c', contactId);
	opp.set('AccountId',accountId);
	org.insert({sobject: opp}, err => {
		if (err) {
			console.error(err);
			reject("An error occurred while creating a Opportunity");
		}
		console.error('Opportunity Created***'+opp.get("Id"));
		resolve(opp.get("Id"));
	});
        });
	
				
            
        
    });
};




let findMainMenus = subaccountid => {
    return new Promise((resolve, reject) => {
        console.log('bfo querymainmenus');
        let q = "SELECT Account__c,Product__c,Id,name,Product__r.name,Product__r.PICURL__c,product__r.description,Available__c FROM Menu__c WHERE Account__c = '" + subaccountid + "' AND  Product__r.Family = 'Parent' AND Available__c = TRUE ";
        //SELECT Id,Product__r.name,Product__r.PICURL__c FROM Menu__c where Account__c = '0012800000tbvuw' AND Product__r.Family = 'Parent'       
       console.log('main menu card query' + q); 
       org.query({query: q}, (err, resp) => {
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                console.log('Main Menus count' + resp.records.length);
                let MainMenus = resp.records;
                resolve(MainMenus);
            }
	       
        });
    });
};

let findSubMenus = (subaccountid,MainProductId) => {
    return new Promise((resolve, reject) => {
        console.log('bfo querymainmenus');
        let q = "SELECT Price__c,Account__c,Id,name,Product__c,Product__r.name,Product__r.PICURL__c,product__r.description,Available__c,Product__r.Main_Product__c, Product__r.EmbedImage__c FROM Menu__c WHERE Account__c = '" + subaccountid + "' AND  Product__r.Family != 'Parent' AND Product__r.Main_Product__c= '" + MainProductId + "' AND Available__c = True ";
        
        //SELECT Id,name,Product__c,Product__r.name,Product__r.PICURL__c,product__r.description,Available__c,Product__r.Main_Product__c FROM Menu__c 
        //WHERE Account__c = '0012800000tbvvV' AND  Product__r.Family != 'Parent' 
        //AND Product__r.Main_Product__c= '01t28000002yqou' AND Available__c = True
        
        console.log('sub menu query' + q);
	    
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                console.log('Sub Menus count' + resp.records.length);
                let SubMenus = resp.records;
                resolve(SubMenus);
            }
        });
    });
};

let getSelectedMenu = (selectedMenuId) => {
    return new Promise((resolve, reject) => {
        console.log('bfo querymainmenus');
        let q = "SELECT Account__c,Id,name,Product__c,Product__r.name,Product__r.PICURL__c,product__r.description,Available__c,Product__r.Main_Product__c, Quantity__c, Price__c FROM Menu__c WHERE id = '" + selectedMenuId + "' AND Available__c = True ";
        
        //SELECT Account__c,Id,name,Product__c,Product__r.name,Product__r.PICURL__c,product__r.description,Available__c,Product__r.Main_Product__c FROM //Menu__c WHERE id = '" + selectedMenuId + "' AND Available__c = True 
        
        console.log('selected menu query' + q);
        org.query({query: q}, (err, resp) => {
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
                console.log('Sub Menus count' + resp.records.length);
                let SelectedMenu = resp.records;
                resolve(SelectedMenu);
            }
        });
    });
};



let createOpportunityProduct = (ProductId, Price, Quantity, OpportunityId, OLIId) => {

    console.log('prod id*' + ProductId);
    console.log('Price*' + Price);
    console.log('Quantity*' + Quantity);
    console.log('OpportunityId*' + OpportunityId);	
	
    return new Promise((resolve, reject) => {
	       if(OLIId == null || OLIId == ''){
		       let q = "SELECT Id,PriceBook2.isStandard, Product2Id, Product2.Id, Product2.Name FROM PriceBookEntry WHERE Product2Id = '" + ProductId + "' AND  PriceBook2.isStandard= true LIMIT 1";    
		       console.log('PriceBookEntryId Query**' + q);

		       org.query({query: q}, (err, resp) => {
			    if (err) {
				console.log('ERROR');
				reject("An error as occurred");
			    } else if (resp.records && resp.records.length>0) {			

				console.log('PriceBookEntry Id Count' + resp.records.length);  

				let PriceBookEntryId = JSON.stringify(resp.records);

				console.log('price book entry id stringify*' +    PriceBookEntryId );

				console.log('price book entry id stringify*' +    resolve(PriceBookEntryId) );    

				console.log('price book entry id separate value*' +   resp.records[0].get("Id"));	    
				//Create OpportunityLineItem    
				let Oppli = nforce.createSObject('OpportunityLineItem');
				Oppli.set('OpportunityId', OpportunityId);
				Oppli.set('PricebookEntryId', resp.records[0].get("Id"));	    
				Oppli.set('Quantity', Quantity);
				Oppli.set('UnitPrice', Price);  //HITU MAMA
				//Oppli.set('UnitPrice', Quantity * Price);    			    
				org.insert({sobject: Oppli}, err => {
				    if (err) {
					console.error(err);
					reject("An error occurred while creating a Contact");
				    } else {
					console.log('opportunity line item Created '+Oppli.get("Id"));
				    }
				});
				resolve(Oppli);			    
			    }
			});
	       }
	    else{
	    	let Oppli = nforce.createSObject('OpportunityLineItem');
		Oppli.set('Id', OLIId);
		Oppli.set('Quantity', Quantity);
		org.update({sobject: Oppli}, err => {
		    if (err) {
			console.error(err);
			reject("An error occurred while creating a Contact");
		    } else {
			console.log('opportunity line item updated '+Oppli.get("Id"));
		    }
		});
		resolve(Oppli);			    
	    }
    });		
};

let findOpportunityLineItem = (Oppty,orderCompleted) => {
	
    return new Promise((resolve, reject) => {

        let q = "SELECT Id,product2.name,product2.PICURL__c,opportunityid,Opportunity.name,Opportunity.Amount,Opportunity.Order_Number__c,Opportunity.AccountId,Opportunity.TotalAmount__c,unitprice, TotalPrice, quantity from opportunitylineitem where opportunityid = '" + Oppty + "'";                 
        //SELECT Id,product2.name,opportunityid,unitprice ,quantity from opportunitylineitem where opportunityid = '0062800000FFU3l'
        
        console.log('Find Opportunity Line Item**' + q);
	if(orderCompleted){
		let opp = nforce.createSObject('Opportunity');
		opp.set('Id', Oppty);
		opp.set('StageName', 'Order Completed');
		org.update({sobject: opp}, err => {
		    if (err) {
			console.error(err);
			reject("An error occurred while creating a Contact");
		    } else {
			//console.log('opportunity updated'+Opp.get("Id"));
		    }
		});
	}
	
        org.query({query: q}, (err, resp) => {
		
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
		    
                console.log('Show Cart count' + resp.records.length);
                
		let SelectedItems = resp.records;
                resolve(SelectedItems);
		    
            }
	    else{
	    	resolve(null);
	    }
		
        });
	    
    });
	
};

let getSelectedMenuFromOli = (Oli, accountId) => {
	
    return new Promise((resolve, reject) => {

        let q = "SELECT Id,product2Id from opportunitylineitem where id = '" + Oli + "'";                 
        //SELECT Id,product2.name,opportunityid,unitprice ,quantity from opportunitylineitem where opportunityid = '0062800000FFU3l'
        
        console.log('Find Opportunity Line Item**' + q);
	
        org.query({query: q}, (err, resp) => {
		
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            } else if (resp.records && resp.records.length>0) {
		let q2 = "SELECT Account__c,Id,name,Product__c,Product__r.name,Product__r.PICURL__c,product__r.description,Available__c,Product__r.Main_Product__c, Quantity__c, Price__c from Menu__c where Account__c = '" + accountId + "' and product__c = '" + resp.records[0].get("product2Id") + "'";  
                console.log('Menu Query***' + q2);
                org.query({query: q2}, (err, resp) => {
			if (err) {
				console.log('ERROR');
				reject("An error as occurred");
			    }
			else if (resp.records && resp.records.length>0) {
				console.log('Selected Items***'+resp.records[0].get("Id"));
				let SelectedItems = resp.records;
				resolve(SelectedItems);
			}
		});
		    
            }
		
        });
	    
    });
	
};

let removeOLI = (OliId) => {
	
    return new Promise((resolve, reject) => {

        let OLI = nforce.createSObject('OpportunityLineItem');
		OLI.set('Id', OliId);
	
        org.delete({sobject: OLI}, err => {
		
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            } else {
		console.log('Line item deleted');  
		resolve(OLI);
            }
		
        });
	    
    });
	
};

let updatePhone = (phone,lat,lng, userId) => {
	
    return new Promise((resolve, reject) => {
	console.log('UserId***'+userId);
	let q = "SELECT Id from contact where FacebookId__c = '" + userId + "'";                 
        
        console.log('Find Opportunity Line Item**' + q);
	
        org.query({query: q}, (err, resp) => {
		
            if (err) {
                console.log('ERROR');
                reject("An error as occurred");
            }
		else if (resp.records && resp.records.length>0) {
			let con = nforce.createSObject('Contact');
			con.set('Id', resp.records[0].get("Id"));
			if(phone != null){
				con.set('MobilePhone',phone);
			}
			if(lat != null){
				con.set('mailinglatitude',lat);
			}
			if(lng != null){
				con.set('mailinglongitude',lng);
			}

			org.update({sobject: con}, err => {
			    console.log('Contact to be updated***'+con.get("FacebookId__c"));
			    if (err) {
				console.log('ERROR');
				reject("An error as occurred"+err);
			    } else {
				console.log('Contact Updated');  
				resolve(con);
			    }

			});
		}
	});
        
	    
    });
	
	
};

let getPhoneNumber = (userId) => {
	
    return new Promise((resolve, reject) => {
	console.log('UserId***'+userId);
	let q = "SELECT Id, mobilePhone from contact where FacebookId__c = '" + userId + "'";                 
        
        console.log('Find contact**' + q);
	
        org.query({query: q}, (err, resp) => {
		
		if (err) {
		console.log('ERROR');
		reject("An error as occurred");
		}
		else if (resp.records && resp.records.length>0) {
			console.log('Phone Number***'+resp.records[0].get("mobilePhone"));
			resolve(resp.records[0].get("mobilePhone"));
		}
        });
    });
};
let getContactDetails = (userId) => {
	
    return new Promise((resolve, reject) => {
	console.log('UserId***'+userId);
	let q = "SELECT Id, mobilePhone, MailingCity, MailingCity, MailingCountry, MailingPostalCode, MailingStreet from contact where FacebookId__c = '" + userId + "'";                 
        
        console.log('Find contact**' + q);
	
        org.query({query: q}, (err, resp) => {
		
		if (err) {
		console.log('ERROR');
		reject("An error as occurred");
		}
		else if (resp.records && resp.records.length>0) {
			console.log('Phone Number***'+resp.records[0].get("mobilePhone"));
			resolve(resp.records[0]);
		}
        });
    });
};
let getRecentOpportunityFromContactId = (userId) => {
	return new Promise((resolve, reject) => {
	console.log('UserId***'+userId);
	let q = "SELECT Id from opportunity where contact__r.FacebookId__c = '" + userId + "' order by createddate desc limit 1";                 
        
        console.log('Find contact**' + q);
	
        org.query({query: q}, (err, resp) => {
		
		if (err) {
		console.log('ERROR');
		reject("An error as occurred");
		}
		else if (resp.records && resp.records.length>0) {
			console.log('Phone Number***'+resp.records[0].get("mobilePhone"));
			resolve(resp.records[0].get("Id"));
		}
        });
    });
};

login();

exports.org = org;
exports.findTitleCard = findTitleCard;
exports.findOpenBranches = findOpenBranches;
exports.createOpportunity = createOpportunity;
exports.findMainMenus = findMainMenus;
exports.findSubMenus = findSubMenus;
exports.getSelectedMenu = getSelectedMenu;
exports.createOpportunityProduct = createOpportunityProduct;
exports.findOpportunityLineItem = findOpportunityLineItem;
exports.getSelectedMenuFromOli = getSelectedMenuFromOli;
exports.removeOLI = removeOLI;
exports.updatePhone = updatePhone;
exports.getPhoneNumber = getPhoneNumber;
exports.getRecentOpportunityFromContactId = getRecentOpportunityFromContactId;
exports.getContactDetails = getContactDetails;

