const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
var cors = require('cors');


const dburl = 'mongodb://doo:sexyboy@3.38.210.234:27017/doodb?authMechanism=DEFAULT&authSource=doodb';

mongoose
    .connect(dburl)
    .then(() => console.log('MongoDB connection is made.'))
    .catch((err) => console.log(err));

const app = express();
const port = 3000;

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
    console.log(`Server listening on port ${port}`);
});