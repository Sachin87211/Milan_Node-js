const express = require('express');
const passport = require('passport');
require("../passport")
const { registerController, otpVerficationController, completeProfile, getUser, uploadImagesController, editProfile, swapImageController, blockedUserController, unblockedUserController, createReportController, removeImages, addImageController, replaceImageController, discoverySettingController, sendEmailController, updateEmailController } = require('../controllers/user-controller');
const { authentication } = require('../middlewares/user-auth');
const { upload }  = require('../middlewares/uploadImages');
const { homeProfileController, LikeActionController, popularActionController, newUsersController, nearByUsersController } = require('../controllers/home-controller');
const uploadMultiple = require('../utils/cloudinary');
const router = express.Router(); 
                                                             

router.post('/createUser', registerController);
router.post('/otpVerify', authentication, otpVerficationController);
router.post('/complete/Profile', authentication, completeProfile);
router.get('/get/user', authentication, getUser);
router.post('/upload',authentication, upload.array("images"),uploadMultiple, uploadImagesController);
// router.post('/upload', authentication, upload.array('image', 6),uploadMultiple, uploadImagesController);
router.put('/edit/user', authentication,editProfile);
router.get('/home/profile', authentication, homeProfileController);
router.put('/swap/image', authentication, swapImageController);
router.post('/blocked/user', authentication, blockedUserController);
router.delete('/unblocked/user', authentication, unblockedUserController);
router.post('/create/Reports', authentication, createReportController);
router.delete('/delete/image', authentication, removeImages);
router.post('/add/image', authentication, upload.single('image'), addImageController);
router.put('/replace/image', authentication, upload.single('image'), replaceImageController);
router.post('/like/action', authentication, LikeActionController);
router.get('/popular/action', authentication, popularActionController);
router.get('/new/users', authentication, newUsersController);
router.get('/nearBy/users', authentication, nearByUsersController);
router.put('/discovery/setting',authentication,discoverySettingController);
router.get('/send/email',authentication,sendEmailController);
router.get('/update/email',updateEmailController);



module.exports = router;