const UserDataAccess = require('../dataaccess/user');
const codeStrings = require('../config/codeStrings');
const {jwt} = require('../config/secrets');

class ShortenerApp {
    static async generateShortLink(userId, url, preferredPath) {
    }

    static async getAllUserLinks(userId) {
    }
}

module.exports = ShortenerApp;
