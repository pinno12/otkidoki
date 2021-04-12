const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Création du serveur Express
const app = express();
// const nunjucks = require('nunjucks');
// nunjucks.configure('views', {
//   autoescape: true,
//   express: app
// });

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

 app.get("/", function (req, res) {
  res.redirect("/002018/2104");
 });
 app.get("/:category/:month", (req, res) => {
  
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
       
        res.render('base', { hoodies: rows, months:months });
      }    
    });
  }else {    
    res.status(500).send('Internal Server Error');
  }
});



// GET /create
app.get("/create", (req, res) => {
  res.render("create", { model: {} });
});

// POST /create
app.post("/create", (req, res) => {
  const sql = "INSERT INTO Livres (Titre, Auteur, Commentaires) VALUES (?, ?, ?)";
  const book = [req.body.Titre, req.body.Auteur, req.body.Commentaires];
  db.run(sql, book, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});

// GET /edit/5
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Livres WHERE Livre_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("edit", { model: row });
  });
});

// POST /edit/5
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const book = [req.body.Titre, req.body.Auteur, req.body.Commentaires, id];
  const sql = "UPDATE Livres SET Titre = ?, Auteur = ?, Commentaires = ? WHERE (Livre_ID = ?)";
  db.run(sql, book, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});

// GET /delete/5
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Livres WHERE Livre_ID = ?";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("delete", { model: row });
  });
});

// POST /delete/5
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Livres WHERE Livre_ID = ?";
  db.run(sql, id, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});

