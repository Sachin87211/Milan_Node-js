
const loadAuth = (req, res) => {
    res.render('auth');
}
const successGoogleLogin = (req, res) => {
    if (!req.user) {
        return res.redirect('/failure'); // Redirect to failure route if user not authenticated
    }
    console.log(req.user); // Log the user profile information
    res.send("Welcome " + req.user.email); // Respond with a welcome message
}

const failureGoogleLogin = (req , res) => { 
	res.send("Error"); 
}

module.exports = {
    loadAuth,
    successGoogleLogin,
    failureGoogleLogin
}