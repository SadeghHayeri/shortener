const dotenv = require('dotenv');

dotenv.config();

const secrets = {
    jwt: {
        secret: process.env.JWT_SECRET,
        options: {algorithm: 'RS512'},
    },
    password: {
        saltRound: process.env.PASSOWRD_SALT_ROUND || 10,
    },
};

module.exports = secrets;
