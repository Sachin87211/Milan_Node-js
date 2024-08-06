const express = require('express');
const passport = require('passport');
require("../passport")
const { loadAuth, successGoogleLogin, failureGoogleLogin} = require("../controllers/authController")
const router = express.Router(); 
router.use(passport.initialize());
router.use(passport.session());  


router.get('/', loadAuth);
router.get('/auth/google' , passport.authenticate('google', { scope: 
	[ 'email', 'profile' ] 
})); 
router.get( '/auth/google/callback', 
	passport.authenticate( 'google', { 
		successRedirect: '/success', 
		failureRedirect: '/failure'
}));
router.get('/success' , successGoogleLogin); 
router.get('/failure' , failureGoogleLogin);

module.exports = router;