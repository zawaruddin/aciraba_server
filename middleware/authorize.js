var { expressjwt: jwt } = require("express-jwt");
const util = require('../config/utils');
require('dotenv').config();

module.exports = authorize;

function authorize() {
    const secret =  process.env.ACCESS_TOKEN_RHS;
    return [
        jwt({ secret, algorithms: ['HS256'] }),
        function(err, req, res, next){
            res.status(err.status).json(err);
        }
    ];
}