const utils = {};
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const OTPAuth = require('otpauth');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const keyreal = crypto.scryptSync("SelaLuchCint4Kamoe", "garam", 32);
const ivreal = crypto.scryptSync("SelaLuchCint4Kamoe", "garam", 16);

utils.kirimemail = function (host,port,secure,user,pass){
	let transporter = nodemailer.createTransport({
		host: host,
		port: port,
		secure: secure,
		auth: {
			user: user,
			pass: pass,
		},
	});
	return transporter;
}
utils.otp = function (){
	let totp = new OTPAuth.TOTP({
		issuer: 'ACME',
		label: 'XllentPay',
		algorithm: 'SHA1',
		digits: 6,
		period: 90,
		secret: OTPAuth.Secret.fromRaw(process.env.OTP_TOKEN_RHS)
	});
	return totp;
}
utils.eksekusiQueryPromise = async (req, sql, param, con) => {
    return new Promise(function (resolve, reject) {
        con.query(sql, param, (err, rows) => {
            if (err) {
                resolve(err)
            } else {
                resolve(rows);
            }
        });
    });
}
utils.encrypt = function (text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(keyreal), ivreal);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return JSON.stringify({ publickey: iv.toString('hex'), lokasihttaccess: encrypted.toString('hex'), publicsalt: key.toString('hex')});
}
utils.decrypt = function (text) {
    let textparse = JSON. parse(text)
    let encryptedText = Buffer.from(textparse.lokasihttaccess, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(keyreal), ivreal);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
utils.rsaencrypt = function (text, key) {
    const crypt = new JSEncrypt();
    crypt.setKey(key);
    return crypt.encrypt(text);
}

utils.rsadecrypt = function (encrypted, privateKey) {
    const crypt = new JSEncrypt();
    crypt.setPrivateKey(privateKey);
    return crypt.decrypt(encrypted);
}
utils.eksekusiQuery = async (req, sql, param, con) => {
    con.query(sql, param, (err, rows) => {
        if (err) {
            return (err);
        } else {
            return rows;
        }
    });
}
utils.replaceMiddle = (string, n) => {
    var rest = string.length - n;
    return string.slice(0, Math.ceil(rest / 2) + 1) + '*'.repeat(n) + string.slice(-Math.floor(rest / 2) + 1);
};

utils.randomstring = function (length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
utils.terbilang = function (bilangan) {
    var kalimat = "";
    var angka = new Array('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0');
    var kata = new Array('', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan');
    var tingkat = new Array('', 'Ribu', 'Juta', 'Milyar', 'Triliun');
    var panjang_bilangan = bilangan.length;

    /* pengujian panjang bilangan */
    if (panjang_bilangan > 15) {
        kalimat = "Diluar Batas";
    } else {
        /* mengambil angka-angka yang ada dalam bilangan, dimasukkan ke dalam array */
        for (i = 1; i <= panjang_bilangan; i++) {
            angka[i] = bilangan.substr(-(i), 1);
        }
        var i = 1;
        var j = 0;
        /* mulai proses iterasi terhadap array angka */
        while (i <= panjang_bilangan) {
            subkalimat = "";
            kata1 = "";
            kata2 = "";
            kata3 = "";
            /* untuk Ratusan */
            if (angka[i + 2] != "0") {
                if (angka[i + 2] == "1") {
                    kata1 = "Seratus";
                } else {
                    kata1 = kata[angka[i + 2]] + " Ratus";
                }
            }
            /* untuk Puluhan atau Belasan */
            if (angka[i + 1] != "0") {
                if (angka[i + 1] == "1") {
                    if (angka[i] == "0") {
                        kata2 = "Sepuluh";
                    } else if (angka[i] == "1") {
                        kata2 = "Sebelas";
                    } else {
                        kata2 = kata[angka[i]] + " Belas";
                    }
                } else {
                    kata2 = kata[angka[i + 1]] + " Puluh";
                }
            }
            /* untuk Satuan */
            if (angka[i] != "0") {
                if (angka[i + 1] != "1") {
                    kata3 = kata[angka[i]];
                }
            }
            /* pengujian angka apakah tidak nol semua, lalu ditambahkan tingkat */
            if ((angka[i] != "0") || (angka[i + 1] != "0") || (angka[i + 2] != "0")) {
                subkalimat = kata1 + " " + kata2 + " " + kata3 + " " + tingkat[j] + " ";
            }
            /* gabungkan variabe sub kalimat (untuk Satu blok 3 angka) ke variabel kalimat */
            kalimat = subkalimat + kalimat;
            i = i + 3;
            j = j + 1;
        }
        /* mengganti Satu Ribu jadi Seribu jika diperlukan */
        if ((angka[5] == "0") && (angka[6] == "0")) {
            kalimat = kalimat.replace("Satu Ribu", "Seribu");
        }
    }
    return kalimat;
}
utils.replacestringaaray = function ( str, findArray, replaceArray ){
	var i, regex = [], map = {}; 
	for( i=0; i<findArray.length; i++ ){ 
		regex.push( findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g,'\\$1') );
		map[findArray[i]] = replaceArray[i]; 
	}
	regex = regex.join('|');
	str = str.replace( new RegExp( regex, 'g' ), function(matched){
		return map[matched];
	});
	return str;
}
utils.ekstensiuploadimage = function not(data, jenis) {
	var names = [];
	if (jenis == "'ubahinfoagen'"){
		names = ["image/jpeg", "image/jpg","application/octet-stream"];
	}
	if (names.indexOf(data) !== -1) return true;
	return false
}

module.exports = utils;