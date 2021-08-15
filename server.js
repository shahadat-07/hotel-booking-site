const path = require("path");
const express = require('express');
const app = express();
const expbs = require('express-handlebars');
const routes = require("./routes/routes");
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const RoomListing = require('./models/roomListing')
const PORT = process.env.PORT || 8080;
const UPLOAD_FOLDER = "./uploads";
const multer = require('multer')
const flash = require('express-flash');



app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static('public'));
app.use(bodyParser.json())

//MongoDB databse setup with mongoose

mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then((result) => console.log("Database Connected Successfully"))
    .catch((err) => console.log(err.message));

app.engine(
    'handlebars', expbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Routes
app.use(routes);
app.use(express.static('./uploads'));

//prepare the final multer upload object

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
            .replace(fileExt, "")
            .toLowerCase()
            .split(" ")
            .join("-") + "-" + Date.now()
        cb(null, fileName + fileExt);
    }
});

var upload = multer({
    storage: storage
    // fileFilter:(req,file,cb)=>{
    // 	if(file.mimetype == "image.png" ||
    // 	file.mimetype == "image.jpg" ||
    // 	file.mimetype == "image.jpeg" 
    // 	){
    // 		cb(null,true);
    // 	}else {
    // 		cb(new Error("Only jpg,png jpeg format allowed"));
    // 	}
    // }
})

app.post('/add', upload.single('image'), async (req, res) => {
    const newRoom = new RoomListing({
        roomTitle: req.body.roomTitle,
        location: req.body.location,
        costPerNight: req.body.costPerNight,
        description: req.body.description,
        image: req.file.filename

    })

    try {
        newRoom.save();

        res.redirect('/add_new');
    } catch (error) {
        console.log(error);
    }

})
//prepare the final multer upload object End
// app.get('/hi',(req,res) => {
//     res.render('updateSingleHotel')
// })





// Error Handle
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
