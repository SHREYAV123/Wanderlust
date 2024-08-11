const Review=require("../models/review.js");
const Listing=require("../models/listing.js");


//post

module.exports.createReview=async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log("new review saved")
    // res.send("new review saved");
    req.flash("success","NEW REVIEW CREATED!");
    res.redirect(`/listings/${req.params.id}`);
    }



//delete

module.exports.deleteReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let review=await Review.findByIdAndDelete(req.params.reviewId);
    listing.reviews.pull(review);
    await listing.save();
    req.flash("success","REVIEW DELETED!");
    res.redirect(`/listings/${req.params.id}`
      )}