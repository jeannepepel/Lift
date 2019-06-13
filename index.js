const express = require('express');
const exphbs  = require('express-handlebars');
const multer  = require('multer');
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

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

//credentials   lift / liftiscool


// FEED
app.get("/Feed/", (req, res)=>res.render("index",{style:'style.css'}));
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

// POST new Assoce profile PT1
app.post("/Add-Assoce/", (req, res) => {
  let Assoce = req.body.Company;
  let Email = req.body.Email;
  let Password = req.body.Password;
  let lastname = req.body.LastName;
  let firstname = req.body.FirstName;

  client.connect(err => {
    const collection = client.db("Lift").collection("Assoces");
    collection.insertOne({ Assoce_1: Assoce, Email_1: Email, Password_1: Password, First_Name_1: firstname, Last_Name_1:lastname }, function (err, obj) {
      res.redirect("/Assoces/SignUp2/");
    });
  });
});

//                                     PT2 of Assoce profile

// GET Signup page PT2
app.get("/Assoces/SignUp2/", (req, res)=>res.render("signupPt2"));

// POST new Assoce profile PT2
app.post("/Post-Profile/", (req, res) => {
  let Assoce = req.body.Company;
  let Email = req.body.Email;
  let Password = req.body.Password;
  let lastname = req.body.LastName;
  let firstname = req.body.FirstName;

  upload.single('profilepic')

  client.connect(err => {
    const collection = client.db("Lift").collection("Assoces");
    collection.insertOne({ Assoce_1: Assoce, Email_1: Email, Password_1: Password, First_Name_1: firstname, Last_Name_1:lastname }, function (err, obj) {
      res.redirect("/Feed/");
    });
  });

});


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
