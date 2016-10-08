const mysql = require("mysql")

const connection = mysql.createConnection({
  "host": "127.0.0.1",
  "user": "root",
  "password": "",
  "database": "learning-with-jacks",
})

connection.connect()

const queries = [
  `CREATE TABLE users (
    id int(11) unsigned NOT NULL AUTO_INCREMENT,
    email varchar(255) DEFAULT NULL,
    password varchar(255) DEFAULT NULL,
    segment varchar(255) DEFAULT NULL,
    bio text,
    created_at datetime DEFAULT NULL,
    updated_at datetime DEFAULT NULL,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8`,
]

queries.forEach(function(query) {
  connection.query(query)
})

connection.end()
