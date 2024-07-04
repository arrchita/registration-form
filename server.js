const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
let dbo;

MongoClient.connect(url)
  .then((db) => {
    dbo = db.db("etp");

  })
  .catch((err) => {
    console.log('Failed...', err);
  });
 
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  }); 

app.post("/register", (req, res) => {
    var flag=0;
    const myobj={
        user_name:req.body.name,
        user_password:req.body.pwd,
        user_email:req.body.email
    }
  
    if (!myobj.user_name || !myobj.user_email || !myobj.user_password) //to check if all fields are non-empty
      { 
        console.log("one or more fields are empty");
        res.send("All fields are required. Click <a href='/'> here</a> to go back to register");
        flag=1;
      } 

    else if (myobj.user_password.length < 8) //checks if password entered is greater than 8 characters
      { 
      res.send("Password should be at least 8 characters long. click <a href='/'> here</a> to reregister");
      flag=1;
    } 

    if(flag==0) //proceed with insertion into db only if flag==0 and the conditions are met
    {
    dbo.collection("users").insertOne(myobj)
    .then(()=>{
        console.log("1 document inserted");
        res.send("Your data is stored! click <a href='/'> here</a> to store more data")
    })
    .catch((err)=>{
        console.log(err);
    })
    }

  });  

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });