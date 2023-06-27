var { expressjwt: jwt } = require("express-jwt");
const util = require('../config/utils');
require('dotenv').config();

const authMiddleware = jwt({
    secret: process.env.ACCESS_TOKEN_RHS,
    algorithms: ['HS256'],
  });
  
module.exports = authMiddleware;