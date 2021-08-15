# Hotel Booking Website

 * This application is structured according to the MVC Design pattern.
 * All sensitive credential information is stored in environment variables.
 * All back-end functionality is done using Node JS and Express JS.
 * Views are created with Express-Handlebars.

## Features Of The Project
 * This is a hotel booking website. A user can see all existing hotels and book them according to their needs.
* A user need to be registered for accessing all features of the application.
* When a user fills out the registration form and then hits the submit button, provided that all the validation criteria were not
violated, this website will create a user account in database.
* Users will get a confirmation email after successful registration.
* A non-logged in user will be able to see all rooms and specific room details but will not be able to book a hotel.
* Visitors of the web application will be able to search for rooms via a location.
* Upon a successful authentication (entering a username and password pair that
exists in the database) a session will be created to maintain the user state until they logout of the application.
* A regular user will be directed to a user dashboard and an administrator will be
directed to an administrator dashboard.
* Users will get a confirmation email with all booking details after successfully booking rooms.

## Features Of The Admin
 An admin will be able to create a new hotel with an image, update a hotel and delete a hotel from the administrative dashboard

## Technology
Node Js, Express JS, Express Handlebars, Multer (Image Upload), bcrypt (Password Hashing), MongoDB, Mongoose

## How to Use This Project
* Clone this repository (VS Code Suggested) [Node JS should be installed]
* For Cloning Use This Command => git clone {link}
* After successfully cloned use the command => "npm install" for required packages which I have used in this project
* Then use this command "node server" for starting the project

If you have read this far I really appreciate it.

Do share your valuable opinion, I appreciate your honest feedback!

Enjoy Coding ❤
