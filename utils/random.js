const ObjectID = require('bson').ObjectID;

class Random {
    static generateUniqueId() {
        return Buffer.from(new ObjectID().toString(), 'hex').toString('base64');
    }

    static generateRandomString(len) { // TODO: fix for long length
        return Math.random().toString(36).substring(len);
    }
}

module.exports = Random;
