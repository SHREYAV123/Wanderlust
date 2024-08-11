const Listing=require("./models/listing");
const {listingSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/review.js")

module.exports.isLoggedin=(req,res,next)=>{
    if(req.isAuthenticated()){

        next();
        }else{
            req.session.redirectUrl=req.originalUrl;
            req.flash("error","You must be logged in to do that");
            res.redirect('/login');
            }
}



module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curruser._id)){
    req.flash("error","You Don't Have A Permission To Make Changes");
   return res.redirect(`/listings/${id}`);}
   next();
};
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
}


module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
  let errmsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmsg);}
    else next(); 
  }
  

  module.exports.isReviewAuthor=async(req,res,next)=>{
    let {reviewId , id}=req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curruser._id)){
    req.flash("error","You Are Not The Author Of This Review");
   return res.redirect(`/listings/${id}`);}
   next();
};