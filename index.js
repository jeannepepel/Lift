const express = require('express');
const exphbs  = require('express-handlebars');
const multer  = require('multer');
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
/*
const cookieParser = require('cookie-parser');
const session = require('express-session')
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
*/
// Mongo const
const uri = "mongodb+srv://lift:liftiscool@cluster0-4vzbn.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

// Espress + multer for file upload + handlebars const
const app = express();
const upload = multer({ dest: 'uploads/' }); 
app.engine('hbs', exphbs({defaultLayout: 'main.hbs'}));
app.set('view engine', 'hbs');
app.use(express.urlencoded());

const port = 8080;

// checks connection to Mongo
MongoClient.connect(uri, function(err, client) {
  if(err) {
       console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
  }
  console.log('Connected...');
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

/*
// Create indexes in MongoDB
client.connect(err => {
  const collection = client.db("Lift").collection("Assoces");
  collection.createIndexes([
    {name:"profilepic",key:{profilepic:1}},
    {name:"nationality" ,key:{nationality:1}},
    {name:"language" ,key:{language:1}},
    {name:"activity" ,key:{activity:1}},
    {name:"size" ,key:{size:1}},
    {name:"location" ,key:{location:1}},
    {name:"causes" ,key:{causes:1}},
    {name:"about",key:{about:1}},
    {name:"website",key:{website:1}}
  ]);
})
*/

//credentials   lift / liftiscool

/*
// FEED
app.get("/Feed/", (req, res)=>res.render("index",{style:'style.css'}));
  app.use("/Feed/",express.static("Feed"));
*/

// FEEDv2


app.get("/Feed/", (req, res)=>{
  
  client.connect(err => {
    const collection = client.db("Lift").collection("Offers");
    collection.find().toArray(function(err, result){
      if (err) throw err;
      res.render("index",{result});
    });
 
    });
  });
  app.use("/Feed/",express.static("Feed"));


// APPLY
app.get("/Apply/", (req, res)=>res.render("apply",{style:'/Apply/apply.css'}));
  app.use("/Apply/",express.static("Apply"));



//  PROFILE
app.get("/Profile/", (req, res)=>res.render("profile",{style:'/Profile/profile.css'}));
  app.use("/Profile/",express.static("Profile"));

//               "I'm an organization" >  PT1 of Assoce profile

// GET Signup page
app.get("/Assoces/SignUp/", (req, res)=>res.render("signupPt1"));
  app.use("/Signup/",express.static("Signup"));

// POST new Assoce profile PT1
app.post("/Add-Assoce/", (req, res) => {
  let Assoce = req.body.Company;
  let Email = req.body.Email;
  let Password = req.body.Password;
  let lastname = req.body.LastName;
  let firstname = req.body.FirstName;
  let profilepic = req.body.profilepic;
  let nationality = req.body.nationality;
  let language = req.body.language;
  let activity = req.body.activity;
  let size = req.body.size;
  let location = req.body.location;
  let causes = req.body.causes;
  let about = req.body.about;
  let website = req.body.website;

  client.connect(err => {
    const collection = client.db("Lift").collection("Assoces");
    collection.insertOne(
      { Assoce_1: Assoce,
        Email_1: Email,
        Password_1: Password,
        First_Name_1: firstname,
        Last_Name_1:lastname,
        profilepic: profilepic , 
        nationality: nationality, 
        language: language,
        activity: activity,
        size: size,
        location: location,
        causes: causes,
        about: about,
        website: website 
      },
      function (err, obj) {
      // rediriger vers publish an offer
        res.redirect("/Feed/");
      }
    );
  });
});

//                                     NEW OFFER

// GET Add-offer page
app.get("/New-Offer/", (req, res)=>res.render("addoffer",{style:'/NewOffer/addoffer.css'}));
  app.use("/NewOffer/",express.static("NewOffer")); 

  // Post new offer
app.post("/Add-Offer/", (req, res) => {
  let Assoce = req.body.Organization;
  let Email = req.body.Email;
  let profilepic = req.body.profilepic;
  let description=req.body.Offer_Description

  client.connect(err => {
    const collection = client.db("Lift").collection("Offers");
    collection.insertOne(
      { Assoce_1: Assoce,
        email_1: Email,
        profilepic_1: profilepic , 
        desc_1: description
      },
      function (err, obj) {
      // rediriger vers publish an offer
        res.redirect("/Feed/");
      }
    );
  });
});

/*
//                                     PT2 of Assoce profile

// GET Signup page PT2
app.get("/Assoces/SignUp2/", (req, res)=>res.render("signupPt2"));


// POST new Assoce profile PT2
app.post("/Post-Profile/", (req, res) => {
  let profilepic = req.body.profilepic;
  let nationality = req.body.nationality;
  let language = req.body.language;
  let activity = req.body.activity;
  let size = req.body.size;
  let location = req.body.location;
  let causes = req.body.causes;
  let about = req.body.about;
  let website = req.body.website;

  upload.single('profilepic')

  client.connect(err => {
    const collection = client.db("Lift").collection("Assoces");
    collection.insertOne(
      { 
      profilepic: profilepic , 
      nationality: nationality, 
      language: language,
      activity: activity,
      size: size,
      location: location,
      causes: causes,
      about: about,
      website: website
     }, 
      function (err, obj) {
      res.redirect("/Feed/");
    });
  });

});
*/

/*
//                          USER SESSIONS          (What's the use ???)
mongoose.connect('mongodb://localhost/my-database', {
    useMongoClient: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection

app.use(cookieParser());
app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: db })
}));
*/


// Pas besoin de liste des Assoce, à transformer pour avoir une liste des OFFRES
app.get("/Offers/", (req, res) => {
  let search = req.query.search;
  let update = req.query.update;

  client.connect(err => {
    const collection = client.db("Lift").collection("Assoces");
    collection.find(search ? { name: { '$regex': search, '$options': 'i' } } : {}).toArray(function (err, result) {
      result = result.map(item => {
        if (item._id == update) {
          item.update = true;
        } else {
          item.update = false;
        }
        return item;
      });
      res.render("Assoces", { result, search });
    });
  });
});


app.post("/AssoceDelete/:id", (req, res) => {
  let id = req.params.id;

  client.connect(err => {
    const collection = client.db("sLift").collection("Assoces");
    collection.deleteOne({ _id: new mongodb.ObjectId(id) }, function (err, obj) {
      res.redirect("/Assoces/SignUp/");
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


/*

app.get("/students/", (req, res) => {
  let search = req.query.search;
  let update = req.query.update;

  client.connect(err => {
    const collection = client.db("school").collection("students");
    collection.find(search ? { name: { '$regex': search, '$options': 'i' } } : {}).toArray(function (err, result) {
      result = result.map(item => {
        if (item._id == update) {
          item.update = true;
        } else {
          item.update = false;
        }
        return item;
      });
      res.render("students", { result, search });
    });
  });
});





app.post("/studentsave/:id", (req, res) => {
  let id = req.params.id;
  let studentname = req.body.studentname;
  let studentbid = req.body.studentbid;
  let choice = req.body.choice;

  if (choice == "OK") {
    client.connect(err => {
      const collection = client.db("school").collection("students");
      collection.updateOne({ _id: new mongodb.ObjectId(id) },
        { $set: { name: studentname, BID: studentbid } }, function (err, obj) {
          res.redirect("/students/");
        });
    });
  } else {
    res.redirect("/students/");
  }
});

app.post("/studentupdate/:id", (req, res) => {
  res.redirect("/students/?update=" + req.params.id);
});

*/
