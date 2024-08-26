const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./Utils/wrapAsync.js");

const path = require("path");
const review = require("./models/review.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./Router/userRouter.js");
const {isLoggedIn, isOwner,validateListing, validateReview,isReviewAuthor } = require("./Middilware.js")


const listingController = require("./Controller/listing.js");
const reviewController = require("./controller/reviews.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

main()
    .then(() => {
        console.log("data base connected");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

};


app.get("/", (req, res) => {
    res.send("server is working");
});

const sessionOptions = {
    secret:"Mysupersecretcode",
    resave:false,
    saveUnintialized: true,
    cookie:
    {
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // A web application needs ability to identify users as they browsing from page to page
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>
{
    res.locals.success = req.flash("Success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// index Route
app.get("/listings", wrapAsync(listingController.index));

// new Route
app.get("/listings/new",isLoggedIn, listingController.renderNewForm);

// show Route
app.get("/listings/:id", wrapAsync(listingController.showListing));

// create route
app.post("/listings",isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// Edit Route

app.get("/listings/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

//update Route
app.put("/listings/:id",isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing));

// delete Route

app.delete("/listings/:id",isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));




// review
// post route
app.post("/listings/:id/reviews",isLoggedIn,  wrapAsync(reviewController.createReviw));

// Delete review route
app.delete("/listings/:id/reviews/:reviewId",isLoggedIn ,isReviewAuthor, wrapAsync(reviewController.deleteReview));

app.use("/",userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});
app.listen(8080, () => {
    console.log("server is listing at port 8080");
});

