const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
    owner: {
        type: {type: Schema.Types.ObjectId, ref: 'user'},
        required: true,
    },
    path: {
        type: String,
        required: true,
        unique: true,
    },
    url: {
        type: String,
        required: true,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

LinkSchema.index({ owner: 1, url: 1 }, { unique: true });

const Link = mongoose.model('link', LinkSchema);
module.exports = Link;
