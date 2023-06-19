const express = require("express")
const authorize = require('../middleware/authorize')
const router = express.Router()
const pembelianController = require("../controller/pembelianController")
/*transaksi kasir*/
router.post("/modaldaftarsuplier",pembelianController.modaldaftarsuplier)
router.post("/pilihbarangpembelian",pembelianController.pilihbarangpembelian)
router.post("/simpanpembelian",pembelianController.simpanpembelian)
router.post("/daftarpembeliantabel",pembelianController.daftarpembeliantabel)
router.post("/hapuspembelian",pembelianController.hapuspembelian)
router.post("/detailpembelian",pembelianController.detailpembelian)
router.post("/hishargabeli",pembelianController.hishargabeli)
router.post("/filtermaubayarhutang",pembelianController.filtermaubayarhutang)
router.post("/daftarhutangterpilih",pembelianController.daftarhutangterpilih)
router.post("/transaksihutang",pembelianController.transaksihutang)
router.post("/ajaxdaftarhutang",pembelianController.ajaxdaftarhutang)
router.post("/ajaxdaftarpembayaranhutang",pembelianController.ajaxdaftarpembayaranhutang)
router.post("/hapustransaksibhutang",pembelianController.hapustransaksibhutang)
router.post("/detailpembayaranhutang",pembelianController.detailpembayaranhutang)
router.post("/hapustransaksihutang",pembelianController.hapustransaksihutang)
router.post("/ubahhargajualsetelahbeli",pembelianController.ubahhargajualsetelahbeli)
router.post("/ubahhargajualafb",pembelianController.ubahhargajualafb)
router.post("/jsontrxbeli",pembelianController.jsontrxbeli)
router.post("/cekpotonghutang",pembelianController.cekpotonghutang)
router.post("/tambahreturpembelian",pembelianController.tambahreturpembelian)
router.post("/jsondaftarreturpembelian",pembelianController.jsondaftarreturpembelian)
router.post("/hapusreturpembelian",pembelianController.hapusreturpembelian)

module.exports = router