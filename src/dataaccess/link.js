const Link = require('../models/link');
const {master: redisMaster, slave: redisSlave} = require('../utils/redis');
const config = require('../config/config');
const codeStrings = require('../config/codeStrings');

class LinkDataAccess {
    static _getRedisKey(path) {
        return `shortener:path:${path}`;
    }

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

    static async _loadFromCache(path) {
        const redisKey = LinkDataAccess._getRedisKey(path);
        const redisData = await redisSlave.get(redisKey);

        return redisData ? JSON.parse(redisData) : null;
    }

    static async _saveToCache(link) {
        const redisKey = LinkDataAccess._getRedisKey(link.path);
        await redisMaster.set(redisKey, JSON.stringify(link), 'EX', config.linkCacheTTL);
    }

    static async getLinkByPath(path) {
        const cachedLink = await LinkDataAccess._loadFromCache(path);
        if (cachedLink) {
            return cachedLink;
        }

        const link = await Link.findOne({path});
        if (!link) {
            throw new Error(codeStrings.LINK_NOT_FOUND);
        }
        LinkDataAccess._saveToCache(link.toObject());
        return link.toObject();
    }
}

module.exports = LinkDataAccess;
