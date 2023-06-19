const express = require("express")
const authorize = require('../middleware/authorize')
const router = express.Router()
const masterdataController = require("../controller/masterdataController")
/* dashboard */
router.post("/informasirow1dashboard",masterdataController.informasirow1dashboard)
router.post("/informasirow2dashboard",masterdataController.informasirow2dashboard)
/* master item */
router.post("/daftarbarang",masterdataController.daftarbarang)
router.post("/daftarbarangdetail",masterdataController.daftarbarangdetail)
router.post("/rebuildstok",masterdataController.rebuildstok)
router.post("/manajemencitraitem",masterdataController.manajemencitraitem)
router.post("/daftarsuplierselect",masterdataController.daftarsuplierselect)
router.post("/daftakategoriselect",masterdataController.daftakategoriselect)
router.post("/daftakategoriselectkasir",masterdataController.daftakategoriselectkasir)
router.post("/daftarsatuanselect",masterdataController.daftarsatuanselect)
router.post("/daftarperusahaan",masterdataController.daftarperusahaan)
router.post("/daftarprincipal",masterdataController.daftarprincipal)
router.post("/jenispembayarantransaksi",masterdataController.jenispembayarantransaksi)
router.post("/daftarbrand",masterdataController.daftarbrand)
router.post("/daftarvoucherbarang",masterdataController.daftarvoucherbarang)
router.post("/tambahbarangitem",masterdataController.tambahbarangitem)
router.post("/tambahbarangvoucher",masterdataController.tambahbarangvoucher)
router.post("/pecahsatuan",masterdataController.pecahsatuan)
router.post("/tambahitemajaxbulk",masterdataController.tambahitemajaxbulk)
/* kartustok route area */
router.post("/kartustok",masterdataController.kartustok)
/* diskon penjualan */
router.post("/diskonpenjualan",masterdataController.diskonpenjualan)
router.post("/tambahdiskonpenjualan",masterdataController.tambahdiskonpenjualan)
router.post("/hapusdiskonpenjualan",masterdataController.hapusdiskonpenjualan)
/* kupon belanja */
router.post("/kuponbelanja",masterdataController.kuponbelanja)
router.post("/tambahkuponbelanja",masterdataController.tambahkuponbelanja)
router.post("/hapuskuponbelanja",masterdataController.hapuskuponbelanja)
/* master member */
router.post("/mastermember",masterdataController.mastermember)
router.post("/statusmember",masterdataController.statusmember)
router.post("/tambahmember",masterdataController.tambahmember)
router.post("/mastermemberkasir",masterdataController.mastermemberkasir)
router.post("/jsonmemberselect",masterdataController.jsonmemberselect)
/* master suplier */
router.post("/mastersuplier",masterdataController.mastersuplier)
router.post("/tambahmastersuplier",masterdataController.tambahmastersuplier)
router.post("/hapusmastersuplier",masterdataController.hapusmastersuplier)
router.post("/detailmember",masterdataController.detailmember)
/* master sales */
router.post("/mastersales",masterdataController.mastersales)
router.post("/hapussales",masterdataController.hapussales)
router.post("/tambahmastersales",masterdataController.tambahmastersales)
router.post("/mastersalesmankasir",masterdataController.mastersalesmankasir)
/* master datapendukung */
router.post("/datasatuan",masterdataController.datasatuan)
router.post("/hapussatuan",masterdataController.hapussatuan)
router.post("/tambahsatuan",masterdataController.tambahsatuan)
router.post("/masteraktegorimember",masterdataController.masteraktegorimember)
router.post("/datakategori",masterdataController.datakategori)
router.post("/hapuskategori",masterdataController.hapuskategori)
router.post("/tambahkategori",masterdataController.tambahkategori)
router.post("/datakategorianggota",masterdataController.datakategorianggota)
router.post("/hapuskategorianggota",masterdataController.hapuskategorianggota)
router.post("/tambahkategorianggota",masterdataController.tambahkategorianggota)
router.post("/daftarpembayarannontunai",masterdataController.daftarpembayarannontunai)
router.post("/jasondaftarbrand",masterdataController.jasondaftarbrand)
router.post("/jsonhapusbrand",masterdataController.jsonhapusbrand)
router.post("/jsontambahbrand",masterdataController.jsontambahbrand)
router.post("/jasondaftarprincipal",masterdataController.jasondaftarprincipal)
router.post("/jsontambahprincipal",masterdataController.jsontambahprincipal)
router.post("/jsonhapusprincipal",masterdataController.jsonhapusprincipal)
router.post("/selectvaluereport",masterdataController.selectvaluereport)
module.exports = router
