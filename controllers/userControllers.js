const jwt = require("../utils/jwt");
const bcrypt = require("../utils/bcrypt");
const _db = require("../config/db");
require("dotenv").config;

exports.getHomepage = (req, res) => {
  let token = req.cookies["accesstoken"];
  jwt.verify(token, process.env.jwt_secret, (err, user) => {
    if (err) {
      // Render the landing page if not logged in
      res.render("user/homepage.ejs");
    } else {
      res.redirect("/home");
    }
  });
};

exports.getSignupPage = (req, res) => {
  res.render("user/signup.ejs");
};

exports.getLoginPage = (req, res) => {
  res.render("user/login.ejs");
};

exports.signupUser = async (req, res) => {
  let entered_data = req.body;
  let db = _db.getDb();
  let { number, password, email } = entered_data;

  entered_data.password = bcrypt.hashPassword(password);
  entered_data.time_stamp = new Date().toGMTString();

  let number_in_db = await db.collection("users").findOne({ number });
  let mail_in_db = await db.collection("users").findOne({ email });

  if (number_in_db || mail_in_db) {
    res.send("Number or Email already exists.");
  } else {
    try {
      await db.collection("users").insertOne(entered_data);
      res.send("You are signed Up Now <a href='/login'>Login Here</a>");
    } catch (err) {
      console.log(err);
    }
  }
};

exports.loginUser = async (req, res) => {
  let body = req.body;
  let { email, password } = body;
  let db = _db.getDb();

  let data_in_db = await db.collection("users").findOne({ email });

  if (!data_in_db) {
    res.send("Email or password is wrong");
  } else {
    let password_in_db = data_in_db.password;
    let is_password_right = bcrypt.comparePassword(password, password_in_db);

    if (!is_password_right) {
      res.send("Email or password is wrong");
    } else {
      let access_token = jwt.sign({ email }, process.env.jwt_secret, {
        expiresIn: "5h",
      });
      res.cookie("accesstoken", access_token);
      console.log("User logged in");
      res.redirect("/home");
    }
  }
};

exports.getcontactUsPage = async (req, res) => {
  res.render("user/contactUs.ejs");
};

exports.submitcontact =  (req, res) => {
  let token = req.cookies["accesstoken"];
  let email = jwt.decode(token, process.env.jwt_secret).email;
  let message = req.body.message;
  let name = req.body.name;
  let data_to_insert_in_db = req.body;
  data_to_insert_in_db.name = name;
  data_to_insert_in_db.email = email;
  data_to_insert_in_db.message = message;

  let db = _db.getDb();
  db.collection("contact")
    .insertOne(data_to_insert_in_db)
    .then(() => {
      res.render("thank-you", { data_to_insert_in_db });
    })
    .catch((err) => {
      res.send("There is some error here");
    });
};
