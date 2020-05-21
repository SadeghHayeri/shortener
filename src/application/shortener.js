const LinkDataAccess = require('../dataaccess/link');
const codeStrings = require('../config/codeStrings');
const Random = require('../utils/random');

class ShortenerApp {
    static async generateShortLink(owner, url, preferredPath) {
        const path = preferredPath || Random.generateUniqueId().replace('/', '');
        try {
            const link = await LinkDataAccess.newLink(owner, url, path);
            return link;
        } catch (error) {
            if (error.message === codeStrings.DUPLICATE_PATH_ERROR) {
                const newPath = path + '-' + Random.generateRandomString(1);
                return ShortenerApp.generateShortLink(owner, url, newPath);
            }
            throw error;
        }
    }

    static async getAllUserLinks(owner) {
        return LinkDataAccess.getLinksByOwner(owner);
    }

    static async getLinkByPath(path) {
        const link = LinkDataAccess.getLinkByPath(path);
        if (!link) {
            throw new Error(codeStrings.LINK_NOT_FOUND);
        }
        return link;
    }
}

module.exports = ShortenerApp;
