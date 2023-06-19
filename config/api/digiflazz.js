require('dotenv').config()
const fetch = require('node-fetch');
const utils = {};

utils.digiflazzjson = async function (url,bodyparam) {
    const responsejson = await fetch(url, {
            method: 'post',
            body: bodyparam,
            headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json()).catch(e => {
        console.error({
            "pesan": "ahh.. snap",
            "error" : e,
        })
    })
    return responsejson;
}
utils.digiflazzjsonwebhook = async function (req,hmac) {
    let digiwebhooks;
    if(req.headers['x-hub-signature'] === "sha1="+hmac) {
        digiwebhooks = {
            event: req.headers['x-digiflazz-event'],
            delivery: req.headers['x-digiflazz-delivery'],
            data: req.body.data
        }
    }
    return digiwebhooks;
}

module.exports = utils;