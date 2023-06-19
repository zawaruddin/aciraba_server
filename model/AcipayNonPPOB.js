require('dotenv').config()
const util = require('../config/utils');
const returnmld = {}
returnmld.acipaytambahoperator = async function (req, data, con) {
    pesanbalik = [];
    if (data[6] == "true"){
        dataquery = await util.eksekusiQueryPromise(req, `UPDATE 01_acipay_operatornonppob SET APISERVER_ID = ?, OPERATOR_NAMA = ?, PREFIX = ?, IMGURL = ?, STATUS = ? WHERE OPERATOR_ID = ?`, [data[0], data[2],data[3], data[4], data[5], data[1]], con);
    }else{
        dataquery = await util.eksekusiQueryPromise(req, `INSERT INTO 01_acipay_operatornonppob(APISERVER_ID, OPERATOR_ID, OPERATOR_NAMA, PREFIX, IMGURL, STATUS) VALUES (?, ?, ?, ?, ?, ?)`, [data[0], data[1], data[2],data[3], data[4], data[5]], con);
    }
    if (typeof dataquery.affectedRows === "undefined" || dataquery.affectedRows > 0) {
        data = {
            success: "true",
            rc: "API00000",
            msg: data[6] == "true" ? 'Informasi OPERATOR Non PPOB berhasil diubah' :'Informasi OPERATOR Non PPOB berhasil ditranskasi. Silahkan tentukan kategori produk anda',
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
returnmld.acipayhapusoperator = async function (req, data, con) {
    pesanbalik = [];
    dataquery = await util.eksekusiQueryPromise(req, `DELETE FROM 01_acipay_operatornonppob WHERE OPERATOR_ID = ?`, [data[0]], con);
    if (typeof dataquery.affectedRows === "undefined" || dataquery.affectedRows > 0) {
        data = {
            success: "true",
            rc: "API00000",
            msg: 'Informasi OPERATOR Non PPOB berhasil dihapus. Produk yang berhubungan dengan OPERATOR ini tidak dapat ditransaksi oleh PELANGGAN',
        }
    } else {
        data = {
            success: 'false',
            rc: dataquery.code,
            msg: dataquery.sqlMessage
        }
    }
    pesanbalik.push(data)
    return pesanbalik;
}
returnmld.acipaytambahkategori = async function (req, data, con) {
    pesanbalik = [];
    if (data[10] == "true"){
        let ubhaoperator = ", OPERATOR_ID = '"+data[11]+"'";
        if (data[11] == ""){
            ubhaoperator = "";
        }
        dataquery = await util.eksekusiQueryPromise(req, 'UPDATE 01_acipay_kategorinonppob SET APISERVER_ID = ?, KATEGORI_NAMA = ?, TIPE = ?, IMGURL = ?, SLUG_URL = ?, STATUS = ?, PLACEHOLDER = ?, KETERANGAN = ? '+ubhaoperator+' WHERE KATEGORI_ID = ?', [data[0], data[3],data[4], data[5], data[6], data[7],data[8], data[9], data[2] ], con);
    }else{
        dataquery = await util.eksekusiQueryPromise(req, `INSERT INTO 01_acipay_kategorinonppob(APISERVER_ID, URUTAN, KATEGORI_ID, KATEGORI_NAMA, TIPE, IMGURL, SLUG_URL, STATUS, PLACEHOLDER, KETERANGAN,OPERATOR_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [data[0], data[1], data[2],data[3], data[4], data[5],data[6], data[7], data[8],data[9], data[11]], con);
    }
    if (typeof dataquery.affectedRows === "undefined" || dataquery.affectedRows > 0) {
        data = {
            success: "true",
            rc: "API00000",
            msg: 'Informasi kategori Non PPOB ditranskasi. Silahkan sinkronkan ke Server Tujuan jika ingin menggunakan PRODUK API',
        }
    } else {
        data = {
            success: 'false',
            rc: dataquery.affectedRows == 0 ? "00x000" : dataquery.code,
            msg: dataquery.affectedRows == 0 ? "Query berhasil di eksekusi, tetapi tidak terjadi perubahan apapun, cek kondisi seleksi data anda" : dataquery.sqlMessage,
        }
    }
    pesanbalik.push(data)
    return pesanbalik;
}
returnmld.acipayhapuskategori = async function (req, data, con) {
    pesanbalik = [];
    dataquery = await util.eksekusiQueryPromise(req, `DELETE FROM 01_acipay_kategorinonppob WHERE KATEGORI_ID = ?`, [data[0]], con);
    if (typeof dataquery.affectedRows === "undefined" || dataquery.affectedRows > 0) {
        data = {
            success: "true",
            rc: "API00000",
            msg: 'Informasi KATEGORI Non PPOB berhasil dihapus. Produk yang berhubungan dengan KATEGORI ini tidak dapat ditranskasi oleh PELANGGAN',
        }
    } else {
        data = {
            success: 'false',
            rc: dataquery.affectedRows == 0 ? "ERRKATSQLDEL" : dataquery.code,
            msg: dataquery.affectedRows == 0 ? "Proses QUERY HAPUS berhasil tapi tidak ada data yang berubah. Silahkan hubungi ADMINISTRATOR" : dataquery.code,
        }
    }
    pesanbalik.push(data)
    return pesanbalik;
}
returnmld.acipaydaftaroperatornonppob = async function (req, data, con) {
    pesanbalik = [];
    let dataquery = await util.eksekusiQueryPromise(req, 'SELECT * FROM 01_acipay_operatornonppob WHERE (OPERATOR_ID LIKE ? OR OPERATOR_NAMA LIKE ? OR PREFIX LIKE ?) ORDER BY OPERATOR_NAMA ASC', ['%' + data[0] + '%','%' + data[0] + '%', '%' + data[0] + '%'], con);
    if (dataquery.length > 0) {
        data = {
            success: "true",
            totaldata:dataquery.length,
            data:dataquery,
            msg: "Informasi OPERATOR acipay telah ditemukan",
        }
    } else {
        data = {
            success: 'false',
            totaldata:0,
            msg: "Maaf anda tidak memiliki OPERATOR khusus ACIPAY, silahkan tambahkan informasi kategori tersebut",
            data:[],
        }
    }
    pesanbalik.push(data)
    return pesanbalik;
}
returnmld.acipaydaftarkategorinonppob = async function (req, data, con) {
    pesanbalik = [];
    let dataquery = await util.eksekusiQueryPromise(req, 'SELECT * FROM 01_acipay_kategorinonppob WHERE (KATEGORI_NAMA LIKE ? OR KATEGORI_ID LIKE ? OR TIPE LIKE ?) ORDER BY KATEGORI_NAMA ASC', ['%' + data[0] + '%','%' + data[0] + '%', '%' + data[0] + '%'], con);
    if (dataquery.length > 0) {
        data = {
            success: "true",
            totaldata:dataquery.length,
            data:dataquery,
            msg: "Informasi kategori acipay telah ditemukan",
        }
    } else {
        data = {
            success: 'false',
            totaldata:0,
            msg: "Maaf anda tidak memiliki kategori khusus ACIPAY, silahkan tambahkan informasi kategori tersebut",
            data:[],
        }
    }
    pesanbalik.push(data)
    return pesanbalik;
}
returnmld.daftarproduknonppon = async function (req, data, con) {
    pesanbalik = [];
    let paramstok = (data[1] == "" ? " 1 = ?" : " STOK <= ?")
    let joineditproduk = "";
    if (data[8] == "IYA"){
        joineditproduk = " JOIN 01_acipay_operatornonppob as B ON A.PRODUK_OPERATOR_ID = B.OPERATOR_ID JOIN 01_acipay_kategorinonppob as C ON A.PRODUK_KATEGORI_ID = C.KATEGORI_ID";
    }
    let dataquery = await util.eksekusiQueryPromise(req, 'SELECT *, A.KETERANGAN as KETERANGANPRODUK, A.IMGURL as IMGURPRODUK, A.APISERVER_ID as APISERVER_IDPRODUK FROM 01_acipay_produknonppob as A'+joineditproduk+' WHERE (NAMA_PRODUK LIKE ? OR PRODUK_ID_SERVER LIKE ?) AND'+paramstok+' AND JENISPRODUK LIKE ? AND A.STATUS = ? AND PRODUK_OPERATOR_ID LIKE ? AND PRODUK_KATEGORI_ID LIKE ?  ORDER BY HARGA_UMUM ASC LIMIT ' + data[6] + "," + data[7], ['%' + data[0] + '%','%' + data[0] + '%',data[1] == "" ? '1' : '%'+data[1]+'%','%' + data[2] + '%',data[3],'%' + data[4] + '%','%' + data[5] + '%'], con);
    if (dataquery.length > 0) {
        data = {
            success: "true",
            totaldata:dataquery.length,
            data:dataquery,
        }
    } else {
        data = {
            success: 'false',
            totaldata:0,
            data:[],
        }
    }
    pesanbalik.push(data)
    return pesanbalik;
}
returnmld.tambahprodukacipay = async function (req, data, con) {
    pesanbalik = [];
    if (data[0] == "true"){
        dataquery = await util.eksekusiQueryPromise(req, `UPDATE 01_acipay_produknonppob SET PRODUK_ID = ?, PRODUK_ID_SERVER = ?, APISERVER_ID = ?, PRODUK_OPERATOR_ID = ?, PRODUK_KATEGORI_ID = ?, NAMA_PRODUK = ?, KETERANGAN = ?, HARGA_SERVER = ?, MARKUP = ?, HARGA_UMUM = ?, HARGA_AGEN = ?, HARGA_MEGAAGEN = ?, HARGA_LAINLAIN = ?, STATUS = ?, POIN = ?, IMGURL = ?, JAM_MULAI = ?, JAM_TUTUP = ?, MULTI = ?, STOK = ?, URUTAN = ?, JENISPRODUK = ?, TAMPIL = ? WHERE PRODUK_ID_SERVER = ?`, [data[1], data[2],data[3], data[4], data[5], data[6], data[7],data[8], data[9], data[10], data[11], data[12],data[13], data[14], data[15], data[16], data[17],data[18], data[19], data[20],data[21], data[22], data[23], data[2]], con);
    }else{
        dataquery = await util.eksekusiQueryPromise(req, `INSERT INTO 01_acipay_produknonppob(PRODUK_ID, PRODUK_ID_SERVER, APISERVER_ID, PRODUK_OPERATOR_ID, PRODUK_KATEGORI_ID, NAMA_PRODUK, KETERANGAN, HARGA_SERVER, MARKUP, HARGA_UMUM, HARGA_AGEN, HARGA_MEGAAGEN, HARGA_LAINLAIN, STATUS, POIN, IMGURL, JAM_MULAI, JAM_TUTUP, MULTI, STOK, URUTAN, JENISPRODUK, TAMPIL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [data[1], data[2],data[3], data[4], data[5], data[6], data[7],data[8], data[9], data[10], data[11], data[12],data[13], data[14], data[15], data[16], data[17],data[18], data[19], data[20],data[21], data[22], data[23]], con);
    }
    if (typeof dataquery.affectedRows === "undefined" || dataquery.affectedRows > 0) {
        data = {
            success: "true",
            rc: "API00000",
            msg: data[0] == "true" ? 'Informasi PRODUK ACIPAY berhasil diubah' :'Informasi PRODUK ACIPAY berhasil ditranskasi. Silahkan informasikan ke pelanggan anda',
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
returnmld.transaksikedealer = async function (req, data, con) {
    pesanbalik = [];
    let produk = [];
    let dataquery="";
    let totaldatakategori = 0;
    if (data[0] == "KATEGORI"){
        dataquery = await util.eksekusiQueryPromise(req, 'SELECT B.IMGURL, B.KATEGORI_ID,B.KATEGORI_NAMA,B.KETERANGAN, A.OPERATOR_NAMA, A.OPERATOR_ID FROM 01_acipay_operatornonppob as A JOIN 01_acipay_kategorinonppob as B ON A.OPERATOR_ID = B.OPERATOR_ID WHERE A.PREFIX LIKE ?', ['%' + data[1] + '%'], con);
        for (let i = 0; i < dataquery.length; i++) {
            let dataproduk = await util.eksekusiQueryPromise(req, 'SELECT * FROM 01_acipay_operatornonppob as A JOIN 01_acipay_kategorinonppob as B ON A.OPERATOR_ID = B.OPERATOR_ID JOIN 01_acipay_produknonppob as C ON C.PRODUK_KATEGORI_ID = B.KATEGORI_ID WHERE C.PRODUK_KATEGORI_ID = ? ORDER BY HARGA_SERVER ASC', [dataquery[i].KATEGORI_ID], con);
            if (dataproduk.length > 0) {
                totaldatakategori = totaldatakategori + 1;
				let a = {
					idkategori: dataquery[i].KATEGORI_ID,
					namakategori: dataquery[i].KATEGORI_NAMA,
					urlkategori: dataquery[i].IMGURL,
                    namaoperator: dataquery[i].OPERATOR_NAMA,
                    totalprodukoperator: dataproduk.length,
					produkoperator: dataproduk
				}
				produk.push(a)
			}
        }
    }else if (data[0] == "PRODUK"){
        dataquery = await util.eksekusiQueryPromise(req, 'SELECT * FROM 01_acipay_produknonppob WHERE (NAMA_PRODUK LIKE ? OR PRODUK_ID_SERVER LIKE ?) AND PRODUK_KATEGORI_ID = ? ORDER BY HARGA_SERVER ASC', ['%' + data[3] + '%','%' + data[3] + '%', data[2]], con);
    }
    if (dataquery.length > 0) {
        if (data[0] == "KATEGORI"){
            data = {
                success: "true",
                totaldata:totaldatakategori,
                data:produk,
            }
        }else if (data[0] == "PRODUK"){
            data = {
                success: "true",
                totaldata:dataquery.length,
                data:dataquery,
            }
        }
    } else {
        data = {
            success: 'false',
            totaldata:0,
            data:[],
        }
    }
    pesanbalik.push(data)
    return pesanbalik;
}
module.exports = returnmld;