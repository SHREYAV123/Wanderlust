const Listing = require("../models/listing");
const opencage = require('opencage-api-client');
const apiKey= process.env.OPENCAGE_API_KEY;






//index
module.exports.index=async(req,res)=>{
    const allListings = await Listing.find({});
     res.render("listings/index.ejs",{allListings});
    }
    
//new
module.exports.newForm=async(req,res)=>{
    res.render("listings/new.ejs");
  }

//show
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{
      path:"author"
    },}).populate("owner");
    if(!listing){
      req.flash("error","LISTING DOES NOT EXIST!");
       res.redirect("/listings");}
    res.render("listings/show.ejs",{listing});
}


//create

module.exports.createListing = async (req, res) => {
  try {
      // Extract the address from req.body.listing
      const listingData = req.body.listing;
      const address = listingData.location; // Assuming 'location' contains the address

      // Check if the address is valid
      if (typeof address !== 'string') {
          throw new Error("Listing address must be a string");
      }

      // Get geocoding data
      let data = await opencage.geocode({ q: address, key: apiKey });
      let { lat, lng } = data.results[0].geometry;

      // Prepare image data
      let url = req.file.path;
      let filename = req.file.filename;

      // Create a new listing
      const newlisting = new Listing(listingData);
      newlisting.owner = req.user._id;
      newlisting.image = { url, filename };
      newlisting.geometry = {
          type: 'Point',
          coordinates: [lng, lat]
      };

      // Save the listing
      let savedListing = await newlisting.save();
      console.log(savedListing);
      req.flash("success", "NEW LISTING CREATED!");
      res.redirect("/listings");
  } catch (error) {
      req.flash("error", "Error creating listing");
      res.redirect("/listings");
  }
};


  //edit

module.exports.editListing=async(req,res)=>{
  
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error","LISTING DOES NOT EXIST!");
       res.redirect("/listings");}

    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload", "/upload/h_80,w_150");

    res.render('listings/edit.ejs',{listing, originalImageUrl});
     };

//update
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  if (!req.body.listing) {
      throw new ExpressError(400, "Invalid listing data");
  }

  // Get the updated listing data
  let updatedListingData = { ...req.body.listing };

  // If the location has changed, update coordinates
  if (updatedListingData.location) {
      try {
          // Check if the address is valid
          if (typeof updatedListingData.location !== 'string') {
              throw new Error("Listing address must be a string");
          }

          // Get geocoding data
          let data = await opencage.geocode({ q: updatedListingData.location, key: apiKey });
          let { lat, lng } = data.results[0].geometry;

          // Update the geometry field with new coordinates
          updatedListingData.geometry = {
              type: 'Point',
              coordinates: [lng, lat]
          };
      } catch (error) {
          req.flash("error", "Error updating location coordinates");
          return res.redirect(`/listings/${id}`);
      }
  }

  let listing = await Listing.findByIdAndUpdate(id, updatedListingData, { new: true });

  
  if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;

      listing.image = { url, filename };
      await listing.save();
  }

  req.flash("success", "LISTING UPDATED!");
  res.redirect(`/listings/${id}`);
}

//delete

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
   let deletinglist= await Listing.findByIdAndDelete(id);
   console.log(deletinglist);
   req.flash("success","LISTING DELETED!");
    res.redirect("/listings");}