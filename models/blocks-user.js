const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  mediaUrl: { type: String, required: true },
  mimeType: { type: String, required: true },
  thumbnail: { type: String }
});

const blockedSchema = new mongoose.Schema(
  {
    user_id : {
        type: mongoose.Types.ObjectId,
        ref: 'users',
    },
    blocked_user_id : {
        type: mongoose.Types.ObjectId,
        ref: 'users',
    },
    // blocked_status: {
    //   type: Boolean,
    //   default: false,
    // }
  },
  { timestamps: true }
);

module.exports = mongoose.model("blocks", blockedSchema);
