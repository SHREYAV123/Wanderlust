const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const {saveRedirectUrl}=require("../middleware.js")


const passport = require("passport");

const userController=require("../controller/usercontroller.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}),wrapAsync(userController.login));



router.get("/logout",userController.logout);



module.exports=router;