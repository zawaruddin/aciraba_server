require('dotenv').config()
const express = require('express')
const http = require('http')
const fileUpload = require('express-fileupload');
const con = require("./config/db.js")
const listendatabase = require('./config/listendatabase.js')
const app = express()
const server = http.Server(app)
const cors = require("cors");
options = {
    cors: true,
    origins: ["http://localhost:1111"],
    transports: ['websocket', 'polling'],
    forceNew: true,
    upgrade: false
}
const io = require('socket.io')(server, options);
const MySQLEvents = require('@rodrigogs/mysql-events');
const nDate = new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta'
});

app.disable('x-powered-by');
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
con.rekoneksidatabase;
app.use(function (req, res, next) {
    req.con = con.konekdatabase
    next()
})
//call socket io globally
global.io = io;
//call uploadfile
app.use(fileUpload());
// include router
const auth = require("./routes/authrouter")
const masterdata = require("./routes/masterdatarouter")
const penjualan = require("./routes/penjualanrouter");
const pembelian = require("./routes/pembelianrouter");
const penyesuaian = require("./routes/penyesuaianrouter");
const apiluar = require("./routes/apiluarrouter");
const resto = require("./routes/restorouter");
const laporan = require("./routes/laporanrouter");
//const acipay = require("./routes/acipayrouter");
// routing
app.use("/auth", auth)
app.use("/masterdata", masterdata)
app.use("/penjualan", penjualan)
app.use("/pembelian", pembelian)
app.use("/penyesuaian", penyesuaian)
app.use("/apiluar", apiluar)
app.use("/resto", resto)
app.use("/laporan", laporan)
//app.use("/acipay", acipay)
//call listen database
listendatabase.updateBarangKeluar(io, con.konekdatabase);
console.log('Aciraba Server Berjalan '+nDate)
console.log('Listen Mysql : ' + MySQLEvents.STATEMENTS.ALL)
server.listen(1111)