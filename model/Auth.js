require('dotenv').config()
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const util = require('../config/utils');
const auth = {}
var pesanbalik = {}

auth.apiregister = async function (req, data, con) {
  pesanbalik = [];
  let hashedPassword = await bcrypt.hash(data[3], 10)
  let adadata = await util.eksekusiQueryPromise(req, `SELECT COUNT(*) AS ADADATA FROM 01_syn_apiusers WHERE (API_EMAIL = ? or API_USERNAME = ?) AND API_KODEUNIKMEMBER = ? LIMIT 1`, [data[5], data[2], data[4]], con);
  if (adadata[0].ADADATA > 0) {
    data = {
      success: 'false',
      rc: 'API00001',
      msg: '[API00001] Informasi email atau username yang didaftarkan pada API sudah terdaftar, silahkan daftarkan dengan akun lain'
    };
  } else {
    var datetime = new Date();
    let queryproses = await util.eksekusiQueryPromise(req, 'INSERT INTO `01_syn_apiusers` (`API_ID`, `API_NAMAAWAL`, `API_NAMAAKHIR`, `API_USERNAME`, `API_HASH`, `API_KODEUNIKMEMBER`, `API_DIBUAT`, `API_EMAIL`,`API_AKTIF`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', ['',data[0],data[1],data[2],hashedPassword,data[4],datetime,data[5],"1",], con)
    if (queryproses.affectedRows > 0) {
      data = {
        success: 'true',
        rc: 'S01',
        msg: 'Pendaftaran API anda berhasil, selamat datang di aciraba dan bekerja sama dengan kami. Semoga menjadi rekan yang saling menguntungkan'
      };
    } else {
      data = {
        success: 'false',
        rc: queryproses.code,
        msg: queryproses.sqlMessage
      };
    }
  }
  pesanbalik.push(data)
  return pesanbalik;
}

auth.apilogin = async function (req, data, con) {
  pesanbalik = [];
  let cekHash = JSON.parse(JSON.stringify(await util.eksekusiQueryPromise(req, `SELECT * FROM 01_syn_apiusers where API_USERNAME = ? AND API_EMAIL = ? AND API_AKTIF = 1 LIMIT 1`, [data[0], data[2]], con)));
  if (cekHash.length == 0) {
    data = {
      success: 'false',
      code: '404_LOGIN',
      msg: 'Pastikan informasi yang anda masukkan valid, tidak terblokir dan terdaftar pada sistem kami'
    }
  } else {
    let passplain = await bcrypt.compare(data[1], cekHash[0].API_HASH);
    if (passplain == true) {
      const token = jwt.sign({
        sub: cekHash[0].API_ID
      }, process.env.ACCESS_TOKEN_RHS, {
        expiresIn: '180d'
      });
      util.eksekusiQueryPromise(req, 'UPDATE `01_syn_apiusers` SET `API_TOKEN`= ? WHERE `API_ID`=?', [
        token,
        cekHash[0].API_ID,
      ], con)
      data = {
        success: 'true',
        rc: 'API0000',
        data: cekHash,
        tokenapi: token
      };
    } else {
      data = {
        success: 'false',
        rc: 'API00003',
        msg: '[API00003] Pastikan informasi yang anda masukkan valid, tidak terblokir dan terdaftar pada sistem kami'
      };
    }
  }
  pesanbalik.push(data)
  return pesanbalik;
}
auth.sysapp = async function (req, data, con) {
  let sysapp = JSON.parse(JSON.stringify(await util.eksekusiQueryPromise(req, `INSERT INTO 01_syn_app (AI, JENISSYN, QUERYSYSN, STATUS,TANGGAL) VALUES (?,?,?,?,?)`, [data[0], data[1], data[2], data[3], data[4]], con)));
  if (sysapp.affectedRows > 0) {
    data = {
      success: "true",
      rc: "API00000",
      msg: "Informasi data anda berhasil tersimpan di database",
    }
  } else {
    data = {
      success: 'false',
      rc: sysapp.code,
      msg: sysapp.sqlMessage
    }
  }
}
auth.loginapps = async function (req, data, con) {
  pesanbalik = [];
  let sesionkode = "01_tms_penggunaaplikasi";
  cekHash = await util.eksekusiQueryPromise(req, 'SELECT *,"'+sesionkode+'" as SESSIONKODE FROM 01_tms_penggunaaplikasi as A JOIN 01_akun_tahun as B ON A.KODEUNIKMEMBER = B.KODEUNIKMEMBER JOIN 01_set_outlet as C ON A.KODEUNIKMEMBER = C.KODEUNIKMEMBER where NAMAPENGGUNA = ? LIMIT 1', [data[0]], con);
  if (cekHash.length == 0) {
    sesionkode = "01_tms_member"
    cekHash = await util.eksekusiQueryPromise(req, 'SELECT "'+sesionkode+'" as SESSIONKODE, PASSWORD, A.KODEUNIKMEMBER, MEMBER_ID as PENGGUNA_ID, USERNAME as NAMAPENGGUNA, TOTALDEPOSIT , NAMA, JENIS as HAKAKSESID, "DWN" as STATUSMEMBER, NAMAFILE as URLFOTO, "1" as JSONMENU FROM 01_tms_member as A JOIN 01_akun_tahun as B ON A.KODEUNIKMEMBER = B.KODEUNIKMEMBER where USERNAME = ? AND STATUSAKTIF = 1 LIMIT 1', [data[0]], con);
    if (cekHash.length == 0) {
      data = {
        success: 'false',
        code: '404_LOGIN',
        msg: 'Pastikan informasi yang anda masukkan valid, tidak terblokir dan terdaftar pada sistem kami'
      }
    }else{
      passplain = await bcrypt.compare(data[1], (typeof cekHash[0].PASSWORD === 'undefined' ? "" : cekHash[0].PASSWORD ));
      if (passplain == true) {
        data = {
          success: 'true',
          rc: 'API0000',
          data: cekHash,
          decryptdata: cekHash[0].NAMA,
          levelmerchant: cekHash[0].STATUSMEMBER,
        };
      }else{
        data = {
          success: 'false',
          rc: 'API00002',
          msg: '[API00002] Pastikan informasi yang anda masukkan valid, tidak terblokir dan terdaftar pada sistem kami',
          levelmerchant: "ERR",
        };
      }
    }
  } else {
    passplain = await bcrypt.compare(data[1], (typeof cekHash[0].PASSWORDWEB === 'undefined' ? "" : cekHash[0].PASSWORDWEB ));
    if (passplain == true) {
      data = {
        success: 'true',
        rc: 'API0000',
        data: cekHash,
        decryptdata: [{
          usernameplain : cekHash[0].NAMA,
          emailplain : cekHash[0].EMAIL,
        }],
        levelmerchant: cekHash[0].STATUSMEMBER,
      };
    }else{
      data = {
        success: 'false',
        rc: 'API00001',
        msg: '[API00001] Pastikan informasi yang anda masukkan valid, tidak terblokir dan terdaftar pada sistem kami',
        levelmerchant: "ERR",
      };
    }
  }
  pesanbalik.push(data)
  return pesanbalik;
}

auth.registerapps = async function (req, data, con) {
  pesanbalik = [];
  let hashedPassword = await bcrypt.hash(data[2], 10)
  let hashedPIN = await bcrypt.hash(data[16], 10)
  let adadata = await util.eksekusiQueryPromise(req, `SELECT COALESCE(COUNT(*),0) as ADADATA FROM 01_tms_penggunaaplikasi where NAMAPENGGUNA = ? AND KODEUNIKMEMBER = ?`, [data[1], data[8]], con);
  if (adadata[0].ADADATA > 0) {
    data = {
      success: 'false',
      rc: 'API00001',
      msg: '[API00001] Informasi email atau username yang didaftarkan pada Sistem sudah terdaftar, silahkan daftarkan dengan akun lain'
    };
  } else {
    let queryproses = await util.eksekusiQueryPromise(req, 'INSERT INTO 01_tms_penggunaaplikasi(PENGGUNA_ID, NAMAPENGGUNA, PASSWORD, URLFOTO, HAKAKSESID, NAMA, ALAMAT, NOTELP, KODEUNIKMEMBER, STATUSMEMBER, KETERANGAN, SESSIONKODEUNIKMEMBER, PASSWORDWEB, TOTALDEPOSIT, JSONMENU, OUTLET, PIN, LATLONG,NOMOR,EMAIL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [data[0],data[1],hashedPassword,data[3],data[4],data[5],data[6],data[7],data[8],data[9],data[10],data[11],hashedPassword,data[13],data[14],data[15],hashedPIN,data[17],data[18],data[19]], con)
    if (typeof queryproses.sqlMessage === "undefined" || queryproses.affectedRows > 0) {
      data = {
        success: 'true',
        rc: 'S01',
        msg: 'Pendaftaran akun anda berhasil, mari bekerjasama memberikan pelayan terbaik untuk perusahaan ini. Semoga menjadi rekan yang saling menguntungkan'
      };
    } else {
      data = {
        success: 'false',
        rc: queryproses.code,
        msg: queryproses.sqlMessage
      };
    }
  }
  pesanbalik.push(data)
  return pesanbalik;
}
auth.forgetpasspin = async function (req, data, con) {
  pesanbalik = [];
  let randompassword = util.randomstring(10)
  let hashedPassword = await bcrypt.hash(randompassword, 10)
  let tabelubah, setkolomubah, cekmail, email;
  if (data[2] == "PASSWORD"){
    cekmail = await util.eksekusiQueryPromise(req, `SELECT * FROM 01_tms_member WHERE USERNAME = ? LIMIT 1`, [data[1]], con);
    if (cekmail.length == 0){
      cekmail = await util.eksekusiQueryPromise(req, `SELECT * FROM 01_tms_penggunaaplikasi WHERE NAMAPENGGUNA = ? LIMIT 1`, [data[1]], con);
      if (cekmail.length == 0){
        email = ""
      }else{
        tabelubah = "01_tms_penggunaaplikasi"
        setkolomubah = "PASSWORDWEB = ? WHERE NAMAPENGGUNA = ?"
        email = cekmail[0].EMAIL
      }
    }else{
      tabelubah = "01_tms_member"
      setkolomubah = "PASSWORD = ? WHERE USERNAME = ? "
      email = cekmail[0].EMAIL
    }
  }
  if (data[0] === email){
    let queryproses = await util.eksekusiQueryPromise(req, 'UPDATE '+tabelubah+' SET '+setkolomubah, [hashedPassword,data[1]], con)
    if (typeof queryproses.sqlMessage === "undefined" || queryproses.affectedRows > 0) {
      return randompassword
    } else {
      return ""
    }
  }else{
    return ""
  }
}
auth.outlet = async function (req, data, con) {
  pesanbalik = [];
  let dataquery = await util.eksekusiQueryPromise(req, 'SELECT * FROM 01_set_outlet WHERE (KODEOUTLET LIKE ? OR NAMAOUTLET LIKE ?) AND KODEUNIKMEMBER = ?', ['%' + data[0] + '%','%' + data[0] + '%', data[1]], con);
  if (typeof dataquery.affectedRows === "undefined" || dataquery.affectedRows > 0) {
      data = {
          success: "true",
          totaldataquery:dataquery.length,
          dataquery:dataquery,
          msg: "Informasi outlet terdaftar sudah tersajikan. Silahkan kelola outlet anda yang keren keren itu",
      }
  } else {
      data = {
          success: 'false',
          totaldataquery:0,
          msg: "Mohon maaf anda tidak memiliki cabang outlet untuk dikelola",
          dataquery:[],
      }
  }
  pesanbalik.push(data)
  return pesanbalik;
}
module.exports = auth;