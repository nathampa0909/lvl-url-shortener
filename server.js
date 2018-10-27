const express = require("express");
const server = express();
let urls = [];
let password = (653126135).toString(16);

server.get('/', function (req, res) {
    res.send('hello world');
});

server.listen(3024, console.log("Servidor iniciado na porta 3024"));

function encurtar(url) {
    let urlhex = (urls.length + 1048576).toString(16);
    let urlcheck = url.split("://");
    let type;

    if (urlcheck.includes("http") || urlcheck.includes("https")) {
        type = urlcheck[0];
    } else {
        type = "http";
    }

    let urldata = {
        time: Date.now(),
        original: urlcheck.pop(),
        encripted: urlhex,
        type: type,
    };
    urls.push(urldata);
    return urldata;
}

server.get('/short', function (req, res) {
    const url = req.query.url;
    if (url) {
        let hex = encurtar(url);
        res.send(hex);
    } else {
        res.send({ error: "URL não informada." })
    }
});



server.get("/deencripted", function (req, res) {
    let hex = req.query.hex;
    if (!hex) {
        res.send({ error: "URL não informada." })
    } else {
        let index = urls.findIndex((el) => {
            return el.encripted == hex
        });
        if (index != -1) {
            let currentTime = Date.now()
            let urlCreatedTime = urls[index].time
            const fiveDaysOnMilliseconds = 432000000
            let deltaTime = currentTime - urlCreatedTime
            if (deltaTime >= fiveDaysOnMilliseconds) {
                res.send({ error: "URL expirada" })
            } else {
                res.redirect(`${urls[index].type}://${urls[index].original}`)
            }

        } else {
            res.send({ error: "Hash não encontrado." })
        }
    }
});

server.post('/report', function (req, res) {
    let pass = req.body.pass;
    if (pass.toLowerCase() == password) {
        res.send({ Urls: urls });
    } else {
        res.send({ error: "Senha informada incorreta." });
    }
});

// setInterval(function () {
//     password = (Math.floor(Math.random() * 999999999) - 100000000).toString(16);
//     console.log(password);
// }, 1000 * 1);