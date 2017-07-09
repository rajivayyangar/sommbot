// Experience: suggest a wine

const Fieldbook = require('./fieldbook')
const book = Fieldbook.book 
const fbmessenger = require('./fbmessenger')


function sendCasualWineSuggestion(sender) {
    var filter = {user_type:'casual'}
    book.getSheet('content', filter)
    .then(
    (data) => //promises...: "then" means it executes after everything else on the page. a jump through time.
    { 
        var wine = data[0];
        let intro_text = "The best way to expand your palate is to try as many wine styles (grape+region, e.g. Cabernet from California) as possible, and discover which you like, and which you don't.\n\n Each week I'll recommend a classic style that you can find in your local wine shop."
        let wine_style_text = "This week I'm excited about " + wine.classic_style + "\n\n" 
            + wine.classic_style_description
        let bottle_to_buy_text = "For a specific bottle, check out the "+ wine.wine_name + ". " + wine.description;
        console.log(intro_text);

        var qr = fbmessenger.makeQuickReplies(["More","Ok"]);

        fbmessenger.sendTextMessage(sender, intro_text, null, function() {
            fbmessenger.sendTextMessage(sender, wine_style_text, null, function() {
                fbmessenger.sendTextMessage(sender, bottle_to_buy_text, null, function() {
                    fbmessenger.sendWineCard(sender,wine,qr);
                });
            });
        });
    })
    .catch((error) => {
      console.log(error);
    });
}
function sendCasualWineMore(sender) {
    var filter = {user_type:'casual'}
    book.getSheet('content', filter)
    .then(
    (data) => //promises...: "then" means it executes after everything else on the page. a jump through time.
    { 
        var wine = data[0];
        let intro_text = "Well, since you asked..."
        var qr = fbmessenger.makeQuickReplies(["Ok"]);
        let wine_details = wine.details;
        let wine_details_continued = wine.details_continued;
        //console.log(wine_details)

        fbmessenger.sendTextMessage(sender, intro_text, null, function() {
            fbmessenger.sendTextMessage(sender, wine_details, qr, function() {
                if(wine_details_continued){
                    fbmessenger.sendTextMessage(sender, wine_details_continued, qr);
                }
            });
        });
    })
    .catch((error) => {
      console.log(error);
    });
}
function sendGeekWineSuggestion(sender) {
    var filter = {user_type:'geek'}
    book.getSheet('content', filter)
    .then(
    (data) => //promises...: "then" means it executes after everything else on the page. a jump through time.
    { 
        var wine = data[0];
        let intro_text = "Aha—a fellow wine nerd! I'm going to try to push you out of your comfort zone with a non-classic wine style.\n\n"
        let wine_style_text = "This week I'm excited about " + wine.classic_style + ".";
        let bottle_to_buy_text = wine.description;
        //console.log(intro_text)
        var qr = fbmessenger.makeQuickReplies(["Bio","Winemaking","Geo"]);
        fbmessenger.sendTextMessage(sender,intro_text, null, function(){
            fbmessenger.sendTextMessage(sender, wine_style_text, null, function(){
                fbmessenger.sendTextMessage(sender, bottle_to_buy_text, null, function(){
                    fbmessenger.sendWineCard(sender,wine,qr);
                });
            });
        });
    })
    .catch((error) => {
      console.log(error);
    });
}
function sendGeekWineBio(sender) {
    var filter = {user_type:'geek'}
    book.getSheet('content', filter)
    .then(
    (data) => //promises...: "then" means it executes after everything else on the page. a jump through time.
    { 
        var wine = data[0];
        let bio_text = wine.winemaker_bio;
        let winemaker_image_url = wine.winemaker_image_url;
        //console.log(intro_text)
        var qr = fbmessenger.makeQuickReplies(["Winemaking","Geo","Buy"]);
        fbmessenger.sendTextMessage(sender,bio_text, qr, function(){
            fbmessenger.sendImageMessage(sender, winemaker_image_url, qr);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}
function sendGeekVineyardGeo(sender) {
    var filter = {user_type:'geek'}
    book.getSheet('content', filter)
    .then(
    (data) => //promises...: "then" means it executes after everything else on the page. a jump through time.
    { 
        var wine = data[0];
        let geo_text = wine.vineyard_geo;
        let vineyard_image_url = wine.vineyard_image_url;
        //console.log(intro_text)
        var qr = fbmessenger.makeQuickReplies(["Winemaking","Bio","Buy"]);
        fbmessenger.sendTextMessage(sender,geo_text, qr, function(){
            if(vineyard_image_url){
                fbmessenger.sendImageMessage(sender, vineyard_image_url, qr);
            }
        });
    })
    .catch((error) => {
      console.log(error);
    });
}
function sendGeekWinemaking(sender) {
    var filter = {user_type:'geek'}
    book.getSheet('content', filter)
    .then(
    (data) => //promises...: "then" means it executes after everything else on the page. a jump through time.
    { 
        var wine = data[0];
        let winemaking_text = wine.winemaking;
        //console.log(intro_text)
        var qr = fbmessenger.makeQuickReplies(["Bio","Geo","Buy"]);
        fbmessenger.sendTextMessage(sender,winemaking_text, qr);
    })
    .catch((error) => {
      console.log(error);
    });
}
function sendGeekWineBuy(sender) {
    var filter = {user_type:'geek'}
    book.getSheet('content', filter)
    .then(
    (data) => //promises...: "then" means it executes after everything else on the page. a jump through time.
    { 
        var wine = data[0];
        let intro_text = "You can buy this from our friends over at Banquet:";
        var qr = fbmessenger.makeQuickReplies(["Ok"]);
        fbmessenger.sendTextMessage(sender,intro_text, null, function(){
            fbmessenger.sendWineCard(sender,wine,qr);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
	sendCasualWineSuggestion : sendCasualWineSuggestion,
	sendCasualWineMore : sendCasualWineMore,
	sendGeekWineSuggestion : sendGeekWineSuggestion,
	sendGeekWineBio : sendGeekWineBio,
	sendGeekVineyardGeo : sendGeekVineyardGeo,
	sendGeekWinemaking : sendGeekWinemaking,
	sendGeekWineBuy : sendGeekWineBuy,
}
