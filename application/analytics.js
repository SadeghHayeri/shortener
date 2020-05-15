const codeStrings = require('../config/codeStrings');
const dailyStatsDataAccess = require('../dataaccess/dailyStats');
const {STATS_DURATION} = require('../config/enums');
const TIME = require('../utils/time');

class AnalyticsApp {
    static async _getDate(date) {
        date = date || new Date();
        return new Date().toLocaleDateString().split('/').join('-');
    }

    static async addView(linkId, device, browser) {
        await dailyStatsDataAccess.addView(linkId, device, browser);
    }

    static _calculateAllViews(mapStats) {
        let all;
        mapStats.keys().forEach(key => {
            all += mapStats.get(key);
        })
        return all;
    }

    static _aggregateStats(offlineStats) {
        const byDeviceAll = new Map();
        const byBrowserAll = new Map();

        offlineStats.forEach(offlineStat => {
            const {byBrowser, byDevice} = offlineStat.stats;
            byBrowser.keys.forEach(key => {
                byBrowserAll.set(key, (byBrowserAll.get(key) || 0) + byBrowser.get(key));
            })
            byDevice.keys().forEach(key => {
                byDeviceAll.set(key, (byDeviceAll.get(key) || 0) + byDevice.get(key));
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
        const today = AnalyticsApp._getDate();
        const {byBrowser, byDevice} = dailyStatsDataAccess.getOnlineStats(linkId, today);
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
