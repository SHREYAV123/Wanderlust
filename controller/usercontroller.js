const User=require("../models/user.js");



module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}



module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}




module.exports.signup=async (req, res) => {
    let { username, email, password } = req.body;
    let user = new User({ username, email });
    
    try {
      const regUser = await User.register(user, password);
      console.log(regUser); // Logging the registered user
      req.login(regUser,(err)=>{
        if(err){
       return next(err);
          }
          req.flash("success","Welcome to Wanderlust ");
          res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }



module.exports.login=async(req,res)=>{
    req.flash("success","Welcome Back To Wanderlust!");
    res.redirect(res.locals.redirectUrl || "/listings");  
    
    }


module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    });
  }