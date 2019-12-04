const express = require('express')
const app = express()
const port = 3000

app.set('view engine','ejs');
app.set('views','./views');

app.use('/static', express.static('static'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); 

app.use('/uploads', express.static('uploads'));
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })	 

var _storage = multer.diskStorage({
 destination: function (req, file, cb) {
 cb(null, 'uploads/')
 },
 filename: function (req, file, cb) {
 cb(null, file.originalname);
 }
})
var upload = multer({ storage: _storage })

app.get('/', (req, res) =>{ 
    res.render('index')
})

app.get('/news', (req, res) => {
    //res.send('page ' + req.query.page);
    res.render('news')
   });

   app.get('/news/:category', (req, res) => {
    //res.send('category: '+ req.params.category +' / page ' + req.query.page);
   if (req.params.category == 'society') {
        res.render('news_society')

    } else if(req.params.category == 'economy') {
    res.render('news_economy')
    } else {
        res.send("카테고리 없음")
    }
   });

   app.get('/signup', (req, res) => {
    res.render('signup', {});
   });

   app.post('/signup-process', (req, res) => {
    res.render('signup_done', {
    'email': req.body.email,
    'fullname': req.body.fullname,
    'password': req.body.password
    });
   });
   
   app.get('/upload', (req, res) => {
    res.render('upload', {})
   });

   app.post('/upload', upload.single('userfile'), (req, res) => {
    res.render('upload_done', {
    'filename': req.file.filename
    });
   });

   var mysql = require('mysql');
   var conn = mysql.createConnection({ 
       host : 'localhost', user : 'root', 
       password : 'mysql', database : 'news' 
    });
   conn.connect();

app.get('/db-news', (req, res) => { var sql = 'SELECT * FROM article';
conn.query(sql, function(err, rows, fields){ if(err){ res.send(err);
} else { var output = "";
for(var i=0; i<rows.length; i++){
    output += "title: " + rows[i].title;
    output += " / author: " + rows[i].author +"\n";
} res.send(output);
} });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

