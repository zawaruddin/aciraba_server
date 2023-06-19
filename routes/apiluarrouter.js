const express = require("express")
const authorize = require('../middleware/authorize')
const router = express.Router()
const digiflazz = require("../controller/digiflazzController")

router.post("/digiflazz",digiflazz.apidigiflazz)
router.post("/digiflazzupdate",digiflazz.updateproduk)
router.post("/digiflazzwebhook",digiflazz.digiflazzwebhook)

module.exports = router
