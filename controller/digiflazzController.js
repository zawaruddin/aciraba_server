require('dotenv').config()
const digiflazzcallback = {}
const mdf = require("../model/Digiflazz")
const penjualandata = require("../controller/penjualanController")
const crypto = require('crypto');
const _ = require('lodash');
const digiflazz = require('../config/api/digiflazz');

function signature(kondisi){
    let _sign= crypto.createHash('md5').update(`${process.env.DIGIFLAZZ_USERNAME}${process.env.DIGIFLAZZ_KEY}${kondisi}`).digest('hex')
    return _sign;
}
digiflazzcallback.inquiry = async function(req,res){
    pesanbalik = [];
	if (req.body.CMD == "CEKID"){
        responsejson = await digiflazz.digiflazzjson('https://api.digiflazz.com/v1/transaction',JSON.stringify({"commands": "pln-subscribe","customer_no": req.body.TUJUAN}))
    }else if (req.body.CMD == "CEKTAGIHAN"){
        responsejson = await digiflazz.digiflazzjson('https://api.digiflazz.com/v1/transaction',JSON.stringify({
            "commands": "inq-pasca",
            "username": process.env.DIGIFLAZZ_USERNAME,
            "buyer_sku_code": "pln",//req.body.SKUKODE
            "customer_no": "530000000005",//req.body.TUJUAN
            "ref_id": req.body.REFID,
            "testing": true,
            "sign": signature(req.body.REFID)
        }))
    }
    pesanbalik.push(responsejson)
    return pesanbalik;
}
digiflazzcallback.apidigiflazz = async function(req,res,cmd){
	if (cmd == "ceksaldo"){
        const responsejson = await digiflazz.digiflazzjson('https://api.digiflazz.com/v1/cek-saldo',JSON.stringify({ cmd:"deposit", username:process.env.DIGIFLAZZ_USERNAME, sign:_sign+"depo"}))
        res.json(responsejson)	
    }else if (cmd == "daftarprodukprepaid"){
        const jenisproduk = req.body.JENISPRODUK
        const kategoriproduk = req.body.KATPRODUK
        const responsejson = await digiflazz.digiflazzjson('https://api.digiflazz.com/v1/price-list',JSON.stringify({ cmd:jenisproduk, username:process.env.DIGIFLAZZ_USERNAME, sign:_sign, code:kategoriproduk}))
        res.json(responsejson)	
    }else if (cmd == "toupdigiflazz"){
        const nominaltopup = req.body.NOMINALTOPUP
        const atasnama = req.body.ATASNAMA
        const banktujuan = req.body.BANKTUJUAN
        const responsejson = await digiflazz.digiflazzjson('https://api.digiflazz.com/v1/price-list',JSON.stringify({"username": process.env.DIGIFLAZZ_USERNAME,"amount": nominaltopup,"Bank": banktujuan, /* kode bank umum BCA,BNI,MANDIRI */"owner_name": atasnama,"sign": _sign}))
        res.json(responsejson)	
    }else if (cmd == "transaksidf"){
        const kodeserver = "xld10"//req.body.KODEPRODUK
        const tujuan = "087800001233"//req.body.TUJUAN
        const kodetrx = req.body.TRANSKASI_ID
        const responsejson = await digiflazz.digiflazzjson('https://api.digiflazz.com/v1/transaction',JSON.stringify({"username": process.env.DIGIFLAZZ_USERNAME,"buyer_sku_code": kodeserver,"customer_no": tujuan,"ref_id": kodetrx,"sign": signature(kodetrx),"testing":true}))
        return responsejson;
    }else if (cmd == "pasca"){
        const commands = req.body.COMMAND
        const tujuan = req.body.TUJUAN
        const kodetrx = req.body.KODETRX
        const responsejson = await digiflazz.digiflazzjson('https://api.digiflazz.com/v1/transaction',JSON.stringify({"commands": commands,"username": process.env.DIGIFLAZZ_USERNAME,"buyer_sku_code": "pln","customer_no":tujuan,"ref_id": kodetrx,"sign": _sign}))
        res.json(responsejson)	
    }else if (cmd == "tokenPLN"){
        const tujuan = req.body.TUJUAN
        const responsejson = await digiflazz.digiflazzjson('https://api.digiflazz.com/v1/transaction',JSON.stringify({"commands": "pln-subscribe","customer_no": tujuan}))
        res.json(responsejson)	
    }
}
digiflazzcallback.digiflazzwebhook = async function(req){
    const hmac = crypto.createHmac('sha1', process.env.DIGIFLAZZ_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
    const responsejson = await digiflazz.digiflazzjsonwebhook(req,hmac)
    penjualandata.webhookapi(req,responsejson);
}
digiflazzcallback.updateproduk = async function(req,res){
    data = [];
    const jenisproduk = req.body.JENISPRODUK
    const kategoriproduk = req.body.KATPRODUK
    const pemisah = req.body.PEMISAH
    const batasjumlahhuruf = req.body.BATASJUMLAH
    const responsejson = await digiflazz.digiflazzjson('https://api.digiflazz.com/v1/price-list',JSON.stringify({ cmd:jenisproduk, username:process.env.DIGIFLAZZ_USERNAME, sign:signature("pricelist"), code:kategoriproduk}))
    data.push(_.filter(responsejson.data, function(o) { return o.buyer_sku_code.substring(0, batasjumlahhuruf) == pemisah}))
    data.push(req.body.PRODUK_OPERATOR_ID.substr(0, req.body.PRODUK_OPERATOR_ID.indexOf('-')).replace(/\s/g, ''))
    data.push(req.body.PRODUK_KATEGORI_ID)
    data.push(req.body.JENISPRODUK)
    data.push(req.body.IKONPRODUK)
    hasiljson = await mdf.updateproduk(req,data,req.con)
    res.json({
        hasiljson: hasiljson,
    });
}

module.exports = digiflazzcallback