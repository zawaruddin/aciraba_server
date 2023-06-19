const express = require("express")
const authorize = require('../middleware/authorize')
const router = express.Router()
const authController = require("../controller/authController")

router.post("/apiregister",authController.apiregister)
router.post("/apilogin",authController.apilogin)
router.post("/loginapps",authController.loginapps)
router.post("/registerapps",authController.registerapps)
router.post("/outlet",authController.outlet)

module.exports = router
