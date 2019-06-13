const express = require('express');
const exphbs  = require('express-handlebars');
const multer  = require('multer');
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const uri = "mongodb+srv://lift:liftiscool@cluster0-4vzbn.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
//lift / liftiscool

const app = express();
const upload = multer({ dest: 'uploads/' });
app.engine('hbs', exphbs({defaultLayout: 'main.hbs'}));
app.set('view engine', 'hbs');
app.use(express.urlencoded());

const port = 8080;

app.get("/Assoces/SignUp/", (req, res)=>res.render("signup"));

app.get("/Assoces/SignUp/", (req, res) => {
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


app.post("/Assoces/SignUp/", (req, res) => {
  let studentname = req.body.studentname;
  let studentbid = req.body.studentbid;

  client.connect(err => {
    const collection = client.db("school").collection("students");
    collection.insertOne({ name: studentname, BID: studentbid }, function (err, obj) {
      res.redirect("/students/");
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
