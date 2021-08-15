const fetch = require('node-fetch');
const RoomListing = require('../models/roomListing')
const sendEmail = require("../utils/sendEmail");
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const flash = require('express-flash');

//const jwt = require('jsonwebtoken')
// const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjerkdffd'

// Update Page
exports.updatePage = async (req, res) => {
    RoomListing.find({}, function (err, rooms) {
        res.render('update', {
            roomList: rooms
        })
    })
}
//Filter Room By Search
exports.torontoRoom = async (req, res) => {
    RoomListing.find({ location: 'Toronto' }, function (err, rooms) {
        res.render('torontoRooms', {
            roomList: rooms
        })
    })
}
exports.victoriaRoom = async (req, res) => {
    await RoomListing.find({ location: 'Victoria' }, function (err, rooms) {
        res.render('victoriaRooms', {
            roomList: rooms
        })
    })
}
exports.hamiltonRoom = async (req, res) => {
    await RoomListing.find({ location: 'Hamilton' }, function (err, rooms) {
        res.render('hamiltonRooms', {
            roomList: rooms
        })
    })
}

//Home
exports.home = (req, res) => {
    res.render('index', { title: 'Home Page', style: 'index.css' });
}

// Registration Page
exports.registration = (req, res) => {
    res.render('registration', { title: 'User Registration', script: 'registration.js' });
}

//Room Listing Routing
exports.roomListing = async (req, res) => {
    RoomListing.find({}, function (err, rooms) {
        // console.log(rooms)
        res.render('room', {
            roomList: rooms,
            style: 'room.css'
        })
    })
}

exports.registerWithSendEmail = async (formValue) => {
    try {
        const result = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                formValue
            ),
        }).then((res) => res.json({ status: 'ok' }))
    }
    catch (err) {
        console.log('Shahadat Hossen', err)
    }
}

// Functionality of Send Mail and Registration
exports.sendEmail = (req, res) => {
    const { name, surname, email, password, role } = req.body;

    const from = "syedahsansirat07@gmail.com";
    const to = `${email}`;

    const subject = "Confirmation Mail ";

    const output = `
      <h4>Congratulations!!! Your Registration is Done.</h4>
    `;

    sendEmail(to, from, subject, output);

    this.registerWithSendEmail({
        email,
        password,
        role,
        name,
        surname
    });
    res.redirect("/dashboard");
}

//register Routing
exports.register = async (req, res) => {
    const { email, role, name, surname, password: plainTextPassword } = req.body
    const user = await User.findOne({ email: email });

    if (user) {
        console.log('Email Already Existed!!!')
        req.flash('error', 'Email Already Existed!');
    }

    if (!email || typeof email !== 'string') {
        return res.json({ status: 'error', error: 'Invalid Email' })
    }
    if (!role || typeof role !== 'string') {
        return res.json({ status: 'error', error: 'Invalid role' })
    }
    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' })
    }
    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
        const response = await User.create({
            email,
            password,
            role,
            name,
            surname
        })
        console.log('User created successfully')
    } catch (error) {
        if (error.code === 11000) {
            // duplicate key
            return res.json({ status: 'error', error: '' })
        }
        throw error
    }

    res.json({ status: 'ok' })
}

//Login Functionality
exports.login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }).lean()
    if (!user) {
        return res.json({ status: 'error', error: 'Sorry, you entered the wrong username and/or password' })
    }

    if (await bcrypt.compare(password, user.password)) {

        req.session.isAuth = true;

        return res.json({ status: 'ok', user: user })
    }
    res.json({ status: 'error', error: 'Sorry, you entered the wrong username and/or password' })
};
// Dashboard Page 
exports.dashboard = (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
}

// Log Out Functionality
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/login");
    });
}
// Header
exports.header = (req, res) => {
    res.render('header', { title: 'User Registration' });
}
// Nav
exports.nav = (req, res) => {
    res.render('nav', { title: '' });
}
// Nav
exports.loginPage = (req, res) => {
    res.render('login', { title: 'Login' });
}
// Add New Hotel Page
exports.add_new = (req, res) => {
    res.render('add_new', { title: 'Add New Hotel' });
}

//Regular Dashboard

exports.regularDashboard = (req, res) => {
    res.render('regularDashboard', { title: 'Dashboard' })
}

//Delete Route
exports.delete = async (req, res) => {
    console.log(req.params.id)
    await RoomListing.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(500).json({
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                message: "Hotel Details was deleted successfully!",
            });
        }
    });
};

exports.updateData = async (req, res) => {
    const { title, located, cost, brief } = req.body;
    //console.log(req.body)
    // console.log(req.params.id)

    const result = await RoomListing.findByIdAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                roomTitle: title,
                location: located,
                costPerNight: cost,
                description: brief
            },
        },
        {
            new: true,
            useFindAndModify: false,
        },
        (err) => {
            if (err) {
                res.status(500).json({
                    error: "There was a server side error!",
                });
            } else {
                return res.json({ status: 'ok' })
            }
        }
    );
}

exports.letsUpdate = (req, res) => {
    RoomListing.findById({ _id: req.params.id }, function (err, room) {
        //console.log(room)
        res.render('updateSingleHotel', {
            roomList: room
        })
    })
}

//hotel description page
exports.hotelDescription = (req, res) => {
    RoomListing.findById({ _id: req.params.id }, function (err, room) {
        //console.log(room)
        res.render('hotelDescription', {
            roomList: room
        })
    })
}

//successful page
exports.successful = (req, res) => {
    res.render('successfull', { title: 'Successful'});
}

// Functionality of Send Mail and Registration
exports.bookingConfirm = (req, res) => {
    const { start, end, totalDays, totalCost, user, name, hotelName} = req.body;
    const from = "syedahsansirat07@gmail.com";
    const to = `${user}`;

    const subject = "Booking Confirmation Mail ";

    const output = `

      <h2>Welcome  ${name}</h2>
      <h3>Your Booking is Confirmed</h3>
      <h3>Your Hotel Name is  ${hotelName}</h3>
      <h4> Your Booking is from  ${start}  to  ${end} </h4>
      <h4> Total Days of Bookings : ${totalDays} </h4>
      <h4>Your Total Bill is  ${totalCost}  CAD</h4>
    `;

    sendEmail(to, from, subject, output);

    res.redirect("/successful");
}