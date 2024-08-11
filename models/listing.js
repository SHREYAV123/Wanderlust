const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const Review=require("./review.js");


const listingSchema=new Schema({title:{type:String,
    required:true
},description:String,
//image:{
    // type:String,
    // default:"https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=",
    // set:(v)=> v===""?"https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=":v,
    image:{
        url: {
            type: String,
            default: "https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=",
            set: v => v === "" ? "https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=" : v
        },
filename:{
    type : String,
    },
},
// },
price:{
    type:Number,
},location:String,
country:String,
reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review",
},
],
owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
},
geometry: {
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
}

});



listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
}
});




const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;