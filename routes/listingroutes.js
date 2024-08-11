const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync.js");


const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


//for joi validation listing,review

const {isLoggedin}=require("../middleware.js");
const {isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controller/listingcontroller.js");



router.route("/")

//INDEX ROUTE
.get(wrapAsync(listingController.index) )

 // CREATE ROUTE
.post(upload.single("listing[image][url]"),validateListing,isLoggedin,wrapAsync(listingController.createListing));


//NEW ROUTE
router.get("/new",isLoggedin,wrapAsync(listingController.newForm));
  
 
  router.route("/:id").

   //SHOW ROUTE
  get(wrapAsync(listingController.showListing))
  
   // UPDATE ROUTE
   .put(isLoggedin,isOwner,upload.single("listing[image][url]"),validateListing,wrapAsync(listingController.updateListing))
  
   // DELETE ROUTE
   .delete(isLoggedin,isOwner,wrapAsync(listingController.deleteListing));

 


  // EDIT ROUTE
  router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.editListing));
  

 
  
  
  module.exports=router;