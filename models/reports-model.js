const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user_id : {
        type: mongoose.Types.ObjectId,
        ref: 'users',
    },
    report_user_id : {
        type: mongoose.Types.ObjectId,
        ref: 'users',
    },
    reason: {
        type: String,
        required: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("reports", reportSchema);
