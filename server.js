const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require("fs");
var cors = require('cors');


const dburl = 'mongodb://doo:sexyboy@3.38.210.234:27017/doodb?authMechanism=DEFAULT&authSource=doodb';

mongoose
    .connect(dburl)
    .then(() => console.log('MongoDB connection is made.'))
    .catch((err) => console.log(err));

const app = express();
const port = 3000;
//이미지 업로드 관련
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'krpano/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg');
    }
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
    //console.log(req.file);
    return res.send(req.file);
});
//이미지 업로드 관련

app.use('/', express.static(path.join(__dirname, './krpano'), { index: 'tour.html' }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/tourtest', (req, res) => {
    console.log('get')
    //return res.send('Hi');

    //res.sendFile(path.join(__dirname, '/tour.html'));
});



const userRouter = require('./routes/users.js');
app.use('/users', userRouter);

const xmldataRouter = require('./routes/xmldatas.js');
app.use('/xmldatas', xmldataRouter);

app.listen(port, () => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    console.log(`Server listening on port ${port}`);
});