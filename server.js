var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var multer  = require('multer');

// handle upload file
var storage = multer.diskStorage({
  destination: './static/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
  }
});

var upload = multer({ storage: storage });

// create database connection
var connection =  mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password: '1234',
    database: 'ems-db'
});
connection.connect(function(err) {
    if (!err)  {
        console.log("Database is connected...");
    } else {
        console.log("Error connecting database...");
        console.log(err);
    }
});

var app = express();
app.use(favicon(path.join(__dirname, 'static/image', 'favicon-16x16.png')));
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '/static')));
app.post('/saveimage', upload.single('file'), function(req,res,next){
    //console.log('Uploade Successful');
    //console.log('file : ', req.file);
    res.json({filename : req.file.filename});
});

var router = express.Router();
router.use(function(req, res, next) {
    // do logging
    console.log('Server running ' + req.url);
    next(); // make sure we go to the next routes and don't stop here
});

// get all employees (accessed at GET http://localhost:8080/employees)
router.get('/', function(req, res) {
    let sql = "SELECT E1.*, E2.name manager_name, E3.reports "+
              "FROM `ems-db`.employees E1 "+
              "LEFT JOIN (SELECT id, name FROM `ems-db`.employees) E2 "+
              "ON E1.manager_id = E2.id "+
              "LEFT JOIN "+
              "(SELECT manager_id, COUNT(manager_id) reports FROM `ems-db`.employees "+
              "GROUP BY manager_id ) E3 "+
              "ON E1.id = E3.manager_id";
    connection.query(sql, (err, rows, fields) => {
        if (!err)  {
            res.json(rows);
        } else {
            console.log("Get all employees failed...");
            console.log(err);
            res.status(400).send("Failed get employees...");
        }
      }
    );
});

// get all managers (accessed at GET http://localhost:8080/employees/managers)
router.get('/managers', function(req, res) {
    let sql = "SELECT id, name FROM employees";
    connection.query(sql, (err, rows, fields) => {
      if (!err)  {
          res.json(rows);
      } else {
          console.log("Get all managers failed...");
          console.log(err);
          res.status(400).send({message : "Failed get managers..."});
      }
    });
});

// get employee by id (accessed at GET http://localhost:8080/employees/:employee_id)
router.get('/:employee_id', function(req, res) {
    var sql = "SELECT E1.*, E2.name manager_name, E3.reports FROM "+
              "(SELECT * FROM employees WHERE id = ?) E1 "+
              "LEFT JOIN "+
              "(SELECT id, name FROM employees) E2 "+
              "ON E1.manager_id = E2.id "+
              "LEFT JOIN "+
              "(SELECT manager_id, COUNT(manager_id) reports FROM employees GROUP BY manager_id ) E3 "+
              "ON E1.id = E3.manager_id";
    connection.query(sql, [req.params.employee_id], (err, rows, fields) => {
        if (err) {
            console.log(err);
            res.status(400).send("employee not found");
        }
        else  {
            // database return objects array
            if (!rows.length) {
                res.status(400).send("employee not found");
            } else {
                //console.log(rows[0]);
                res.json(rows[0]);
            }
        }
    });
});

// get direct report employees by manager_id (accessed at GET http://localhost:8080/employees/reports/:manager_id)
router.get('/reports/:employee_id', function(req, res) {
    var sql = "SELECT E1.*, E2.name manager_name, E3.reports FROM "+
              "(SELECT * FROM `ems-db`.employees WHERE manager_id = ?) E1 "+
              "LEFT JOIN "+
              "(SELECT id, name FROM `ems-db`.employees) E2 "+
              "ON E1.manager_id = E2.id "+
              "LEFT JOIN "+
              "(SELECT manager_id, COUNT(manager_id) reports FROM `ems-db`.employees "+
              "GROUP BY manager_id ) E3 "+
              "ON E1.id = E3.manager_id";
    connection.query(sql, [req.params.employee_id], (err, rows, fields) => {
        if (err) {
            console.log(err);
            res.status(400).send("employee not found");
        }
        else  {
            res.json(rows);
        }
    });
});

// create employee (accessed at POST http://localhost:8080/employees)
router.post('/', function(req, res) {
    /*
    console.log("new employee :");
    console.log(req.body);
    */
    var sql = "INSERT INTO employees SET ?";
    connection.query(sql, [req.body], (err, result) => {
        if (!err) {
            //console.log("Successed adding new employee, id " + result.insertId);
            res.send("Add new employee success...");
        } else {
            console.log(err);
            res.status(400).send("Failed adding new employee...");
        }
    });
});

// update employee by id (accessed at PUT http://localhost:8080/employees/:employee_id)
router.put('/:employee_id', function(req, res) {
    var sql = "UPDATE employees SET ? Where id = ?";
    connection.query(sql, [req.body, req.params.employee_id], (err, result) => {
        if (err)  {
            console.log(err);
            res.status(400).send(err);
        } else {
            //console.log(result);
            res.send("Updating employee success...");
        }
    });
});

// delete employee by id (accessed at DELETE http://localhost:8080/employees/:employee_id)
router.delete('/:employee_id', function(req, res) {
    var sql = "DELETE FROM employees WHERE id = ?";
    connection.query(sql, [req.params.employee_id], (err, result) => {
        if (err)  {
            console.log(err);
            res.status(400).send(err);
        } else {
            //console.log(result);
            if (!result.affectedRows) {
                //console.log("nothing deleted");
                res.status(400).send("employee not found");
            } else {
                //console.log("deleted...");
                res.send("Delete employee success...");
            }
        }
    });
});

app.use('/employees', router);

app.listen(port, function() {
    console.log('Server started at port ' + port);
});