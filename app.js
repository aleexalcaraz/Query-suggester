var express = require("express");
var app = express();
var mysql      = require('mysql');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
var columns = ["SELECT"];
var results = [];
var z = [];
var inputQuery = "";

var connection = mysql.createConnection({
  host     : process.env.IP || 'localhost',
  user     : process.env.C9_USER || 'alexjsisi',
  password : '',
  database : 'ProyectoFinal'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

connection.query("select * from information_schema.columns where table_schema = 'ProyectoFinal' order by table_name,ordinal_position", function (error, columns, fields) {
        if (error) throw error;
        else{
              z = columns;
        }
        
  });

app.get('/queries', function (req, res) {
  var cont = 0;
  var results = [];
  if(inputQuery != ""){
    connection.query(inputQuery, function (error, results, fields) {
            inputQuery = "";
            if (error) throw error;
            else{
                //console.log(inputQuery);
                res.render("index",{queries:z,queryResult:results});
            }
        });
  }
  else{
  connection.query("select * from information_schema.columns where table_schema = 'ProyectoFinal' order by table_name,ordinal_position", function (error, columns, fields) {
        if (error) throw error;
        else{
           //console.log(inputQuery);
           res.render("index",{queries:columns,queryResult:results});
        }
        
  });
}
    
});
app.post('/queries', function (req, res) {
    inputQuery = req.body.query;
    res.redirect("/queries");
    
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Se inicio proyecto");
});