
const mysql      = require('mysql2');
// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다. 
let db = mysql.createConnection({
    host     : 'otuku-do-user-8633915-0.b.db.ondigitalocean.com',
    port: '25060',
    user     : 'doadmin',
    password : 'jOtP74m1OqSGaRoa',
    database : 'defaultdb'
  });

  module.exports = db;