const http = require("http")
const director = require("director")
const nunjucks = require("nunjucks")
const mysql = require("mysql")
const crypto = require("crypto")

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

const randomNumber = function() {
    const randomHex = crypto.randomBytes(8).toString("hex")
    const randomFloat = ("0." + parseInt(randomHex, 16))

    return parseFloat(randomFloat.replace(/(^0)|(0$)/g, ""))
}

const randomIntBetween = function(min, max) {
  return Math.round(randomNumber() * (max - min) + min)
}

const randomSegment = function(then) {
  const segment = randomIntBetween(1, 1000000).toString(36)
  const query = `SELECT * FROM users WHERE segment = "${segment}"`

  connection.query(query, function(err, res) {
    if (res.length > 0) {
      return randomSegment(then)
    }

    return then(segment.toString(36))
  })
}

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

  connection.query(insertQuery, function(err, res) {
    const insertId = res.insertId

    randomSegment(function(segment) {
      const updateQuery =
        `UPDATE users SET segment = "${segment}" where id = ${insertId}`

      connection.query(updateQuery)
    })
  })

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
