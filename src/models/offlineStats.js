const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config/config');

const OfflineStatsSchema = new Schema({
    linkId: {
        type: String,
        required: true,
    },
    stats: {
        byBrowser: {
            type: Map,
            of: Number,
        },
        byDevice: {
            type: Map,
            of: Number,
        }
    },
    createdAt: {
        type: Date,
        expires: config.dailyStatsTTL,
        default: Date.now,
    },
});

OfflineStatsSchema.index({linkId: 1, date: 1}, {unique: true});
const OfflineStats = mongoose.model('linkStats', OfflineStatsSchema);
module.exports = OfflineStats;
