var login = require('facebook-chat-api');
var https = require('https');

var password = require("./password").password;

var host = "nectarsac.com";
var port = 8800;
var path = "/messengerWebhook";

var username = "saltyserrano@gmail.com";

var SENDER_ID_LOOKUP = {
    "750709684": "Ian Washburne"
};

function post(body) {
    var options = {
        host: host,
        //port: port,
        path: path,
        method: "POST",
        headers: {
            'content-length': body.length
        }
    };

    var req = https.request(options, function(res) {
        // Do nothing on response
    });

    req.on('error', function(e) {
        console.log("Error with post request: " + e.message);
    });

    req.write(body);
    req.end();
};

function process(json) {
    var senderId = json.senderID;
    var senderName = SENDER_ID_LOOKUP[senderId];
    if (senderName === undefined) {
        senderName = "UNKNOWN NAME";
    }

    if (json.body.startsWith("/roll")) {
        api.sendMessage("Roll request");
    }

    console.log("Processing name: " + senderName + " (" + senderId + ")");

    return {
        name: senderName
    };
};

login({email: username, password: password}, function (err, api) {
    if (err) {
        console.error(err);
        return;
    }

    api.setOptions({listenEvents: true});

    api.listen(function(err, message) {
        if (err) {
            console.error(err);
            return;
        }

        if (message.type === "typ" || message.type === 'read_receipt') {
            return;
        }

        var body = JSON.stringify(message);
        console.log(body);

        process(message);

        post(body);
    });
});
