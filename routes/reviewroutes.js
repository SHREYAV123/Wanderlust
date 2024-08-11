const express=require("express");
const router=express.Router({mergeParams:true});

const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedin,isReviewAuthor}=require("../middleware.js");


const reviewController=require("../controller/reviewcontroller.js");



  
//review post route
router.post("/", isLoggedin,validateReview, wrapAsync(reviewController.createReview));
     
    
// review delete route
router.delete("/:reviewId",isLoggedin,isReviewAuthor, wrapAsync(reviewController.deleteReview));
      
module.exports=router;