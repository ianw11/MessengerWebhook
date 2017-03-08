var login = require('facebook-chat-api');
var https = require('https');

var password = require("./password").password;

var host = "nectarsac.com";
var port = 8800;
var path = "/messengerWebhook";

var username = "saltyserrano@gmail.com";

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

        post(body);
    });
});
