require('dotenv').config()
const encodehtml = require("html-entities")
const { isEmpty } = require('lodash')
const acipaycallback = {}
const digiflazzController = require("../controller/digiflazzController")
const acipaymdl = require("../model/Acipay")
const penjualanmdl = require("../model/PenjualanData")

acipaycallback.cekvalidasitujuan = async function(req,res){
  digiflazzController.inquiry(req, res).then(function(val) {
    let hasiljson = val;
    res.json({
      hasiljson: hasiljson,
    });
  });
}
acipaycallback.cektagihan = async function(req,res){
  if (req.body.IDSERVER == "1"){
    digiflazzController.inquiry(req, res).then(function(val) {
      let hasiljson = val;
      res.json({
        hasiljson: hasiljson,
      });
    });
  }
}

acipaycallback.acipaytambahoperator = async function(req,res){
    data = [];
    data.push(req.body.APISERVER_ID)
    data.push(req.body.OPERATOR_ID)
    data.push(req.body.OPERATOR_NAMA)
    data.push(req.body.PREFIX)
    data.push(req.body.IMGURL)
    data.push(req.body.STATUS)
    data.push(req.body.ISEDIT)
    hasiljson = await acipaymdl.acipaytambahoperator(req,data,req.con)
    res.json({
      hasiljson: hasiljson,
    });
}
acipaycallback.acipaytambahkategori = async function(req,res){
  data = [];
  data.push(req.body.APISERVER_ID)
  data.push(req.body.URUTAN)
  data.push(req.body.KATEGORI_ID)
  data.push(req.body.KATEGORI_NAMA)
  data.push(req.body.TIPE)
  data.push(req.body.IMGURL)
  data.push(req.body.SLUG_URL)
  data.push(req.body.STATUS)
  data.push(req.body.PLACEHOLDER)
  data.push(encodehtml.encode(req.body.KETERANGAN))
  data.push(req.body.ISEDIT)
  data.push(req.body.IDOPERATOR)
  hasiljson = await acipaymdl.acipaytambahkategori(req,data,req.con)
  res.json({
    hasiljson: hasiljson,
  });
}
acipaycallback.acipayhapusoperator = async function(req,res){
  data = [];
  data.push(req.body.OPERATOR_ID)
  hasiljson = await acipaymdl.acipayhapusoperator(req,data,req.con)
  res.json({
    hasiljson: hasiljson,
  });
}
acipaycallback.acipayhapuskategori = async function(req,res){
  data = [];
  data.push(req.body.KATEGORI_ID)
  hasiljson = await acipaymdl.acipayhapuskategori(req,data,req.con)
  res.json({
    hasiljson: hasiljson,
  });
}
acipaycallback.acipaydaftaroperatornonppob = async function(req,res){
  data = [];
  data.push(req.body.KATAKUNCI)
  hasiljson = await acipaymdl.acipaydaftaroperatornonppob(req,data,req.con)
  res.json({
    hasiljson: hasiljson,
  });
}
acipaycallback.acipaydaftarkategorinonppob = async function(req,res){
    data = [];
    data.push(req.body.KATAKUNCI)
    hasiljson = await acipaymdl.acipaydaftarkategorinonppob(req,data,req.con)
    res.json({hasiljson: hasiljson,});
}
/* produk non ppob */
acipaycallback.daftarproduknonppon = async function(req,res){
  data = [];
  data.push(req.body.KATAKUNCI)
  data.push(req.body.STOK)
  data.push(req.body.JENIS)
  data.push(req.body.STATUS)
  data.push(req.body.KUNCIKATEGORI)
  data.push(req.body.KUNCIOPERATOR)
  data.push(req.body.DATAKE)
  data.push(req.body.LIMIT)
  data.push(isEmpty(req.body.JOINKAH) == false ? req.body.JOINKAH : "TIDAK" )
  hasiljson = await acipaymdl.daftarproduknonppon(req,data,req.con)
  res.json({
    hasiljson: hasiljson,
  });
}
acipaycallback.tambahprodukacipay = async function(req,res){
  data = [];
  data.push(req.body.ISEDIT)
  data.push(req.body.PRODUK_ID)
  data.push(req.body.PRODUK_ID_SERVER)
  data.push(req.body.APISERVER_ID)
  data.push(req.body.PRODUK_OPERATOR_ID)
  data.push(req.body.PRODUK_KATEGORI_ID)
  data.push(req.body.NAMA_PRODUK)
  data.push(req.body.KETERANGAN)
  data.push(req.body.HARGA_SERVER)
  data.push(req.body.MARKUP)
  data.push(req.body.HARGA_UMUM)
  data.push(req.body.HARGA_AGEN)
  data.push(req.body.HARGA_MEGAAGEN)
  data.push(req.body.HARGA_LAINLAIN)
  data.push(req.body.STATUS)
  data.push(req.body.POIN)
  data.push(req.body.IMGURL)
  data.push(req.body.JAM_MULAI)
  data.push(req.body.JAM_TUTUP)
  data.push(req.body.MULTI)
  data.push(req.body.STOK)
  data.push(req.body.URUTAN)
  data.push(req.body.JENISPRODUK)
  data.push(req.body.TAMPIL)
  hasiljson = await acipaymdl.tambahprodukacipay(req,data,req.con)
  res.json({
    hasiljson: hasiljson,
  });
}
acipaycallback.daftarmemberacipay = async function(req,res){
  data = [];
  data.push(req.body.KATAKUNCI)
  data.push(req.body.STOK)
  data.push(req.body.JENIS)
  data.push(req.body.STATUS)
  data.push(req.body.KUNCIKATEGORI)
  data.push(req.body.KUNCIOPERATOR)
  data.push(req.body.DATAKE)
  data.push(req.body.LIMIT)
  data.push(isEmpty(req.body.JOINKAH) == false ? req.body.JOINKAH : "TIDAK" )
  hasiljson = await acipaymdl.daftarmemberacipay(req,data,req.con)
  res.json({
    hasiljson: hasiljson,
  });
}
acipaycallback.transaksikedealers = async function(req,res){
  data = [];
  data.push(req.body.KONDISI)
  data.push(req.body.PREFIX.substring(0, 4))
  data.push(isEmpty(req.body.IDPRODUK) == "true" ? "" : req.body.IDPRODUK)
  data.push(isEmpty(req.body.PENCARIANPRODUK) == "true" ? "" : req.body.PENCARIANPRODUK)
  hasiljson = await acipaymdl.transaksikedealer(req,data,req.con)
  res.json({
    hasiljson: hasiljson,
  });
}
acipaycallback.transaksikedealer = async function(req,res){
  data = [];
  data.push(req.body.KONDISI)
  data.push(req.body.PREFIX.substring(0, 4))
  data.push(isEmpty(req.body.IDPRODUK) == "true" ? "" : req.body.IDPRODUK)
  data.push(isEmpty(req.body.PENCARIANPRODUK) == "true" ? "" : req.body.PENCARIANPRODUK)
  hasiljson = await acipaymdl.transaksikedealer(req,data,req.con)
  res.json({
    hasiljson: hasiljson,
  });
}
acipaycallback.dafartranskasi = async function(req,res){
  data = [];
  data.push(req.body.KONDISIMODEL)
  data.push(req.body.KODEUNIKMEMNER)
  data.push(req.body.AGEN)
  data.push(req.body.LOKASI)
  data.push(req.body.KATAKUNCIPENCARIAN)
  data.push(req.body.PARAMETERPENCARIAN)
  data.push(req.body.STATUSTRANSKASI)
  data.push(req.body.DATAKE)
  data.push(req.body.LIMIT)
  data.push(req.body.STATUSMEMBER)
  data.push(req.body.TANGGALAWAL.split("-").reverse().join("-"))
  data.push(req.body.TANGGALAKHIR.split("-").reverse().join("-"))
  data.push(req.body.STATUSDATA)
  hasiljson = await penjualanmdl.dafartranskasi(req,data,req.con)
  res.json({
    hasiljson: hasiljson,
  });
}
acipaycallback.hapustransaksi = async function(req,res){
  data = [];
  data.push(req.body.TRANSAKSIID)
  data.push(req.body.OUTLET)
  data.push(req.body.KODENIKMEMBER)
  data.push(req.body.NAMAPRODUK)
  hasiljson = await penjualanmdl.hapustransaksi(req,data,req.con)

  res.json({
    hasiljson: hasiljson,
  });
}
module.exports = acipaycallback