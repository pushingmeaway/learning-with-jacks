const http = require("http")
const director = require("director")
const nunjucks = require("nunjucks")
const mysql = require("mysql")

const connection = mysql.createConnection({
  "host": "127.0.0.1",
  "user": "root",
  "password": "",
  "database": "learning-with-jacks",
})

connection.connect()

const router = new director.http.Router()
const env = nunjucks.configure("templates")

router.get("/", function() {
  this.res.end(env.render("home.html"))
})

router.get("/register", function() {
  this.res.end(env.render("register.html"))
})

const crypto = require("crypto")

router.post("/register", function() {
  // TODO: save user and redirect to profile

  const password = crypto.createHash("md5")
    .update(this.req.body.password)
    .digest("hex")

  const insertQuery =
    `INSERT INTO users (
        email,
        password,
        bio
      ) VALUES (
        "${this.req.body.email}",
        "${password}",
        "${this.req.body.bio}"
      )`

  connection.query(insertQuery)

  this.res.end("hello")
})

router.get("/profile/:segment", function() {
  this.res.end("profile page")
})

router.get("/login", function() {
  this.res.end("login page")
})

const handle = function(req, res) {
  req.chunks = [];

  req.on("data", function (chunk) {
    req.chunks.push(chunk.toString())
  })

  req.on("end", function() {
    router.dispatch(req, res, function(err) {
      if (err) {
        res.writeHead(404)
        res.end()
      }
    })
  })
}

const server = http.createServer(handle)
const port = 8080

server.listen(port, function() {
  console.log("Server listening on http://127.0.0.1:%s", port)
})
