if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}


const express=require("express");
const app=express();
const path=require("path");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User = require('./models/user');
const dbUrl=process.env.ATLAS_DB_URL;


const store= MongoStore.create({ mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
 })

store.on("error",()=>{
  console.log("Error in session store",err);
});


const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expiry:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
  httpOnly:true}
};




// app.get("/",(req,res)=>{res.send("Hii I am a root");});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.curruser = req.user;
  next();});


// app.get("/demouser",async(req,res)=>{
//   let fakeuser=new User({
//     username:"demouser",
//     email:"demouser@gmail.com",
//   });
//   let newUser=await User.register(fakeuser,"demopassword");
//   res.send(newUser);
// })




const methodOverride=require("method-override");
app.use(methodOverride("_method"));
const mongoose=require("mongoose");
main().then(()=> console.log("connected to db")).catch(err => console.log(err));
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


const ExpressError=require("./utils/ExpressError.js");




//require all listing routes
const listingRoutes=require("./routes/listingroutes.js");


// require all review routes
const reviewRoutes=require("./routes/reviewroutes.js");


//require all user routes
const userRoutes=require("./routes/userroutes.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
//  app.get("/testlisting",async(req,res)=>{
//     // let samplelisting=new Listing({
//     //     title:"My NEW VILLA",
//     //     description:"It is a fully renovated home",
//     //     price:120000,
//     //     location:"Gurgaon , Delhi",
//     //     country:"India"
//     // });
// // await samplelisting.save();
// res.send("listing saved");
// console.log("Data is saved");

// })


//use all listing routes
app.use("/listings",listingRoutes);

//use all  review routes
app.use("/listings/:id/reviews",reviewRoutes);

//use all user routes
app.use("/",userRoutes);

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
  let {status=500,message="SOMETHING GONE WRONG"}=err;
  // res.status(status).send(message);
  if(status==404){
    res.status(status).render("listings/pagenotfound.ejs");
  }
  else{
  res.status(status).render("listings/error.ejs",{message});}

});


async function main() {

  await mongoose.connect(dbUrl);

};


app.listen(3000,()=>{
    console.log("Server is running on port 3000")});

