const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
    {
        sender_id: {
            type: mongoose.Types.ObjectId,
            ref: 'users',
        },
        receiver_id: {
            type: mongoose.Types.ObjectId,
            ref: 'users',
        },
        isSuperLike: {
            type: Boolean,
            default: false
        },
        isLikeAction: {
            type: Boolean,
            default: false
        },
        isDislikeAction: {
            type: Boolean,
            default: false
        },
        isPrivateMessage: {
            type: Boolean,
            default: false
        },
        isHeartLike: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['pending', 'accepted','default'],
            default: 'default',
        },
    },
    { timestamps: true }
);


module.exports = mongoose.model("matches", matchSchema);
