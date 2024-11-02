const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const Aiuser = require("./Model/aiModel.js");
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const path = require("path");

const Review = require("./Model/review.js");

const reviewController = require("./controller/review.js");
// Middleware 
app.use(express.static(path.join(__dirname, "PUBLIC")));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

//use of ejs-mate (for boilarplate) 
engine = require("ejs-mate");
app.engine("ejs", engine);
  

//for error handelar
const ExpressError = require("./utils/ExpressError.js");

//for async function only error handler   // to khali wrapAsync(async (req,res)=>{...like...})
const wrapAsync = require("./utils/wrapAsync.js");

  
//passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Model/user.js");
const { isLoggedIn} = require("./middleware.js");
  
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Hackathon');
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
    }
}

main();
//session 
const session = require('express-session');
const flash = require('connect-flash');
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUnitialized: true,
    Cookie: {
        express: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
app.use(session(sessionOptions));
app.use(flash());
  
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//pasport route
  
const userRouter = require("./routes/user.js");
app.use("/", userRouter);

//home page route
app.get("/therapist",(req,res)=>{
    res.render("Therapist/homepage.ejs");
});
// For Gemini call route
app.get("/therapist/chatboat",isLoggedIn, (req, res) => {
    res.render("Therapist/chatboat.ejs");
});

//Api Routes for gemini
app.use('/', apiRoutes);

// I was try to connect ML model with frontend but due to time constrate and some problem ,It has some issue 


// app.get("/form",isLoggedIn, (req, res) => {
//     if (!req.isAuthenticated()) {
//         return res.redirect('/login');  
//     }
//     res.render("Therapist/form.ejs");
// });

// app.post("/form",isLoggedIn,async (req,res)=>{

//     let formInfo = req.body.Patient;
//     let newData = new Aiuser(formInfo);
//     newData.author = req.user._id; 
//     await newData.save();
//     res.render("Therapist/yourCompanion.ejs");
// });

// router.post('/get-recommendations', async (req, res) => {
//     try {
//         const userInput = req.body;  // Data sent from the frontend

//         // Send POST request to Flask API
//         const response = await axios.post('http://127.0.0.1:5000/recommend', userInput, {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         // Send response data back to frontend
//         res.json(response.data);
//     } catch (error) {
//         console.error("Error in recommendation route:", error);
//         res.status(500).json({ message: "Error fetching recommendations" });
//     }
// });
//reviwes testing
app.get("/review",isLoggedIn,wrapAsync( async (req,res)=>{
    let allreviews = await Review.find({}).populate("author");;
    
    res.render("review.ejs", {allreviews});
}));
//add review
app.post("/review/2nd_page",isLoggedIn, wrapAsync(reviewController.reviewListing));

//reviews deletes
app.delete("/review/:revId", isLoggedIn, wrapAsync(reviewController.deleteReview));

//for all randam path
app.use("*",(req, res, next) => {
    next(new ExpressError(404, "Page not found!"));

});

// Error handler 
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080,()=>{
    console.log("app is listening on port 8080");
});