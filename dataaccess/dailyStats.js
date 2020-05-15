const OfflineStats = require('../models/offlineStats');
const {master: redis} = require('../utils/redis');
const collections = require('../utils/collections');

class DailyStatsDataAccess {
    static _getVisitedSetRedisKey(date) {
        return `stats:${date}:visited-set`;
    }

    static _getDevicesRedisKey(linkId, date) {
        return `stats:${date}:linkId:${linkId}:devices`;
    }

    static _getBrowserRedisKey(linkId, date) {
        return `stats:${date}:linkId:${linkId}:browser`;
    }

    static async addView(linkId, date, device, browser) {
        await redis.pipeline()
            .hincrby(DailyStatsDataAccess._getDevicesRedisKey(linkId, date), device, 1)
            .hincrby(DailyStatsDataAccess._getBrowserRedisKey(linkId, date), browser, 1)
            .exec();
    }

    static async addToVisitedSet(linkId, date) {
        await redis.sadd(DailyStatsDataAccess._getVisitedSetRedisKey(date), linkId);
    }

    static async getVisitedLinks(date, limit) {
        return redis.srandmember(DailyStatsDataAccess._getVisitedSetRedisKey(date), limit);
    }

    static async removeFromVisitedLinkSet(date, linkId) {
        await redis.srem(DailyStatsDataAccess._getVisitedSetRedisKey(date), linkId);
    }

    static async getOnlineStats(linkId, date) {
        const [[,deviceStats], [,browserStats]] = await redis.pipeline()
            .hgetall(DailyStatsDataAccess._getDevicesRedisKey(linkId, date))
            .hgetall(DailyStatsDataAccess._getBrowserRedisKey(linkId, date))
            .exec();
        return {
            deviceStats: collections.objectToMap(deviceStats),
            browserStats: collections.objectToMap(browserStats),
        };
    }

    static async deleteOnlineStats(linkId, date) {
        await redis.pipeline()
            .del(DailyStatsDataAccess._getDevicesRedisKey(linkId, date))
            .del(DailyStatsDataAccess._getBrowserRedisKey(linkId, date))
            .exec();
    }

    static async getOfflineStats(linkId, startDate, endDate) {
        const offlineStats = await OfflineStats.find({
            linkId,
            createdAt: {$gte: startDate, $lte: endDate},
        });
        return offlineStats.map(offlineStat => offlineStat.toObject());
    }

    static async addOfflineStats(linkId, date, stats) {
        const newStats = new OfflineStats({linkId, stats, createdAt: date});
        await newStats.save();
        return newStats.toObject();
    }
}

module.exports = DailyStatsDataAccess;
