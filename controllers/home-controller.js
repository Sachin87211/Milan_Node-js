const User = require("../models/user-model");
const Block = require("../models/blocks-user");
const Report = require('../models/reports-model');
const Match = require('../models/match-model');
const helpers = require("../helpers/api-response");
const jwt = require("jsonwebtoken");
const { validationError } = require("../helpers/common-function");
const { homeProfileValidation, likeActionValidation } = require('../helpers/validation');

// exports.homeProfileController = [homeProfileValidation, async (req, res) => {
//     try {
//         await validationError(req, res);

//         const gender = req.user.gender;
//         const user = req.user.location.coordinates;
//         // console.log(user)
//         const lati = user[1];
//         const long = user[0];
//         // console.log(lati)
//         // console.log(long)

//         // console.log(gender)

//         const { maxDistance, minAge, maxAge } = req.body;
//         // console.log(minAge)
//         // console.log(maxAge)
//         let seeking = '';
//         if (gender === 'male') {
//             seeking = 'female'
//         }
//         else {
//             seeking = 'male';
//         }
//         // console.log("here")

//         // const blockedUsers = await Block.find({ user_id: req.user._id });
//         // const blockedUserIds = blockedUsers.map(block => block.blocked_user_id);
//         // console.log(blockedUserIds);

//         const userData = await User.aggregate([
//             {
//                 $geoNear: {
//                     near: {
//                         type: 'Point',
//                         coordinates: [long, lati]
//                     },
//                     key: 'location',
//                     distanceField: 'distance',
//                     maxDistance: maxDistance,
//                     spherical: true,
//                 }
//             },
//             {
//                 $match: {
//                     'gender': seeking,
//                     'age': { $gte: minAge, $lte: maxAge },
//                     'interests': req.user.interests,
//                     'pets': req.user.pets,
//                     'children': req.user.children,
//                     'drink': req.user.drink,
//                     'smoker': req.user.smoker,
//                     'height': req.user.height,
//                     // '_id': { $nin: blockedUserIds }
//                 },
//             },
//             {
//                 $lookup: {
//                     from: 'blocks',
//                     localField: '_id',
//                     foreignField: 'user_id',
//                     as: 'blockedByCurrentUser',
//                     pipeline: [
//                         {
//                             $match: {
//                                 user_id: req.id,
//                                 // blocked_user_id : {
//                                 //     $ne: '$_id'
//                                 // }
//                             }
//                         }
//                     ]
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'blocks',
//                     let: { userId: req.id, id: '$_id' },
//                     as: 'blockedUser',
//                     pipeline: [
//                         {
//                             $match: {
//                                 $expr: {
//                                     $or: [
//                                         { $and: [{ $eq: ['$blocked_user_id', '$$userId'] }, { $eq: ['$user_id', '$$id'] }] },
//                                         { $and: [{ $eq: ['$user_id', '$$userId'] }, { $eq: ['$blocked_user_id', '$$id'] }] }
//                                     ]
//                                 }
//                             }
//                         }
//                     ]
//                 }
//             },
//             {
//                 $match: {
//                     blockedUser: { $eq: [] },
//                 }
//             },
//             // {
//             //     $lookup: {
//             //         from: 'Report',
//             //         let: { userId: req.id, id: '$_id' },
//             //         as: 'reportUser',
//             //         pipeline: [
//             //             {
//             //                 $match: {
//             //                     $expr: {
//             //                         $or: [
//             //                             { $and: [{ $eq: ['$report_user_id', '$$userId'] }, { $eq: ['$user_id', '$$id'] }] },
//             //                             { $and: [{ $eq: ['$user_id', '$$userId'] }, { $eq: ['$report_user_id', '$$id'] }] }
//             //                         ]
//             //                     }
//             //                 }
//             //             }
//             //         ]
//             //     }
//             // },
//             // // {
//             // //     $addFields: {
//             // //         reportUserSize: { $size: "$reportUser" }
//             // //     }
//             // // },
//             // {
//             //     $match: {
//             //         reportUserSize: { $size:{ $lt: 5 } }
//             //     }
//             // }
//         ]);

//         if (!userData) {
//             return helpers.errorResponse(res, 'No user found');
//         }
//         return helpers.successResponseWithData(res, 'user fetched successfully', userData);
//     }
//     catch (err) {
//         console.log(err)
//         return helpers.catchedErrorResponse(res, "Internal Server Error");
//     }
// }
// ];

exports.homeProfileController = [
    async (req, res) => {
        try {
            await validationError(req, res);

            const gender = req.user.gender;
            const user = req.user.location;
            const lati = user.coordinates[1];
            const long = user.coordinates[0];

            let { maxDistance, minAge, maxAge } = req.query; 
            if(!maxDistance){
                maxDistance = 10000000;
            }
            if(!minAge){
                minAge = 18;
            }
            if(!maxAge){
                maxAge = 60;
            }
            maxDistance = Number(maxDistance);
            minAge = Number(minAge);
            maxAge = Number(maxAge);

            let seeking = gender === 'male' ? 'female' : 'male';

            const interestFilterCondition = {
                $or: [
                    { interests: req.user.interests },
                    {
                        $and: [
                            { interests: req.user.interests },
                            { interests: [] }
                        ]
                    }
                ],
                $or: [
                    { pets: req.user.pets },
                    {
                        $and: [
                            { pets: req.user.pets },
                            { pets: [] }
                        ]
                    }
                ],
                children: req.user.children,
                drink: req.user.drink,
                smoker: req.user.smoker,
            }

            const userData = await User.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: [long, lati]
                        },
                        key: 'location',
                        distanceField: 'distance',
                        maxDistance: maxDistance,
                        spherical: true,
                    }
                },
                {
                    $match: {
                        gender: seeking,
                        age: { $gte: minAge, $lte: maxAge },
                        //...interestFilterCondition
                    }
                },
                {
                    $lookup: {
                        from: "blocks",
                        localField: "_id",
                        foreignField: "blocked_user_id",
                        as: "blockUsers",
                    }
                },
                {
                    $match: {
                        "blockUsers.user_id": { $ne: req.id }
                    }
                },
                {
                    $lookup: {
                        from: "blocks",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "blockByUser",
                    }
                },
                {
                    $match: {
                        "blockByUser.blocked_user_id": { $ne: req.id }
                    }
                }
            ]);

            if (!userData.length) {
                return helpers.errorResponse(res, 'No user found');
            }
            return helpers.successResponseWithData(res, 'user fetched successfully', userData);
        } catch (err) {
            console.log(err);
            return helpers.catchedErrorResponse(res, "Internal Server Error");
        }
    }
];

// exports.superLikeController = [async (req, res) => {
//     try {
//         const { userId, matchUserId } = req.body;

//         const matchStatus = await Match.create(
//             { user_id: userId, match_user_id: matchUserId, status: 'pending' },
//         );

//         return res.status(200).json({ message: "Super like recorded", matchStatus });
//     } catch (err) {
//         return helpers.catchedErrorResponse(res, "Internal Server Error");
//     };
// }
// ];

exports.LikeActionController = [likeActionValidation, async (req, res) => {
    try {
        await validationError(req, res);
        const sender_id = req.id;
        const { receiver_id, likeStatus } = req.body;

        if (likeStatus === 'dislike') {
            const user1 = await Match.findOne({ sender_id, receiver_id });
            const user2 = await Match.findOne({ receiver_id: sender_id, sender_id: receiver_id });
            if (!user1 && !user2) {
                return helpers.errorResponse(res, 'No user found');
            }

            if (user1) {
                user1.status = 'default';
                user1.save();
                return helpers.successResponseWithData(res, 'Like action successfully completed', user1);
            }
            else {
                user2.status = 'default';
                user2.save();
                return helpers.successResponseWithData(res, 'Like action successfully completed', user2);
            }

        }
        else if (likeStatus === 'like') {
            const findSenderAction = await Match.findOne({ sender_id, receiver_id });
            if (findSenderAction) {
                return helpers.errorResponse(res, 'Like action request already exists!');
            }

            const findReceiverAction = await Match.findOne({ receiver_id: sender_id, sender_id: receiver_id });
            if (findReceiverAction) {
                //update status
                console.log("here")
                if (findReceiverAction.status === 'pending') {
                    console.log("here1")
                    const updatedUser = await Match.findByIdAndUpdate({ _id: findReceiverAction._id }, { status: 'accepted' }, { new: true });
                    return helpers.successResponseWithData(res, 'User also successfully completed Like action', updatedUser);
                }
                else if (findReceiverAction.status === 'accepted') {
                    return helpers.catchedErrorResponse(res, "Status accepted already exists");
                }
                console.log(updatedUser);
                return helpers.successResponseWithData(res, 'Like action successfully completed', updatedUser);

            }
            else {
                const likeAction = await Match.create({
                    sender_id,
                    receiver_id,
                    isLikeAction: true,
                    status: 'pending'
                });

                if (likeAction) {
                    return helpers.successResponseWithData(res, 'Like action successfully completed', likeAction);
                }
            }
        }
        else {
            return helpers.catchedErrorResponse(res, "Like Type is invalid");
        }
    }
    catch (err) {
        return helpers.catchedErrorResponse(res, "Internal Server Error");
    }
}];

exports.popularActionController = [async (req, res) => {
    try {
        const gender = req.user.gender;

        let seeking = '';
        if (gender === 'male') {
            seeking = 'female'
        }
        else {
            seeking = 'male';
        }
        console.log(seeking);
        // const popularAction = await User.aggregate([
        //     {
        //         $match: {
        //             'gender': seeking,
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "matches",
        //             localField: "_id",
        //             foreignField: "receiver_id",
        //             as: "matches"
        //         }
        //     },
        //     {
        //         $unwind: {
        //             path: '$matches',
        //             preserveNullAndEmptyArrays: false
        //         }
        //     },
        //     {
        //         $match: {
        //             "matches.isLikeAction": true,
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: "$_id",
        //             totalLikesAction: { $sum: 1 },
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "users",
        //             localField: "_id",
        //             foreignField: "_id",
        //             as: "userData"
        //         }
        //    },
        //     {
        //         $sort: {
        //             totalLikesAction: -1
        //         }
        //     }
        // ]);

        const popularAction = await Match.aggregate([
            {
                $match: {
                    isLikeAction: true
                }
            },
            {
                $group: {
                    _id: "$receiver_id",
                    totalLikesAction: {$sum: 1}
                }
            },
            {
                $sort: {
                    totalLikesAction: -1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            }
        ])
        // console.log(popularAction);
        return helpers.successResponseWithData(res, 'Popular action successfully completed', popularAction);
    } catch (err) {
        return helpers.catchedErrorResponse(res, "Internal Server Error");
    }
}];

exports.newUsersController = [async (req, res) => {
    try {
        const gender = req.user.gender;

        let seeking = '';
        if (gender === 'male') {
            seeking = 'female'
        }
        else {
            seeking = 'male';
        }
        console.log(seeking);
        // console.log(currentTime);
        // console.log(currentTime - (24 * 60 * 60 * 1000));

        const diffTime = new Date(new Date() - (24 * 60 * 60 * 1000))

        const newUsersAction = await User.aggregate([
            {
                $match: {
                    'gender': seeking,
                }
            },
            {
                $match: {
                    "createdAt": { $gte: diffTime }
                }
            }
        ]);

        console.log(newUsersAction);

        return helpers.successResponseWithData(res, 'New users action successfully completed', newUsersAction);
    } catch (err) {
        return helpers.catchedErrorResponse(res, "Internal Server Error");
    }
}];

exports.nearByUsersController = async (req, res) => {
    try {
        const distance_preferences = req.user.distance_preferences;
        const gender = req.user.gender;
        const lati = req.user.location.coordinates[1];
        const long = req.user.location.coordinates[0];
        // console.log(gender)
        // console.log(lati, long)



        let seeking = (gender === 'male') ? 'female' : 'male';

        const nearByUsers = await User.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [long, lati] 
                    },
                    distanceField: 'distance', 
                    maxDistance: distance_preferences,
                    spherical: true,
                }
            },
            {
                $match: {
                    gender: seeking,
                }
            }
        ]);

        return helpers.successResponseWithData(res, 'Near by users found successfully', nearByUsers);
    } catch (err) {
        console.error('Error finding nearby users:', err);
        return helpers.catchedErrorResponse(res, "Internal Server Error");
    }
};
