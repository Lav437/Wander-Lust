
const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./Utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./Schema.js");
module.exports.isLoggedIn = (req,res,next)=>
{
    
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl = req.originalUrl; // req ak object hai jiske andar originalurl ka object hota hai jiske user clikc krege uska link store krta hai
        req.flash("error","You must be logged in to create listing");
            return res.redirect("/login")
    }
    next();
};


module.exports.saveRedirectUrl = (req,res,next)=>
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>
{
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currUser._id))
    {
        req.flash("error","Sorry,You are not the Owner!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.isReviewAuthor = async(req,res,next)=>
{
        let {id, reviewId } = req.params;
        let review = await Review.findById(reviewId);
    
        if(!review.author._id.equals(res.locals.currUser._id))
        {
            req.flash("error","Sorry,You are not the Author!");
            return res.redirect(`/listings/${id}`);
        }
        next();
};
