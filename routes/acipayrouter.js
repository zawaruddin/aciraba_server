const express = require("express")
const authorize = require('../middleware/authorize')
const router = express.Router()
const acipay = require("../controller/acipayController")

/*inq databaseku*/
router.post("/cekvalidasitujuan",acipay.cekvalidasitujuan)
router.post("/cektagihan",acipay.cektagihan)

router.post("/acipaytambahoperator",acipay.acipaytambahoperator)
router.post("/acipaytambahkategori",acipay.acipaytambahkategori)
router.post("/acipayhapusoperator",acipay.acipayhapusoperator)
router.post("/acipayhapuskategori",acipay.acipayhapuskategori)
router.post("/acipaydaftaroperatornonppob",acipay.acipaydaftaroperatornonppob)
router.post("/acipaydaftarkategorinonppob",acipay.acipaydaftarkategorinonppob)

/* produk non dan ppob */
router.post("/daftarproduknonppon",acipay.daftarproduknonppon)
router.post("/tambahprodukacipay",acipay.tambahprodukacipay)
router.post("/daftarmemberacipay",acipay.daftarmemberacipay)

/* transaksi acipay*/
router.post("/transaksikedealer",acipay.transaksikedealer)
router.post("/dafartranskasi",acipay.dafartranskasi)
router.post("/hapustransaksi",acipay.hapustransaksi)
module.exports = router
