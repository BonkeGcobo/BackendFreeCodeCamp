var express = require('express');
var cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any 
  MongoClient.connect(process.env.CONNECTION_STRING,(err, client)=>{
    if(err){
      console.log(err)
      return
    }
    const db = client.db('files-db')
    console.log(req.file)
    db.collection('files').insertOne({
      name:req.file.originalname,
      type:req.file.mimetype,
      size:req.file.size
    })
  })  
  res.json({"name":req.file.originalname,"type":req.file.mimetype,"size":req.file.size})
});




const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
