const codeStrings = require('../config/codeStrings');
const dailyStatsDataAccess = require('../dataaccess/dailyStats');
const {STATS_DURATION} = require('../config/enums');
const TIME = require('../utils/time');
const Promise = require('bluebird');
const config = require('../config/config');
const logger = require('../utils/logger');

class AnalyticsApp {
    static _toDateString(date) {
        return date.toLocaleDateString().split('/').join('-');
    }

    static async addView(linkId, device, browser) {
        const today = AnalyticsApp._toDateString(new Date());
        await Promise.all([
            dailyStatsDataAccess.addView(linkId, today, device, browser),
            dailyStatsDataAccess.addToVisitedSet(linkId, today),
        ]);
    }

    static async storeOnlineStats() {
        const yesterday = AnalyticsApp._toDateString(new Date(Date.now() - 12 * TIME.HOUR));
        logger.info('start store stats scheduler');
        while (true) {
            const linkIds = await dailyStatsDataAccess.getVisitedLinks(yesterday, config.analyticsStoreBatchSize);
            if (!linkIds.length) {
                logger.info('no new linkIds, end!');
                break;
            }

            logger.info(`store ${linkIds.length} linkIds`);
            await Promise.map(linkIds, async linkId => {
                const {byDevice, byBrowser} = await dailyStatsDataAccess.getOnlineStats(linkId, yesterday);
                await dailyStatsDataAccess.removeFromVisitedLinkSet(yesterday, linkId);
                await dailyStatsDataAccess.addOfflineStats(linkId, yesterday, {byDevice, byBrowser});
            });
            logger.info('store finished');
        }
    }

    static _calculateAllViews(mapStats) {
        let all = 0;
        mapStats.forEach(value => {
            all += value;
        })
        return all;
    }

    static _aggregateStats(offlineStats) {
        const byDeviceAll = new Map();
        const byBrowserAll = new Map();

        offlineStats.forEach(offlineStat => {
            const {byBrowser, byDevice} = offlineStat.stats;
            byBrowser.forEach((value, key) => {
                byBrowserAll.set(key, (byBrowserAll.get(key) || 0) + value);
            })
            byDevice.forEach((value, key) => {
                byDeviceAll.set(key, (byDeviceAll.get(key) || 0) + value);
            })
        });

        return {
            all: AnalyticsApp._calculateAllViews(byBrowserAll),
            byBrowser: byBrowserAll,
            byDevice: byDeviceAll,
        }
    }

    static async _getOfflineStats(linkId, statsDuration) {
        let startDate, endDate;
        switch (statsDuration) {
            case STATS_DURATION.YESTERDAY:
                startDate = Date.now() - TIME.DAY;
                endDate = Date.now() - TIME.DAY;
                break;
            case STATS_DURATION.LAST_WEEK:
                startDate = Date.now() - TIME.WEEK;
                endDate = Date.now() - TIME.DAY;
                break;
            case STATS_DURATION.LAST_MONTH:
                startDate = Date.now() - TIME.MONTH;
                endDate = Date.now() - TIME.DAY;
                break;
        }

        const offlineStats = await dailyStatsDataAccess.getOfflineStats(linkId, startDate, endDate);
        return AnalyticsApp._aggregateStats(offlineStats);
    }

    static async _getTodayStats(linkId) {
        const today = AnalyticsApp._toDateString(new Date());
        const {byBrowser, byDevice} = await dailyStatsDataAccess.getOnlineStats(linkId, today);
        return {
            all: AnalyticsApp._calculateAllViews(byBrowser),
            byBrowser,
            byDevice,
        }
    }

    static async getLinkStats(linkId, statsDuration) {
        if (statsDuration === STATS_DURATION.TODAY) {
            return AnalyticsApp._getTodayStats(linkId);
        }
        return AnalyticsApp._getOfflineStats(linkId, statsDuration);
    }
}

module.exports = AnalyticsApp;
