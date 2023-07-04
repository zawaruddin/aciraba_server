const express = require("express")
const authorize = require('../middleware/authorize')
const router = express.Router()
const authController = require("../controller/authController")

router.post("/pendaftaranmember",authController.pendaftaranmember)
router.post("/simpanhakakses",authController.simpanhakakses)
router.post("/daftarhakakses",authController.daftarhakakses)
router.post("/loginapps",authController.loginapps)
router.post("/registerapps",authController.registerapps)
router.post("/outlet",authController.outlet)
router.post("/hapusoutlet",authController.hapusoutlet)
router.post("/detailinformasioutlet",authController.detailinformasioutlet)
router.post("/daftarpegawai",authController.daftarpegawai)
router.post("/statuspegawai",authController.statuspegawai)
router.post("/ubahpasswordproses",authController.ubahpasswordproses)

module.exports = router