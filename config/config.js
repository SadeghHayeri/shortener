const config = {
    baseUrl: process.env.BASE_URL || 'localhost:4000',
    linkCacheTTL: 3600,
    dailyStatsTTL: (30 + 5) * 24 * 3600,
    analyticsStoreBatchSize: 1000,
};

module.exports = config;
