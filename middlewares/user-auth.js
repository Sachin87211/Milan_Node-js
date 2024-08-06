const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const helpers = require('../helpers/api-response');
require('dotenv').config()

const authentication = async (req, res, next) => {
    try {
        // console.log("here")
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return helpers.errorResponse(res, 'Token not found', 401);
        }

        const token = authHeader.split(' ')[1];
        const verify = jwt.verify(token, process.env.SECRET_TOKEN_KEY);

        const user = await User.findOne({ _id: verify._id });
        // console.log(user)

        if (!user) {
            return helpers.errorResponse(res, 'User not found');
        }

        // console.log(user)

        req.user = user;
        req.id = user._id;
        // console.log("here1")
        next();
    } catch (err) {
        console.error(err);
        return helpers.catchedErrorResponse(res, 'Authentication failed', 401);
    }
};

module.exports = { authentication };
