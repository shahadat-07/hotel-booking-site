const express = require('express');
const router = express.Router();
const path = require("path");
const controllers = require('../controllers/controller');
const RoomListing = require('../models/roomListing')
const session = require('express-session')
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require('express-flash');



// Configure session Start
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        req.session.error = "You have to Login first";
        res.redirect("/login");
    }
};
const store = new MongoDBStore({
    uri: process.env.mongoURI,
    collection: "mySessions",
});
router.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store
})
);


router.use(flash());


// Configure session End


// -------------    Routing  ----------------------

// Home Page
router.get('/', controllers.home);

//Room Listing Page
router.get('/room', controllers.roomListing);

//User Registration Page
router.get('/registration', controllers.registration);

//register Page Routing
router.post('/api/register', controllers.register);

//Login Page Routing
router.post('/api/login', controllers.login);

//Send Mail Route
router.post("/sendemail", controllers.sendEmail);



//Log Out Functionality
router.post('/logout', controllers.logout);

//Add New page
router.get('/add_new', controllers.add_new);


//Header 
router.get('/header', controllers.header);

//Nav
router.get('/nav', controllers.nav);
//Login
router.get('/login', controllers.loginPage);
//CRUD => U => Update
router.get('/updatePage', controllers.updatePage);
// router.get('/update', controllers.update);


router.get('/torontoRoom', controllers.torontoRoom);
router.get('/victoriaRoom', controllers.victoriaRoom);
router.get('/hamiltonRoom', controllers.hamiltonRoom);

// Dashboard Page Routing
router.get('/dashboard', isAuth, controllers.dashboard);

//Regular Dashboard
router.get('/regularDashboard', isAuth , controllers.regularDashboard);

//Delete Route
router.delete("/delete/:id", controllers.delete);

//Update Data 
router.put("/updateData/:id", controllers.updateData);
//router.put('/update/:id',controllers.update)

// router.get('/letsUpdate/:id', (req, res) => {
//     RoomListing.findById(req.params.id, (err, roomList) => {
//         console.log('Hellllllllo', roomList)
//         if (!err) {
//             res.render("updateSingleHotel", {
//                 room: roomList
//             })
//         }
//     })
// })

router.get('/letsUpdate/:id',controllers.letsUpdate)

//hotel description page
router.get('/hotelDescription/:id', controllers.hotelDescription)

//successful page

router.get('/successful',  controllers.successful)

//bookingConfirmation mail
router.post('/bookingConfirm', isAuth, controllers.bookingConfirm)

module.exports = router;