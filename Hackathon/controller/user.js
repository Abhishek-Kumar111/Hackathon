const User = require("../Model/user.js");

module.exports.renderSignupForm =(req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signupDone = async (req,res)=>{
    try{
        let {username, email, password} = req.body;
        let newUser = new User({email, username});
        let registeruser = await User.register(newUser,password);
        console.log(registeruser);
        req.login(registeruser,(err)=> {
            if (err) { return next(err); }
            req.flash("success","Wellcome to Mindbot!");
            res.redirect("/therapist");
          });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/form");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("user/login.ejs");
}

module.exports.loginDone = async(req,res)=>{
   req.flash("success","Wellcome back to MindBot!");
    let redirectUrl = res.locals.redirectUrl||"/therapist";// yanha / ke bad home page ka jo name hoga vah set karna
    res.redirect(redirectUrl);
}



module.exports.logoutDone = (req,res)=>{
    req.logout((err)=>{
        if(err){
            next();
        }
        else{
            req.flash("success","you are logged out!");
            res.redirect("/therapist"); // yanha / ke bad home page ka jo name hoga vah set karna
        }
    });
}