const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logs.txt"));
const https = require("https");

function sendMessageWhatsApp(data) {

    const options = {
        host: "graph.facebook.com",
        path: "/v17.0/136981909491147/messages",
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer EAAL9DTHrRdoBOZB24S7iMha9C2NeWs3PMkBuF834wfzKI204LApW8HMeyhVj2vKkM67Htyw064Mpz5uGbbEgBJyW33yZCDnAJaIkFn8FnVk5IThnM1aQMlV8s8GmQHivFN8Qpva5icST5tBSAl9ZArJhawHXGVgNVpfhgCZCqYB5hxU5Fl4ZAToh0xNl7Vm6ZA"
        }
    };
    const req = https.request(options, res => {
        res.on("data", d => {
            process.stdout.write(d);
        });
    });

    req.on("error", error => {
        console.error(error);
    });

    req.write(data);
    req.end();
}

module.exports = {
    sendMessageWhatsApp
};