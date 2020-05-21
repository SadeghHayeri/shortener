const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
    owner: {
        type: String,
        required: true,
        index: true,
    },
    path: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    url: {
        type: String,
        required: true,
    },
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    toObject: ({
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    })
});

const Link = mongoose.model('link', LinkSchema);
module.exports = Link;
