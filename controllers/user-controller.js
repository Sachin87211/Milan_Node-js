const User = require("../models/user-model");
const Block = require("../models/blocks-user");
const Report = require('../models/reports-model');
const Match = require('../models/match-model');
const helpers = require("../helpers/api-response");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const path = require('path');
const sharp = require("sharp");
const { validationError } = require("../helpers/common-function");
const {sendMail} = require("../helpers/mailer")
const {
  registerValidation,
  otpVerificationValidation,
  validateUserData,
  completeProfileValidaion,
  blockedUserValidation,
  unblockedUserValidation,
  validateCreateReport,
} = require("../helpers/validation");

exports.registerController = [
  registerValidation,
  async (req, res) => {
    try {

      validationError(req, res);

      const { countryCode, phoneNumber } = req.body;

      const otp = crypto.randomInt(0, Math.pow(10, 4)).toString().padStart(4, '0');
      console.log(otp)
      let userCheck = await User.findOne({ phoneNumber });
      // console.log(userCheck);

      if (!userCheck) {
        userCheck = await User.create({ phoneNumber, countryCode, otp });
      }
      else {
        console.log(otp)
        userCheck.otp = otp;
        userCheck = await userCheck.save();
      }
      const loginToken = jwt.sign(
        { _id: userCheck._id },
        process.env.SECRET_TOKEN_KEY,
        { expiresIn: "1d" }
      );
      console.log("hello4")
      if (loginToken) {
        return helpers.successResponseWithDataAndToken(
          res,
          "logged In",
          userCheck.profile_status,
          loginToken
        );
      }
    } catch (err) {
      console.log('ooo', err)
      return helpers.catchedErrorResponse(res, "Internal Server Error");
    }
  },
];

exports.otpVerficationController = [
  otpVerificationValidation,
  async (req, res) => {
    try {
      validationError(req, res);

      const { otp } = req.body;
      console.log(otp)
      console.log(req.id)
      const id = req.id;

      const user = await User.findById(id);
      console.log(user);
      if (!user) {
        return helpers.errorResponse(res, "User not found");
      }
      console.log("here2")
      if (otp != user.otp) {
        return helpers.errorResponse(res, "otp not match");
      }

      return helpers.successResponse(res, "Otp Varified successfully");
    } catch (err) {
      return helpers.catchedErrorResponse(
        res,
        "internal server error, otp verfication failed"
      );
    }
  },
];

exports.completeProfile = [completeProfileValidaion, async (req, res) => {
  try {
    const userKeysArray = ['email', 'firstName', 'long', 'lati', 'gender', 'seeking', 'dob'];
    // console.log(email);
    // console.log(dob)
    const refObj = {};
    for (const key of userKeysArray) {
      if (req.body[key] != null) {
        refObj[key] = req.body[key]
      }
    }
    const user = req.user;
    if (refObj.email) {
      const userCheck = await User.findOne({ email: refObj.email });
      if (userCheck) {
        return helpers.errorResponse(res, 'email already exists')
      }
      refObj.profile_status = 1;
    }
    else if (refObj.firstName) {
      refObj.profile_status = 2;
    }
    else if (refObj.long && refObj.lati) {
      refObj.profile_status = 3;
      refObj.location = {
        type: "Point",
        coordinates: [parseFloat(refObj.long), parseFloat(refObj.lati)]
      };
      delete refObj.long;
      delete refObj.lati;
    }
    else if (refObj.gender) {
      refObj.profile_status = 4;
    }
    else if (refObj.seeking) {
      refObj.profile_status = 5;
    }
    else if (refObj.dob) {
      console.log(refObj.dob);  
      refObj.profile_status = 6;
    }
    const userData = await User.findOneAndUpdate(
      { _id: req.id }, { $set: refObj }, { new: true });

    if (!userData) {
      return helpers.errorResponse(res, 'User not found');
    }
    return helpers.successResponseWithData(res, 'Data added successfully', userData);
  }
  catch (err) {
    return helpers.catchedErrorResponse(res, 'Internal Server Error');
  }
}
];

exports.getUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return helpers.errorResponse(res, 'user not found');
    }
    return helpers.successResponseWithData(res, 'user fetched successfully', user);
  } catch (err) {
    return helpers.catchedErrorResponse(res, "Internal Server Error");
  }
};

// exports.uploadImagesController = async (req, res) => {
//   try {
// console.log(req.files);
// console.log(req.user)
// if (!req.files) {
//   return helpers.errorResponse(res, 'total images should be equal to 2 or more');
// }

// const user = await User.findById(req.id);
// if (!user) {
//   return helpers.errorResponse(res, 'User not found.');
// }

// const newImageCount = req.files.length;
// console.log(newImageCount);

// if (newImageCount > 6) {
//   return helpers.errorResponse(res, `Cannot upload. A maximum of 6 images are allowed per user. You have 6 images already.`);
// }

// const imageDocs = [];

// for (const file of req.files) {
//   const thumbnailFilename = `thumb-${file.filename}`;
//   const thumbnailPath = path.join(__dirname, '..', 'public', 'uploads', thumbnailFilename);

//   await sharp(file.path)
//     .resize(200, 200)
//     .toFile(thumbnailPath);

//     console.log(file.filename)
//     console.log(file.mimeType)


//   const imageDoc = {
//     mediaUrl: file.filename,
//     mimeType: file.mimetype,
//     thumbnail: `/uploads/${thumbnailFilename}`,
//   };
// imageDocs.push(imageDoc);
//   console.log(imageDocs)
// }

// const updatedUser = await User.findByIdAndUpdate(
//   req.id,
//   { $push: { url: { $each: imageDocs } } },
//   { new: true, useFindAndModify: false }
// );
//     const user = req.user;
//     user.profile_image = req.images;
//     console.log("imagePath: " + user.profile_image)

//     if(!imagePath || imagePath.length === 0){
//       return helpers.errorResponse(res, "No file uploaded in cloudinary, try again");
//     }

//     updatedUser.profile_status = 7;
//     await updatedUser.save();

//     console.log("Updated user document:", updatedUser);

//     if (!updatedUser) {
//       return helpers.errorResponse(res, 'Uploading file not saved.');
//     }

//     return helpers.successResponseWithData(res, 'Uploaded Successfully', updatedUser);
//   } catch (err) {
//     console.error("Error uploading images:", err);
//     return helpers.catchedErrorResponse(res, "Internal Server Error, image uploading failed.");
//   }
// };

exports.uploadImagesController = async (req, res) => {
  try {

    if (!req.images || req.images.length < 2) {
      return helpers.errorResponse(res, 'total images should be equal to 2 or more');
    }

    const newImageCount = req.images.length;
    console.log(newImageCount);

    if (newImageCount > 6) {
      return helpers.errorResponse(res, `Cannot upload. A maximum of 6 images are allowed per user. You have 6 images already.`);
    }

    const imagePath = req.images;
    console.log("imagePath", req.images);

    const updatedUser = await User.findByIdAndUpdate(
      req.id,
      { $push: { url: { $each: imagePath } } },
      { new: true, useFindAndModify: false }
    );

    updatedUser.profile_status = 7;
    updatedUser.save();

    if (!updatedUser) {
      return helpers.errorResponse(res, "updated user does not exist, try again");
    }
    return helpers.successResponseWithData(res, 'Uploading images', updatedUser);
  } catch (error) {
    console.error("Error uploading images:", error);
    return helpers.catchedErrorResponse(res, "Internal Server Error, image uploading failed.");
  }
};

exports.editProfile = [validateUserData, async (req, res) => {
  // console.log("here3")
  try {
    // console.log("here1")
    await validationError(req, res);
    // console.log("here2");

    const userKeysArray = ['lati', 'long', 'about_me', 'interests', 'currentWork', 'school', 'dob', 'gender', 'seeking', 'pets', 'children', 'astrologicalSign', 'religion', 'height', 'education', 'bodyType', 'exercise', 'drink', 'smoker', 'marijuana', 'looking_for', 'verify_profile_status'];
    // console.log(url)
    // console.log("here1")
    const refObj = {};
    // console.log("here9")
    for (const key of userKeysArray) {
      if (req.body[key] != null) {
        refObj[key] = req.body[key]
      }
    }
    // console.log("here2")
    if (refObj.long && refObj.lati) {
      refObj.location = {
        type: "Point",
        coordinates: [parseFloat(refObj.long), parseFloat(refObj.lati)]
      };
      delete refObj.long;
      delete refObj.lati;
    }

    if (refObj.verify_profile_status) {
      verify_profile_status = true;
    }

    // console.log("here4")
    const userData = await User.findOneAndUpdate(
      { _id: req.id }, { $set: refObj }, { new: true });

    // console.log(userData);

    if (!userData) {
      return helpers.errorResponse(res, 'User not found');
    }
    return helpers.successResponseWithData(res, 'Data added successfully', userData);
  }
  catch (err) {
    return helpers.catchedErrorResponse(res, 'Internal Server Error');
  }
}
];

// exports.userProfile = [, async (req, res) => {
//   try {
//     // await validationError(req,res);

//     // const userKeysArray = ['lati', 'long', 'about_me', 'interests', 'currentWork', 'school', 'seeking', 'pets', 'children', 'astrologicalSign', 'religion', 'height', 'education', 'bodyType', 'exercise', 'drink', 'smoker', 'marijuana'];

//     const { userid } = req.body;


//     const refObj = {};
//     for (const key of userKeysArray) {
//       if (req.body[key] != null) {
//         refObj[key] = req.body[key]
//       }
//     }

//     if (refObj.long && refObj.lati) {
//       refObj.location = {
//         type: "Point",
//         coordinates: [parseFloat(refObj.long), parseFloat(refObj.lati)]
//       };
//       delete refObj.long;
//       delete refObj.lati;
//     }
//     const userData = await User.findOneAndUpdate(
//       { _id: req.id }, { $set: refObj }, { new: true });

//     if (!userData) {
//       return helpers.errorResponse(res, 'User not found');
//     }
//     return helpers.successResponseWithData(res, 'Data added successfully', userData);
//   }
//   catch (err) {
//     return helpers.catchedErrorResponse(res, 'Internal Server Error');
//   }}
// ];

exports.swapImageController = [async (req, res) => {
  try {
    await validationError(req, res);

    const { imageIndex1, imageIndex2 } = req.body;
    const id = req.id;

    // const user = await User.findById(req.id);
    const user = req.user;
    const imageArr = user.url;
    console.log(imageArr);

    for (let i = 0; i < user.url.length; i++) {
      if (!user.url[i].thumbnail) {
        user.url[i].thumbnail = "default-thumbnail-url";
      }
    }

    // const image1 = imageArr[imageIndex1];
    // const image2 = imageArr[imageIndex2];
    // console.log(user.url[imageIndex1])
    // console.log(user.url[imageIndex2]) 
    [user.url[imageIndex1], user.url[imageIndex2]] = [user.url[imageIndex2], user.url[imageIndex1]];

    // console.log(user.url[imageIndex1]) 
    // console.log(user.url[imageIndex2]) 
    if (!updatedUser) {
      return helpers.errorResponse(res, 'Swapped file not saved.');
    }
    await user.save();


    return helpers.successResponseWithData(res, 'Swapped Images Successfully', user);

  } catch (err) {
    console.error("Error uploading images:", err);
    return helpers.catchedErrorResponse(res, "Internal Server Error");
  }
}];

exports.blockedUserController = [blockedUserValidation, async (req, res) => {
  try {
    await validationError(req, res);

    const { blocked_user_id } = req.body;

    const user_id = req.id;

    const blocked_user = await User.findById(blocked_user_id);
    blocked_user.blocked_count = blocked_user.blocked_count + 1;

    if (blocked_user.blocked_count == 5) {
      blocked_user.blocked_status = true;
    }

    await blocked_user.save();

    const blockUser = await Block.create({
      user_id: user_id,
      blocked_user_id: blocked_user_id,
    });

    if (!blockUser) {
      return helpers.errorResponse(res, "User not able to be blocked, trt again");
    }
    return helpers.successResponse(res, "User blocked successfully");

  } catch (err) {
    console.error("Error uploading images:", err);
    return helpers.catchedErrorResponse(res, "Internal Server Error");
  }
}];

exports.unblockedUserController = [unblockedUserValidation, async (req, res) => {
  try {
    await validationError(req, res);
    const { blocked_user_id } = req.body;
    const user_id = req.id;
    const user = await Block.findOneAndDelete({
      user_id,
      blocked_user_id
    });

    if (!user) {
      return helpers.errorResponse(res, "User not able to be blocked, trt again");
    }
    return helpers.successResponseWithData(res, "User unblocked successfully", user);

  } catch (err) {
    console.error("Error uploading images:", err);
    return helpers.catchedErrorResponse(res, "Internal Server Error");
  }
}];

exports.createReportController = [validateCreateReport, async (req, res) => {
  try {
    await validationError(req, res);
    const { blocked_user_id, reason } = req.body;
    const user_id = req.id;

    const user = await User.findById(user_id);
    const blockedUser = await User.findById(blocked_user_id);

    if (!user) {
      return helpers.errorResponse(res, 'User not found.');
    }

    if (!blockedUser) {
      return helpers.errorResponse(res, 'Blocked user not found.');
    }

    const newReport = new Report({
      user_id,
      blocked_user_id,
      reason
    });

    await newReport.save();

    if (!newReport) {
      return helpers.errorResponse(res, 'New Report not created, try again.');
    }
    return helpers.successResponse(res, 'Report created successfully', newReport);
  } catch (err) {
    console.error('Error creating report:', err);
    return helpers.catchedErrorResponse(res, 'Internal Server Error');
  }
}];

exports.removeImages = [async (req, res) => {
  try {
    await validationError(req, res);

    const { imageId } = req.body;
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      return helpers.errorResponse(res, 'User id not found');
    }

    if (!imageId) {
      return helpers.errorResponse(res, 'Image id not found');
    }
    console.log("here1")
    const imageIndex = user.url.findIndex(image => image._id.toString() === imageId);
    if (imageIndex === -1) {
      return helpers.errorResponse(res, 'Image not found');
    }
    console.log(imageIndex)

    user.url.splice(imageIndex, 1);

    await user.save();

    return helpers.successResponseWithData(res, 'Image deleted successfully');

  } catch (err) {
    return helpers.catchedErrorResponse(res, 'Internal Server Error');
  }
}];

exports.addImageController = [async (req, res) => {
  try {
    console.log(req.file)
    if (!req.file) {
      return helpers.errorResponse(res, 'images not found');
    }

    const user = await req.user;

    const existingImageCount = user.url.length;
    // const newImageCount = 1;

    if (!(existingImageCount + 1 <= 9)) {
      return helpers.errorResponse(res, `Cannot upload. A maximum of 9 images are allowed per user. You have ${existingImageCount} images already.`);
    }

    const imageDocs = [];

    const thumbnailFilename = `thumb-${req.file.filename}`;
    const thumbnailPath = path.join(__dirname, '..', 'public', 'uploads', thumbnailFilename);

    await sharp(req.file.path)
      .resize(200, 200)
      .toFile(thumbnailPath);

    const imageDoc = {
      mediaUrl: req.file.filename,
      mimeType: req.file.mimetype,
      thumbnail: `/uploads/${thumbnailFilename}`,
    };
    imageDocs.push(imageDoc);

    const updatedUser = await User.findByIdAndUpdate(
      req.id,
      { $push: { url: imageDocs } },
      { new: true, useFindAndModify: false });

    await updatedUser.save();

    console.log("Updated user document:", updatedUser);

    if (!updatedUser) {
      return helpers.errorResponse(res, 'Uploading file not saved.');
    }

    return helpers.successResponseWithData(res, 'Uploaded Successfully', updatedUser);
  } catch (err) {
    console.error("Error uploading images:", err);
    return helpers.catchedErrorResponse(res, "Internal Server Error, image uploading failed.");
  }
}];

exports.replaceImageController = [async (req, res) => {
  try {
    if (!req.file) {
      return helpers.errorResponse(res, 'images not found');
    }

    const { imageId } = req.body;

    const user = await req.user;

    const thumbnailFilename = `thumb-${req.file.filename}`;
    const thumbnailPath = path.join(__dirname, '..', 'public', 'uploads', thumbnailFilename);

    await sharp(req.file.path)
      .resize(200, 200)
      .toFile(thumbnailPath);

    const imageDoc = {
      mediaUrl: req.file.filename,
      mimeType: req.file.mimetype,
      thumbnail: `/uploads/${thumbnailFilename}`,
    };

    const targetIndex = user.url.findIndex(img => img._id.toString() === imageId);
    console.log(user.url[0]);
    user.url.splice(targetIndex, 1, imageDoc);

    updatedUser = await user.save();
    console.log(updatedUser.url[0]);

    console.log("Updated user document:", updatedUser);

    if (!updatedUser) {
      return helpers.errorResponse(res, 'Uploading file not saved.');
    }

    return helpers.successResponseWithData(res, 'Uploaded Successfully', updatedUser);
  } catch (err) {
    console.error("Error uploading images:", err);
    return helpers.catchedErrorResponse(res, "Internal Server Error, image uploading failed.");
  }
}];

exports.discoverySettingController = [async (req, res) => {
  try {
    const userKeysArray = ['lati', 'long', 'seeking', 'minAge', 'maxAge', 'distance_preferences'];
    const refObj = {};
    for (const key of userKeysArray) {
      if (req.body[key] != null) {
        refObj[key] = req.body[key]
      }
    }
    if (refObj.long && refObj.lati) {
      refObj.location = {
        type: "Point",
        coordinates: [parseFloat(refObj.long), parseFloat(refObj.lati)]
      };
      delete refObj.long;
      delete refObj.lati;
    }

    const userData = await User.findOneAndUpdate(
      { _id: req.id }, { $set: refObj }, { new: true });

    console.log(userData);

    if (!userData) {
      return helpers.errorResponse(res, 'User not found');
    }
    return helpers.successResponseWithData(res, 'Data added successfully', userData);
  }
  catch (err) {
    return helpers.catchedErrorResponse(res, 'Internal Server Error');
  }
}];

exports.sendEmailController = [async (req, res) => {
  const { newEmail } = req.body;

  const currentEmail = req.user.email;

  if(newEmail){
    return helpers.errorResponse(res, 'Email already in use');  
  }
  const userId = req.id;
  const token = jwt.sign({userId, newEmail}, process.env.SECRET_TOKEN_KEY, {expiresIn: '7d'});
  console.log(token);

  const verficationLink = `http://localhost:3001/api/v1/users/update/email?token=${token}`;
  // const verficationLink = `http://192.168.1.95:3001/api/v1/users/update/email?token=${token}`;
  
  const receiver = {
    from: "randomMail@gmail.com",
    to: currentEmail,
    subject: "Update Email",
    html: `<p> Click on the following link to update your Email <a href="${verficationLink}">Update Email</a></p>`
  }
  console.log(receiver);

  await sendMail(receiver);

  return helpers.successResponse(res, "Email sent successfully");
}];

exports.updateEmailController = [async (req, res) => {
  const token = req.query.token;
  if(!token) {
    return helpers.errorResponse(res, "Invalid token");
  }

  const decode = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
  const userId = decode.userId;
  const newEmail = decode.newEmail;

  const user = await User.findById(userId);
  if(!user) {
    return helpers.errorResponse(res, "User not found");
  }

    user.email = newEmail;
    const updateUser = await user.save();

    if(updateUser){
      res.render("updateEmail")
      // return helpers.successResponse(res,"Email updated successfully");

    }
    else{
      return helpers.errorResponse(res, "Email not updated, try again");
    }

    
}]



