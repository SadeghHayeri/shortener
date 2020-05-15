const OfflineStats = require('../models/offlineStats');
const {master: redis} = require('../utils/redis');

class DailyStatsDataAccess {
    static _getDevicesRedisKey(linkId, date) {
        return `stats:${date}:linkId:${linkId}:devices`;
    }

    static _getBrowserRedisKey(linkId, date) {
        return `stats:${date}:linkId:${linkId}:browser`;
    }

    static async addView(linkId, device, browser) {
        await redis.pipeline()
            .hincby(DailyStatsDataAccess._getDevicesRedisKey(linkId), device)
            .hincby(DailyStatsDataAccess._getBrowserRedisKey(linkId), browser)
            .exec();
    }

    static async getOnlineStats(linkId, date) {
        const [deviceStats, browserStats] = await redis.pipeline()
            .hgetall(DailyStatsDataAccess._getDevicesRedisKey(linkId, date))
            .hgetall(DailyStatsDataAccess._getBrowserRedisKey(linkId, date))
            .exec();

        return {deviceStats, browserStats};
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
