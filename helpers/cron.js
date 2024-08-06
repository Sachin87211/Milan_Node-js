var cron = require('node-cron');
const User = require("../models/user-model");

const Report = require('../models/reports-model');

cron.schedule('*/30 * * * * *', async () => {
    console.log('running a task every 30 seconds');
    // const users = await Report.find();
    const checkUser = await Report.aggregate([
        {
            $group:
            {
                _id: '$report_user_id',
                reportUser: { $sum: 1 }
            }
        }
    ]);
    // console.log(checkUser)

    for (let i = 0; i < reportUser.length; i++) {
        if(checkUser[i].reportUser > 5) {
            await User.findByIdAndUpdate(checkUser[i]._id, { is_reported: true });
        }
    }
});

