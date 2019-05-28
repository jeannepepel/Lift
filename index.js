const express = require('express');
const exphbs  = require('express-handlebars');
const multer  = require('multer');


const app = express();
const upload = multer({ dest: 'uploads/' });
app.engine('hbs', exphbs({defaultLayout: 'main.hbs'}));
app.set('view engine', 'hbs');
app.use(express.urlencoded());

const port = 4000;

app.get("/signupCie/", (req, res)=>res.render("signupCie"));

app.post("/signupCie/", (req, res)=>{
  playerName = req.body.playerName;
  dumbComputer = req.body.dumbComputer;

  res.send("OK, "+ req.body.playerName);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
