const Link = require('../models/link');
const codeStrings = require('../config/codeStrings');

class LinkDataAccess {
    static async newLink(owner, url, path) {
        try {
            const link = new Link({owner, url, path});
            await link.save();
            return link.toObject();
        } catch (error) {
            if (error.code === 11000) {
                throw new Error(codeStrings.DUPLICATE_PATH_ERROR);
            }
            throw error;
        }
    }

    static async getLinksByOwner(owner) {
        const links = await Link.find({owner});
        return links.map(link => link.toObject());
    }

    static async getLinkByPath(path) {
        const link = await Link.findOne({path});
        return link.toObject();
    }
}

module.exports = LinkDataAccess;
