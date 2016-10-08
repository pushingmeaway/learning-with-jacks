const http = require("http")
const director = require("director")
const nunjucks = require("nunjucks")

const router = new director.http.Router()
const env = nunjucks.configure("templates")

router.get("/", function() {
  this.res.end(env.render("home.html"))
})

router.get("/register", function() {
  this.res.end("register page")
})

router.get("/login", function() {
  this.res.end("login page")
})

const handle = function(req, res) {
  router.dispatch(req, res, function(err) {
    if (err) {
      res.writeHead(404)
      res.end()
    }
  })
}

const server = http.createServer(handle)
const port = 8080

server.listen(port, function() {
  console.log("Server listening on http://127.0.0.1:%s", port)
})
