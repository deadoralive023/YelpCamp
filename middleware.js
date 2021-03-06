const { campgroundSchema, reviewSchema}  = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    console.log('isLoggedIn')
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if ( error ) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

 module.exports.isAuthor = async (req, res, next) => {
    console.log('isAuthor')
    const { id } = req.params;
    const camp = await campground.findById(id);
    const user_id = res.locals.currentUser._id;
    if(!camp.author.equals(user_id)){
        req.flash('error', "You don't have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
 }

 module.exports.validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if ( error ) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id,  reviewId } = req.params;
    const camp = await Review.findById(reviewId);
    if(!review.author.equals(id)){
        req.flash('error', "You don't have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
 }


