
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require('express-session')
const hbs = require('express-handlebars')
const localStrategy = require('passport-local')
const mongoose  = require('mongoose')

var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/node-auth-yt",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    passowrd: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema)

//middleware
app.engine('hbs', hbs.engine({ extname: '.hbs'}))
app.set('view engine', 'hbs')

app.use(express.static(__dirname + '/public'))
app.use(session({
    secret: "123456",
    resave: false,
    saveUninitialized: true
}))
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

//passport.js
app.use(passport.initialize())
passport.use(passport.session())

passport.serializeUser(function (user, done){
    done(null, user.id)
})

passport.deserializeUser(function (id, done){
    //model
User.findById(id, function (err, user){
    done(err,user)
})
})

passport.use(new localStrategy(function (username, password, done){
User.findOne({ username: username }, function (err, user){
    if (err) return done(err)  
    if (!user)  return done(null, false, { message: 'Incorrect username.'})
    
    bcrypt.compare(password, user.password, function (err, res){
        if (err) return done(err)

        if (res == false) return done(null, false, { message: 'Incorrect password.'})

        return done(null, user)
    })
})
}))

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) return next()
    res.redirect('/login')
}

function isLoggedOut(req, res, next){
    if (!req.isAuthenticated()) return next()
    res.redirect('/')
}
//route

app.get('/', isLoggedIn, (req, res) => {
    res.render("index", {title: "Home"})
})
app.get('/chat', (req, res) => {
    res.render("chat", {title: "Chat"})
})
app.get('/login', isLoggedOut, (req, res) => {
    const response = {
        title:"Login",
        error: req.query.error
    }
    res.render("login", response)
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error=true'
}))

app.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
})

//Setup our admin user
app.get('/setup', async (req,res) => {
    const exists = await User.exists({ username: "admin"})

    if (exists) {
        res.redirect('/login')
        return
    }


bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err)
    bcrypt.hash("pass", salt, function (err, hash) {
        if (err) return next(err)

        const newAdmin = new User({
            username: "admin",
            password: hash
        })

        newAdmin.save()
         res.redirect('/login')
    })
 })
})





app.listen(3000, () =>{
    console.log("listenning at port 3000")
})