const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Création du serveur Express
const app = express();

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
app.listen(3000, () => {
    console.log("Serveur démarré ( http://localhost:3000/ ) !");
});

// // GET /
// app.get("/", (req, res) => {
//   // res.send("Bonjour le monde...");
//   res.render("index");
// });

// GET /about
app.get("/about", (req, res) => {
  res.render("about");
});

// GET /data
app.get("/data", (req, res) => {
  const test = {
    titre: "Test",
    items: ["un", "deux", "trois"]
  };
  res.render("data", { model: test });
});

const { Sequelize } = require('sequelize');

// Option 1: Passing a connection URI
const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite



// GET /MUSINSAs data
// app.get("/", (req, res) => {
//   const sql = "SELECT * FROM all_3 where category = 'https://search.musinsa.com/category/001001?device=&d_cat_cd=001001&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC" ;
 
//   db.all(sql, [], (err, rows) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     res.render("base", { hoodies: rows });
//   });
// });

app.get(["/","/:month"], (req, res) => {
  var sql = "SELECT * FROM all_3 WHERE category = 'https://search.musinsa.com/category/001001?device=&d_cat_cd=001001&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC" ;
  
  var id = req.params.month;
  console.log(id)
  if(id){
    var sql = 'SELECT * FROM all_3 WHERE date = ?' + "AND category = 'https://search.musinsa.com/category/001001?device=&d_cat_cd=001001&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC";
    db.all(sql, [id], (err, rows) => {//[id] : 사용자로부터 받은 id
      if(err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log("야야야야")
        rows.forEach((row) => {
          console.log(row.id);

        });
        res.render('base', { hoodies: rows });
      }
    });
  }else { 
   
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("base", { hoodies: rows });
  });
}

});


// app.post("/search", (req, res) => {
//   var str = {
//     month: req.body.month
//   }
//   db.query('SELECT * FROM all_3  WHERE date ='+ str.month + "AND category = 'https://search.musinsa.com/category/001001?device=&d_cat_cd=001001&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC", function(err, rows, fields){
//   if (err) throw err;
//   var data = [];
//   for(i=0;i<rows.length;i++)
//         {
//             data.push(rows[i]);
//         }
//         res.render("base", { hoodies: data });

// });
// });

app.get("/003007", (req, res) => {
  const sql = "SELECT * FROM all_3 WHERE category = 'https://search.musinsa.com/category/003007?device=&d_cat_cd=003007&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC" ;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("003007", { hoodies: rows });
  });
});

app.get("/003009", (req, res) => {
  const sql = "SELECT * FROM all_3 WHERE category = 'https://search.musinsa.com/category/003009?device=&d_cat_cd=003009&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC" ;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("003009", { hoodies: rows });
  });
});



app.get("/003004", (req, res) => {
  const sql = "SELECT * FROM all_3 WHERE category = 'https://search.musinsa.com/category/003004?device=&d_cat_cd=003004&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC" ;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("003004", { hoodies: rows });
  });
});

i = 001010;
app.get("/001010", (req, res) => {
  const sql = "SELECT * FROM all_3 WHERE category = 'https://search.musinsa.com/category/001010?device=&d_cat_cd=001010&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC" ;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("001010", { hoodies: rows });
  });
});

app.get("/001005", (req, res) => {
  const sql = "SELECT * FROM all_3 WHERE category = 'https://search.musinsa.com/category/001005?device=&d_cat_cd=001005&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC" ;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("001005", { hoodies: rows });
  });
});

app.get("/001004", (req, res) => {
  const sql = "SELECT * FROM all_3 WHERE category = 'https://search.musinsa.com/category/001004?device=&d_cat_cd=001004&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC" ;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("001004", { hoodies: rows });
  });
});

app.get("/001006", (req, res) => {
  const sql = "SELECT * FROM all_3 WHERE category = 'https://search.musinsa.com/category/001006?device=&d_cat_cd=001006&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC" ;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("001006", { hoodies: rows });
  });
});

app.get("/002022", (req, res) => {
  const sql = "SELECT * FROM all_3 WHERE category = 'https://search.musinsa.com/category/002022?device=&d_cat_cd=002022&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC" ;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("002022", { hoodies: rows });
  });
});

app.get("/002020", (req, res) => {
  const sql = "SELECT * FROM all_3 WHERE category = 'https://search.musinsa.com/category/002020?device=&d_cat_cd=002020&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC" ;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("002020", { hoodies: rows });
  });
});

app.get("/002023", (req, res) => {
  const sql = "SELECT * FROM all_3 WHERE category = 'https://search.musinsa.com/category/002023?device=&d_cat_cd=002023&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC" ;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("002023", { hoodies: rows });
  });
});

app.get("/002018", (req, res) => {
  const sql = "SELECT * FROM all_3 WHERE category = 'https://search.musinsa.com/category/002018?device=&d_cat_cd=002018&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC" ;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("002018", { hoodies: rows });
  });
});

app.get("/002015", (req, res) => {
  const sql = "SELECT * FROM all_3 WHERE category = 'https://search.musinsa.com/category/002015?device=&d_cat_cd=002015&brand=&rate=&page_kind=search&list_kind=small&sort=sale_high&sub_sort=1y&page=1&display_cnt=90&sale_goods=&ex_soldout=&color=&price1=&price2=&exclusive_yn=&size=&tags=&sale_campaign_yn=&timesale_yn=&q=' ORDER BY sales_qty DESC" ;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("002015", { hoodies: rows });
  });
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

