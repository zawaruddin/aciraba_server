require('dotenv').config()
const { isEmpty } = require('lodash');
const authController = {}
const AuthModel = require("../model/Auth")
const util = require('../config/utils');
let hasiljson

authController.pendaftaranmember = async function (req, res) {
	var data = []
	data.push(req.body.NAMAOUTLET)
	data.push(req.body.NAMA)
	data.push(req.body.NAMAPENGGUNA)
	data.push(req.body.PASSWORD)
	data.push(req.body.KODEUNIKMEMBER)
	hasiljson = await AuthModel.pendaftaranmember(req, data, req.con)
	res.json({
		hasiljson: hasiljson,
	});
}
authController.registerapps = async function (req, res) {
	var data = []
	data.push(req.body.PENGGUNA_ID)
	data.push(req.body.NAMA)
	data.push(req.body.NAMAOUTLET)
	data.push(req.body.NAMAPENGGUNA)
	data.push(req.body.PASSWORD)
	data.push(req.body.KODEUNIKMEMBER)
	data.push(req.body.URLFOTO)
	data.push(req.body.HAKAKSESID)
	data.push(req.body.ALAMAT)
	data.push(req.body.NOTELP)
	data.push(req.body.NOREKENING)
	data.push(req.body.KETERANGAN)
	data.push(req.body.TOTALDEPOSIT)
	data.push(req.body.IDHAKAKSES)
	data.push(req.body.PIN)
	data.push(req.body.LATLONG)
	data.push(req.body.EMAIL)
	data.push(req.body.TOKENKEY)
	data.push(req.body.STATUSAKTIF)
	data.push(req.body.NOMOR)
	hasiljson = await AuthModel.registerapps(req, data, req.con)
	res.json({
		registerapps: hasiljson,
	});
}
authController.loginapps = async function (req, res) {
	var data = []
	data.push(req.body.NAMAPENGGUNA)
	data.push(req.body.PASSWORDWEB)
	data.push(req.body.KODEKOMPUTER)
	data.push(isEmpty(req.body.DEVICEID) == "true" ? "" : req.body.DEVICEID)
	data.push(isEmpty(req.body.AUTHLOCAL) == "true" ? "" : req.body.AUTHLOCAL)
	hasiljson = await AuthModel.loginapps(req, data, req.con)
	if (req.body.DEVICEID != ""){
		if (hasiljson[0].success == true){
			kirimotp("email",hasiljson[0].decryptdata.dcemailsuer)
		}
	}
	res.json({
		loginapps: hasiljson,
	});
}
authController.forgetpasspin = async function (req, res) {
	var data = []
	data.push(req.body.EMAILTERDAFTAR)
	data.push(req.body.USERNAMETERDAFTAR)
	data.push(req.body.JENISRESET)
	hasiljson = await AuthModel.forgetpasspin(req, data, req.con)
	if (hasiljson != ""){
		await util.kirimemail(process.env.EMAIL_HOST,process.env.EMAIL_PORT, process.env.EMAIL_ISSECURE,process.env.EMAIL_USERNAME,process.env.EMAIL_PASSWORD).sendMail({
			from: 'XLLENT PAY BOT RESET PASSWORD',
			to: req.body.EMAILTERDAFTAR, //pisahkan dengan koma jika lebih dari 1 email penerima
			subject: "LUPA PASSWORD, OKE GAK MASALAH",
			html: "<b>Password Baru Anda : </b>" + hasiljson + ".<br><b>Status Aktif : Selamanya</b><br>Siap nih brofist, ini dia password baru kami yang udah dibuatin sama XLLENT PAY. Jangan sampai lupa lagi ya. Oh ya silahkan hapus email ini jika dirasa sudah diperlukan. TERIMA KASIH, SALAM HANGAT",
		})
		res.json({
			success: "true",
			msg: "Oke bosque. Password baru sudah kami kirim ke EMAIL: "+req.body.EMAILTERDAFTAR+". Silahkan cek pada FOLDER SPAM jika tidak ada",
		});
	}else{
		res.json({
			success: "false",
			msg: "Mohon maaf, NAMAPENGGUNA: "+req.body.USERNAMETERDAFTAR+" dan EMAIL: "+req.body.EMAILTERDAFTAR+" tidak ditemukan di database kami. Mohon cek apakah ada kesalaha pengetikan",
		});
	}
}
authController.outlet = async function (req, res) {
	var data = []
	data.push(req.body.KATAKUNCIPENCARIAN)
	data.push(req.body.KODEUNIKMEMBER)
	hasiljson = await AuthModel.outlet(req, data, req.con)
	res.json({
		hasiljson: hasiljson,
	});
}
authController.detailinformasioutlet = async function (req, res) {
	var data = []
	data.push(req.body.KODEOUTLET)
	data.push(req.body.KODEUNIKMEMBER)
	hasiljson = await AuthModel.detailinformasioutlet(req, data, req.con)
	res.json({
		hasiljson: hasiljson,
	});
}
authController.hapusoutlet = async function (req, res) {
	var data = []
	data.push(req.body.KODEOUTLET)
	data.push(req.body.KODEUNIKMEMBER)
	hasiljson = await AuthModel.hapusoutlet(req, data, req.con)
	res.json({
		hasiljson: hasiljson,
	});
}
authController.statuspegawai = async function (req, res) {
	var data = []
	data.push(req.body.IDPENGGUNA)
	data.push(req.body.NAMAPENGGUNA)
	data.push(req.body.NAMAOUTLET)
	data.push(req.body.STATUSPENGGUNA)
	data.push(req.body.KODEUNIKMEMBER)
	hasiljson = await AuthModel.statuspegawai(req, data, req.con)
	res.json({
		hasiljson: hasiljson,
	});
}
authController.ubahpasswordproses = async function (req, res) {
	var data = []
	data.push(req.body.IDPENGGUNABARU)
	data.push(req.body.PASSWORDKAMU)
	data.push(req.body.PASSWORDBARU)
	data.push(req.body.KODEUNIKMEMBER)
	data.push(req.body.IDPENGGUNAKAMU)
	hasiljson = await AuthModel.ubahpasswordproses(req, data, req.con)
	res.json({
		hasiljson: hasiljson,
	});
}
authController.daftarpegawai = async function (req, res) {
	var data = []
	data.push(req.body.KODEUNIKMEMBER)
	hasiljson = await AuthModel.daftarpegawai(req, data, req.con)
	res.json({
		hasiljson: hasiljson,
	});
}
authController.simpanhakakses = async function (req, res) {
	var data = []
	data.push(req.body.KODEUNIKMEMBER)
	data.push(req.body.NAMAHAKAKSES)
	data.push(req.body.JSONMENU)
	data.push(req.body.KONDISI)
	data.push(req.body.AI)
	hasiljson = await AuthModel.simpanhakakses(req, data, req.con)
	res.json({
		hasiljson: hasiljson,
	});
}
authController.daftarhakakses = async function (req, res) {
	var data = []
	data.push(req.body.KODEUNIKMEMBER)
	data.push(typeof req.body.KATAKUNCI === "undefined" ? "" : req.body.KATAKUNCI)
	hasiljson = await AuthModel.daftarhakakses(req, data, req.con)
	res.json({
		hasiljson: hasiljson,
	});
}
async function kirimotp(jeniskirimotp,tujuanotp,){
	let tokenUser =  util.otp().generate();
		if (jeniskirimotp == "email") {
			await util.kirimemail(process.env.EMAIL_HOST,process.env.EMAIL_PORT, process.env.EMAIL_ISSECURE,process.env.EMAIL_USERNAME,process.env.EMAIL_PASSWORD).sendMail({
				from: 'ACIPAY BOT OTP',
				to: tujuanotp, //pisahkan dengan koma jika lebih dari 1 email penerima
				subject: "KUNCI PRIVATE OTP (RAHASIA) RESEND",
				html: "<b>Kode OTP Anda : </b>" + tokenUser + ".<br><b>Masa aktif token : </b>" + util.otp().period + " detik<br>PERINGATAN BROTHER SISTER YAA.. Ingat jangan berikan kode OTP kepada siapaun termasuk tim ACIPAY. Kalau ada yang mengaku dari TIM ACIPAY meminta OTP ke kamu? ajak berantem aja dia olok olok sampai PUAS",
			})
		}
}
authController.validasiotp = async function (req, res) {
	if (req.body.VALIDASIKAH == "kirimulangotp") {
		kirimotp(req.body.JENISKIRIMOTP,req.body.TUJUANOTP)
		res.json({
			success: "true",
		});
	}else if (req.body.VALIDASIKAH == "validasiotp") {

	}
}
module.exports = authController