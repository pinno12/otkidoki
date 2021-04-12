const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Création du serveur Express

var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db2 = require('./models');


// Configure the local strategy for use by Passport.
//
// The local strategy requires a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    db2.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db2.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


const app = express();

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });



// Configuration du serveur
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// Connexion à la base de donnée SQlite
const db_name = path.join(__dirname, "data", "apptest.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connexion réussie à la base de données 'apptest.db'");
});

// Création de la table Livres (Livre_ID, Titre, Auteur, Commentaires)
const sql_create = `CREATE TABLE IF NOT EXISTS Livres (
  Livre_ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Titre VARCHAR(100) NOT NULL,
  Auteur VARCHAR(100) NOT NULL,
  Commentaires TEXT
);`;
db.run(sql_create, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Création réussie de la table 'Livres'");
  // Alimentation de la table
  const sql_insert = `INSERT INTO Livres (Livre_ID, Titre, Auteur, Commentaires) VALUES
  (1, 'Mrs. Bridge', 'Evan S. Connell', 'Premier de la série'),
  (2, 'Mr. Bridge', 'Evan S. Connell', 'Second de la série'),
  (3, 'L''ingénue libertine', 'Colette', 'Minne + Les égarements de Minne');`;
  db.run(sql_insert, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Alimentation réussie de la table 'Livres'");
  });
});

// Démarrage du serveur
app.listen(8080, () => {
    console.log("Serveur démarré ( http://localhost:8080/ ) !");
});


app.get("/", function (req, res) {
  res.redirect("/002018/2104");
 });


let months = [ 210315, 2104]


 app.get("/:category/:month",  require('connect-ensure-login').ensureLoggedIn(),(req, res) => {
  
  var category= req.params.category;
  var month = req.params.month;
  let now = 4;
     console.log('month:',month);
 
  if(category){
    db.all(`SELECT * FROM all_3 WHERE category = '${category}' AND date = '${month}' ORDER BY  sales_qty DESC, first_img`, (err, rows)  => {//[id] : 사용자로부터 받은 id
      if(err) {
        console.log(err);
        console.log(rows)
        res.status(500).send(err);
      } else {
       
        res.render('base', { hoodies: rows, months:months, user: req.user});
      }    
    });
  }else {    
    res.status(500).send('Internal Server Error');
  }
});

