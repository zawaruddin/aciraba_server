const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const util = require('../config/utils');
const { connect } = require('http2');
require('dotenv').config()
const auth = {}
var pesanbalik = {}

auth.pendaftaranmember = async function (req, data, con) {
  pesanbalik = [];
  const tokenjwt = jwt.sign({ username: data[2], kodeunikmember: data[4] }, process.env.ACCESS_TOKEN_RHS, { expiresIn: '1y'  });
  let hashedPassword = await bcrypt.hash(data[3], 10)
  let adadata = await util.eksekusiQueryPromise(req, `SELECT COUNT(*) as ADADATA FROM 01_tms_penggunaaplikasi WHERE KODEUNIKMEMBER = ?`, [data[4]], con);
  if (adadata[0].ADADATA > 0) {
    data = {
      success: 'false',
      rc: '200_DUPLICATE_OUTLET',
      msg: 'Sistem kami mendeteksi bahwa terdapat duplikasi. Silahkan generate ulang TENANT ID OUTLET anda'
    };
  } else {
    /*data default yang harus ada pada aplikasi ACIRABA agar JOIN data bekerja*/
    await util.eksekusiQueryPromise(req,"SET autocommit = 0", [], con);
    await util.eksekusiQueryPromise(req,"START TRANSACTION", [], con);
    await util.eksekusiQueryPromise(req,"INSERT INTO `01_tms_barangkharisma`(`AI`, `BARANG_ID`, `QRCODE_ID`, `NAMABARANG`, `BERAT_BARANG`, `PARETO_ID`, `SUPPLER_ID`, `KATEGORI_ID`, `BRAND_ID`, `KETERANGANBARANG`, `HARGABELI`, `HARGAJUAL`, `SATUAN`, `AKTIF`, `KODEUNIKMEMBER`, `APAKAHGROSIR`, `STOKDAPATMINUS`, `JENISBARANG`, `PEMILIK`, `APAKAHBONUS`, `FILECITRA`) VALUES (0, 'ACI100000100000001', 'ACI100000100000001', 'TIKET PEMESANAN', 0.00, '0', 'UNKWNSUP', 'UNKWNKAT', '0', '<p>Tidak ada informasi mengenai barang ini</p>', 0.00, 0.00, 'PCS', 1, '"+data[4]+"', 'TIDAK AKTIF', 'TIDAK DAPAT MINUS', 'JASA', '0', 'TIDAK AKTIF', 'not_found')", [], con);
    await util.eksekusiQueryPromise(req,"INSERT INTO `01_tms_member_grup`(`AI`, `KODEGRUP`, `JENIS`, `GRUP`, `KODEUNIKMEMBER`) VALUES (0, 'UMUM', 'UMUM', 'UMUM', '"+data[4]+"')", [], con);
    await util.eksekusiQueryPromise(req,"INSERT INTO `01_tms_principal`(`AI`, `PRINCIPAL_ID`, `NAMA_PRINCIPAL`, `KODEUNIKMEMBER`) VALUES (0, '0', 'PRINCIPAL TIDAK DIKETAHUI','"+data[4]+"')", [], con);
    await util.eksekusiQueryPromise(req,"INSERT INTO `01_tms_supplier`(`SUPPLIER_AI`, `KODESUPPLIER`, `NAMASUPPLIER`, `NEGARA`, `PROVINSI`, `KOTAKAB`, `KECAMATAN`, `ALAMAT`, `NOTELP`, `NAMABANK`, `NOREK`, `ATASNAMA`, `EMAIL`, `KODEUNIKMEMBER`) VALUES (0, 'UNKWNSUP', 'Suplier Tidak Terdeteksi', '', '-', '-', '', '-', '-', '', '-', '-', '-', '"+data[4]+"')", [], con);
    await util.eksekusiQueryPromise(req,"INSERT INTO `01_tms_kategori`(`AI`, `KATEGORIPARENT_ID`, `NAMAKATEGORI`, `LOGOKATEGORI`, `KODEUNIKMEMBER`, `BEBANGAJI`, `BEBANPACKING`, `BEBANPROMO`, `BEBANTRANSPORT`) VALUES (0, 'UNKWNKAT', 'TIDAK ADA KATEGORI', 'https://www.pngmart.com/files/17/Task-PNG-Photos.png', '"+data[4]+"', 0.00, 0.00, 0.00, 0.00)", [], con);
    await util.eksekusiQueryPromise(req,"INSERT INTO `01_tms_barangsatuan`(`AI`, `NAMASATUAN`, `KETERANGAN`, `KODEUNIKMEMBER`) VALUES (0, 'PCS', 'Pieces','"+data[4]+"')", [], con);
    await util.eksekusiQueryPromise(req,"INSERT INTO `01_tms_perusahaan`(`AI`, `KODEPERUSAHAAN`, `NAMAPERUSAHAAN`, `NAMAPEMILIK`, `NPWP`, `ALAMAT`, `NOTELEPON`, `KODEUNIKMEMBER`, `DBAKUNTANSI`) VALUES (0, '0', 'Perusahan Belum Diset', 'Perusahan Belum Diset', '-', '-', '-', '"+data[4]+"', '')", [], con);
    await util.eksekusiQueryPromise(req,"INSERT INTO `01_tms_brand`(`AI`, `BRAND_ID`, `NAMA_BRAND`, `KODEUNIKMEMBER`) VALUES (0, '0', 'BRAND TIDAK DIKETAHUI', '"+data[4]+"')", [], con);
    let queryproses = await util.eksekusiQueryPromise(req, 'INSERT INTO `01_tms_penggunaaplikasi`(`PENGGUNA_ID`, `NAMA`, `NAMAOUTLET`, `NAMAPENGGUNA`, `PASSWORD`, `KODEUNIKMEMBER`, `URLFOTO`, `HAKAKSESID`, `ALAMAT`, `NOTELP`, `NOREKENING`, `KETERANGAN`, `TOTALDEPOSIT`, `IDHAKAKSES`, `PIN`, `LATLONG`, `EMAIL`, `TOKENKEY`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', ['0',data[1],data[0],data[2],hashedPassword,data[4],'','OWNER','','','','','0','','','','',tokenjwt], con)
    await util.eksekusiQueryPromise(req,"COMMIT", [], con);
    if (queryproses.affectedRows > 0) {
      data = {
        success: 'true',
        rc: '200',
        msg: 'Pendaftaran akun anda berhasil, SILAHKAN MASUK menggunakan NAMAPENGGUNA dan KATASANDI yang sudah anda buat.Mari bekerjasama memberikan pelayan terbaik untuk perusahaan ini. Semoga menjadi rekan yang saling menguntungkan'
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
auth.registerapps = async function (req, data, con) {
  pesanbalik = [];
  let hashedPIN = await bcrypt.hash(data[14], 10)
  let hashedPassword = await bcrypt.hash(data[4], 10)
  let tokenjwt = jwt.sign({ username: data[3], kodeunikmember: data[5] }, process.env.ACCESS_TOKEN_RHS, { expiresIn: '1y'  });
  let adadata = await util.eksekusiQueryPromise(req, `SELECT COALESCE(COUNT(*),0) as ADADATA FROM 01_tms_penggunaaplikasi where NAMAPENGGUNA = ? AND KODEUNIKMEMBER = ?`, [data[3], data[5]], con);
  if (adadata[0].ADADATA > 0) {
    data = {
      success: 'false',
      rc: '200_DUPLICATE_OUTLET',
      msg: 'Informasi email atau username yang didaftarkan pada Sistem sudah terdaftar, silahkan daftarkan dengan akun lain'
    };
  } else {
    let queryproses = await util.eksekusiQueryPromise(req, 'INSERT INTO `01_tms_penggunaaplikasi`(`AI_PENGGUNA`,`PENGGUNA_ID`, `NAMA`, `NAMAOUTLET`, `NAMAPENGGUNA`, `PASSWORD`, `KODEUNIKMEMBER`, `URLFOTO`, `HAKAKSESID`, `ALAMAT`, `NOTELP`, `NOREKENING`, `KETERANGAN`, `TOTALDEPOSIT`, `IDHAKAKSES`, `PIN`, `LATLONG`, `EMAIL`, `TOKENKEY`, `STATUSAKTIF`, `NOMOR`) VALUES (0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [data[0],data[1],data[2],data[3],hashedPassword,data[5],data[6],data[7],data[8],data[9],data[10],data[11],data[12],data[13],hashedPIN,data[15],data[16],tokenjwt,data[18],data[19]], con)
    if (queryproses.affectedRows > 0) {
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
auth.loginapps = async function (req, data, con) {
  pesanbalik = [];
  cekHash = await util.eksekusiQueryPromise(req, 'SELECT A.KODEUNIKMEMBER,A.PENGGUNA_ID,A.NAMAPENGGUNA,A.TOTALDEPOSIT,A.NAMA,A.HAKAKSESID,A.URLFOTO,B.JSONMENU,C.PAJAKNEGARA,C.PAJAKTOKO ,A.PASSWORD, COALESCE(SUM(C.AI),0) as PUNYAOUTLET,KODEOUTLET FROM 01_tms_penggunaaplikasi as A JOIN 01_tms_penggunaaplikasiha as B ON A.IDHAKAKSES = B.AI LEFT JOIN 01_set_outlet as C ON A.KODEUNIKMEMBER = C.KODEUNIKMEMBER WHERE NAMAPENGGUNA = ? LIMIT 1', [data[0]], con);
  if (cekHash[0].PASSWORD == null) {
    data = {
      success: 'false',
      rc: '404_LOGIN',
      msg: 'Pastikan informasi yang anda masukkan valid, tidak terblokir dan terdaftar pada sistem kami',
    };
  }else{
    passplain = await bcrypt.compare(data[1], (typeof cekHash[0].PASSWORD === "undefined" ? "" : cekHash[0].PASSWORD));
    if (passplain == true) {
      data = {
        success: 'true',
        rc: '200',
        data: [{
          KODEUNIKMEMBER: cekHash[0].KODEUNIKMEMBER,
          PENGGUNA_ID: cekHash[0].PENGGUNA_ID,
          NAMAPENGGUNA: cekHash[0].NAMAPENGGUNA,
          TOTALDEPOSIT: cekHash[0].TOTALDEPOSIT,
          NAMA: cekHash[0].NAMA,
          HAKAKSESID: cekHash[0].HAKAKSESID,
          URLFOTO: cekHash[0].URLFOTO,
          JSONMENU: cekHash[0].JSONMENU,
          PAJAKNEGARA: cekHash[0].PAJAKNEGARA,
          PAJAKTOKO: cekHash[0].PAJAKTOKO,
          SESSIONKODE: cekHash[0].SESSIONKODE,
          PUNYAOUTLET: cekHash[0].PUNYAOUTLET,
          OUTLET: cekHash[0].KODEOUTLET,
        }],
      };
    }else{
      data = {
        success: 'false',
        rc: '404_LOGIN',
        msg: 'Pastikan informasi yang anda masukkan valid, tidak terblokir dan terdaftar pada sistem kami',
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
  if (dataquery.length > 0) {
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
auth.hapusoutlet = async function (req, data, con) {
  pesanbalik = [];
  let dataquery = await util.eksekusiQueryPromise(req, 'DELETE FROM 01_set_outlet WHERE KODEOUTLET = ? AND KODEUNIKMEMBER = ?', [data[0], data[1]], con);
  if (dataquery.affectedRows > 0) {
      data = {
          success: "true",
          rc: "200",
          msg: "Outlet berhasil dihapus. Tapi ingat informasi seperti TRANSAKSI, MASTER ITEM, JURNAL masih tetap ada didalam DATABASE",
      }
  } else {
      data = {
          success: 'false',
          rc: dataquery.code,
          msg: dataquery.sqlMessage,
      }
  }
  pesanbalik.push(data)
  return pesanbalik;
}
auth.detailinformasioutlet = async function (req, data, con) {
  pesanbalik = [];
  let dataquery = await util.eksekusiQueryPromise(req, 'SELECT * FROM 01_set_outlet WHERE KODEOUTLET = ? AND KODEUNIKMEMBER = ?', [data[0], data[1]], con);
  if (dataquery.length > 0) {
      data = {
          success: "true",
          rc: "200",
          data:dataquery,
      }
  } else {
      data = {
          success: 'false',
          rc: dataquery.code,
          msg: dataquery.sqlMessage,
      }
  }
  pesanbalik.push(data)
  return pesanbalik;
}
auth.daftarpegawai = async function (req, data, con) {
  pesanbalik = [];
  let dataquery = await util.eksekusiQueryPromise(req, 'SELECT * FROM 01_tms_penggunaaplikasi WHERE KODEUNIKMEMBER = ?', [data[0]], con);
  if (dataquery.length > 0) {
      data = {
          success: "true",
          rc: "200",
          data:dataquery,
          jumlahdata:dataquery.length,
      }
  } else {
      data = {
          success: 'false',
          rc: dataquery.code,
          msg: dataquery.sqlMessage,
      }
  }
  pesanbalik.push(data)
  return pesanbalik;
}
auth.statuspegawai = async function (req, data, con) {
  pesanbalik = [];
  let dataquery = await util.eksekusiQueryPromise(req, 'UPDATE `01_tms_penggunaaplikasi` SET `STATUSAKTIF` = ? WHERE `PENGGUNA_ID` = ? AND KODEUNIKMEMBER = ?', [data[3],data[0],data[4]], con);
  if (dataquery.affectedRows > 0) {
      data = {
          success: "true",
          rc: "200",
          msg: "Yeah.. informasi status pegawai berubah menjadi "+(data[3] == "1" ? "AKTIF" : "TIDAK AKTIF")+"."
      }
  } else {
      data = {
          success: 'false',
          rc: dataquery.code,
          msg: dataquery.sqlMessage,
      }
  }
  pesanbalik.push(data)
  return pesanbalik;
}
auth.simpanhakakses = async function (req, data, con) {
  pesanbalik = [];
  let dataquery;
  if (data[3] == 'true'){
    dataquery = await util.eksekusiQueryPromise(req, "UPDATE 01_tms_penggunaaplikasiha SET NAMAHAKAKSES = ?, JSONMENU = ? WHERE AI = ? AND KODEUNIKMEMBER = ?", [data[1],data[2],data[4],data[0]], con);
  }else{
    dataquery = await util.eksekusiQueryPromise(req, "INSERT INTO `01_tms_penggunaaplikasiha`(`AI`, `KODEUNIKMEMBER`, `NAMAHAKAKSES`, `JSONMENU`) VALUES (0, ?, ?, ?)", [data[0],data[1],data[2]], con);
  }
  if (dataquery.affectedRows > 0) {
      data = {
          success: "true",
          rc: "200",
          msg: "Hak akses berhasil ditambahkan dengan NAMA : "+data[1]+" pada TENNAT ID : "+data[0]
      }
  } else {
      data = {
          success: 'false',
          rc: dataquery.code,
          msg: dataquery.sqlMessage,
      }
  }
  pesanbalik.push(data)
  return pesanbalik;
}
auth.daftarhakakses = async function (req, data, con) {
  pesanbalik = [];
  let dataquery = await util.eksekusiQueryPromise(req, "SELECT * FROM 01_tms_penggunaaplikasiha WHERE KODEUNIKMEMBER = ? AND NAMAHAKAKSES LIKE ? AND AI > 1", [data[0],'%'+data[1]+'%'], con);
  if (dataquery.length > 0) {
    data = {
        success: "true",
        rc: "200",
        msg: "Data ditemukan.",
        data:dataquery,
        totaldata:dataquery.length,
    }
  } else {
      data = {
          success: 'false',
          rc: dataquery.code,
          msg: dataquery.sqlMessage,
          data:null,
          totaldata:0,
      }
  }
  pesanbalik.push(data)
  return pesanbalik;
}
auth.ubahpasswordproses = async function (req, data, con) {
  pesanbalik = [];
  let dataquery = await util.eksekusiQueryPromise(req, 'SELECT PASSWORD FROM 01_tms_penggunaaplikasi WHERE PENGGUNA_ID = ? AND KODEUNIKMEMBER = ?', [data[4],data[3]], con);
  if (dataquery.length > 0) {
    passplain = await bcrypt.compare(data[1], (typeof dataquery[0].PASSWORD === "undefined" ? "" : dataquery[0].PASSWORD));
    if (passplain == true) {
      let hashedPassword = await bcrypt.hash(data[2], 10)
      dataquery = await util.eksekusiQueryPromise(req, 'UPDATE `01_tms_penggunaaplikasi` SET `PASSWORD` = ? WHERE `PENGGUNA_ID` = ? AND KODEUNIKMEMBER = ?', [hashedPassword,data[0],data[3]], con);
      if (dataquery.affectedRows > 0) {
        data = {
            success: "true",
            rc: "200",
            msg: "Katasandi sudah diubah. Silahkan pengguna yang bersangkutan agar diarahkan untuk RE-LOG."
        }
      }else{
        data = {
          success: 'false',
          rc: dataquery.code,
          msg: dataquery.sqlMessage,
        }
      }
    }else{
      data = {
        success: 'false',
        rc: 404,
        msg: "Katasandi yang kamu masukan tidak cocok. Silahkan ulangi lagi jika ingin melanjutkan",
      }
    }
  }else{
    data = {
      success: 'false',
      rc: dataquery.code,
      msg: dataquery.sqlMessage,
    }
  }
  pesanbalik.push(data)
  return pesanbalik;
}
module.exports = auth;