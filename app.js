const http = require('http');
const prompt = require('prompt-sync')();
const hostname = '127.0.0.1';
const port = 3000;
var ldap = require('ldapjs');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var ActiveDirectory = require('activedirectory');
var config = { url: 'ldap://dc.domain.com',
               baseDN: 'dc=domain,dc=com',
               username: 'username@domain.com',
               password: 'password' }
var ad = new ActiveDirectory(config);

//--------------------------------------------  Creating LDAP connection ------------------------------------
var client = ldap.createClient({
  url: 'ldap://127.0.0.1:10389'
});

function authenticateDN(username, password) {

  /*bind use for authentication*/
  client.bind(username, password, function (err) {
      if (err) {
          console.log("Error in new connetion " + err)
      } else {
          /*if connection is success then go for any operation*/
          console.log("Success");
          modifyDN('cn=bar,ou=users,ou=system');

      }
  });
}
  //----------------------------------------------- Connect to HTTP Server ------------------------------------------
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
});

// --------------------------------- Check wether User is in AD group CIRCUS_CHOREOGRAPH or not ----------------------
var UserName = prompt("Enter UserName");
var GroupName = "CIRCUS_CHOREOGRAPH"
ad.isUserMemberOf(UserName, GroupName, function(err, isMember) {
  if (err) {
    console.log("User is not in CIRCUS_CHOREOGRAPH Group");
    return;
  }

  //-----------------------------  API to store kangaroo position in Database --------------------------------------------------
  server.post('/userData', function (req, res) {
    var x1 = prompt("Enter position");
    var v1 = prompt("Enter velocity");
    var x2 = prompt("Enter position");
    var v2 = prompt("Enter velocity");
    var userData = { 
    "user_Data" : {
    "x1" : position,
    "v1" : velocity,
    "x2" : position,
    "v2" : velocity,
  }
  }
    data = JSON.parse( data );
    data["user_Data"] = userData["user_Data"];
    console.log( data );
    
  //---------------------------- Code to check the position where two Kangaroos at the same point ---------------------------------------
  let result = 'NO';
    for (let i = 0; i < 10000 && result == 'NO'; i++) {
        if (x1 + v1 * i == x2 + v2 * i) {
            result = 'YES';
            //------------------------------------- Connect to MongoDb Client----------------------------------------------
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("mydb");
                dbo.collection("users").insertOne(result);
            });
            
        }
    }
    return result;
});  
});

var GroupName1 = "CIRCUS_ADMIN"
ad.isUserMemberOf(UserName, GroupName1, function(err, isMember) {
  if (err) {
    console.log("User is not in CIRCUS_ADMIN Group");
    return;
  }
  server.get('/usersData', (request, response) => {    //---------- API to get the position where TWO Kangaroos at the same time ------------------
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("users").findOne({}, function(err, result) {
      if (err) throw err;
      console.log(result.name);
      db.close();
    });
  })
}); 
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// ----------------------------------------------- Create An Authentication ..................................
authenticateDN("uid=admin,ou=system", "secret")