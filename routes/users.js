var express = require('express');
var nodemailer = require("nodemailer");
var router = express.Router();

const CLIENT_ID = '717930673428-9jlapho6887q2m4bjmcpboin9se5vp1c.apps.googleusercontent.com';
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

let transporter  = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: true,
    port:465,
    proxy: 'http://194.195.253.34',
    auth: {
        user: 'zhou1250912893@gmail.com',
        pass: '110208342Hikari',
    }
});

var userName;
var uid;

router.post('/userSignUp', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var name = req.body.username;
        var pass = req.body.password;
        var firstName = req.body.first_name;
        var lastName = req.body.last_name;
        var email = req.body.email;
        var query = "INSERT INTO users (username, password, first_name, last_name, email) VALUES (?,?,?,?,?);";
        connection.query(query, [name,pass,firstName,lastName,email], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.send(name);
        });
    });
});

router.post('/ownerSignUp', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var name = req.body.username;
        var pass = req.body.password;
        var query = "INSERT INTO owners (username, password) VALUES (?,?);";
        connection.query(query, [name,pass], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.send(name);
        });
    });
});

router.post('/adminSignUp', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var name = req.body.username;
        var pass = req.body.password;
        var firstName = req.body.first_name;
        var lastName = req.body.last_name;
        var email = req.body.email;
        var query = "INSERT INTO admins (username, password, first_name, last_name, email) VALUES (?,?,?,?,?);";
        connection.query(query, [name,pass,firstName,lastName,email], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.send(name);
        });
    });
});

router.post('/userLogIn', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var name = req.body.username;
        var pass = req.body.password;
        var query = "select uid,username,password from users where username=? and password=?;";
        connection.query(query, [name,pass], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            if (JSON.stringify(result)==="[]")
            {
                res.sendStatus(401);
            }
            else
            {
                userName = name;
                uid = result[0].uid;
                res.send(userName);
            }
        });
    });
});

router.post('/GoogleLogIn', function(req, res, next) {
    async function verify() {
        const ticket = await client.verifyIdToken({
        idToken: req.body.token,
        audience: CLIENT_ID,
    });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        const email = payload['email'];
        console.log(userid+" "+email);
        res.send(userid+" "+email);
    }
    verify().catch(function(){res.sendStatus(401);});
});

router.post('/ownerLogIn', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var name = req.body.username;
        var pass = req.body.password;
        var query = "select uid,username,password from owners where username=? and password=?;";
        connection.query(query, [name,pass], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            if (JSON.stringify(result)==="[]")
            {
                res.sendStatus(401);
            }
            else
            {
                userName = name;
                uid = result[0].uid;
                res.send(userName);
            }
        });
    });
});

router.post('/adminLogIn', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var name = req.body.username;
        var pass = req.body.password;
        var query = "select uid,username,password from admins where username=? and password=?;";
        connection.query(query, [name,pass], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            if (JSON.stringify(result)==="[]")
            {
                res.sendStatus(401);
            }
            else
            {
                userName = name;
                uid = result[0].uid;
                res.send(userName);
            }
        });
    });
});

router.get('/logout', function(req, res, next) {
    userName = null;
    uid = null;
    res.send();
});

router.use(function (req, res, next) {
    req.session.user = userName;
    req.session.uid = uid;
    next();
});

router.use(function(req, res, next) {
    if(req.session.uid == null){
        res.sendStatus(401);
    }
    else {
        next();
    }
});

router.get('/getUserInfo', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "select * from users where uid=?;";
        connection.query(query, [req.session.uid], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            if (JSON.stringify(result)==="[]")
            {
                res.sendStatus(401);
            }
            else
            {
                res.send(result);
            }
        });
    });
});

router.post('/changeUserInfo', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var name = req.body.username;
        var pass = req.body.password;
        var firstName = req.body.first_name;
        var lastName = req.body.last_name;
        var email = req.body.email;
        var query = "update users set username = ?, password = ?, first_name = ?, last_name = ?, email = ? where uid = ?;";
        connection.query(query, [name,pass,firstName,lastName,email,req.session.uid], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.send();
        });
    });
});

router.get('/getAdminInfo', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "select * from admins where uid=?;";
        connection.query(query, [req.session.uid], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            if (JSON.stringify(result)==="[]")
            {
                res.sendStatus(401);
            }
            else
            {
                res.send(result);
            }
        });
    });
});

router.post('/changeAdminInfo', function(req, res, next) {
    console.log(req.session.uid);
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var name = req.body.username;
        var pass = req.body.password;
        var firstName = req.body.first_name;
        var lastName = req.body.last_name;
        var email = req.body.email;
        var query = "update admins set username = ?, password = ?, first_name = ?, last_name = ?, email = ? where uid = ?;";
        connection.query(query, [name,pass,firstName,lastName,email,req.session.uid], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.send();
        });
    });
});

router.post('/getCurrentHotspotsEmail', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "select locations.check_in_code,locations.name,locations.lat,locations.lng from hotspots,locations where curdate()<=hotspots.end_date and hotspots.check_in_code=locations.check_in_code;";
        connection.query(query, function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            var emailAddress = req.body.emailAddress;
            var sendHtml = `<div>
                    <h3>Current hotspots record</h3>
                    <table>
                    <thead>
                        <tr>
                          <th>Check in code</th>
                          <th>name</th>
                          <th>Latitude</th>
                          <th>Longitude</th>
                        </tr>
                    </thead>
                    <tbody>`;
            for (var i in result)
            {
                sendHtml +='<tr>'+'<td>'+result[i].check_in_code+'</td>'+'<td>'+result[i].name+'</td>'+'<td>'+result[i].lat+'</td>'+'<td>'+result[i].lng+'</td>'+'</tr>';
            }
            sendHtml+=`</tbody>
                </table>
            </div>`;
            var mailOptions = {
                from: 'zhou1250912893@gmail.com',
                to: emailAddress,
                subject: 'Current Hotspots',
                html: sendHtml
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });
            res.send();
        });
    });
});

router.post('/sendWentHotspotsEmail', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "select history.date,locations.name from history,hotspots,locations where history.date>=hotspots.start_date and history.date<=hotspots.end_date and history.check_in_code=locations.check_in_code and hotspots.check_in_code=locations.check_in_code and uid=?;";
        connection.query(query, [req.session.uid], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            var emailAddress = req.body.emailAddress;
            if (JSON.stringify(result)==="[]")
            {
                var mailOptions = {
                from: 'zhou1250912893@gmail.com',
                to: emailAddress,
                subject: 'Check whether you have been to a hotspot',
                html: `<p>You have not been to hotspots, you are safe.</p>`
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
                res.send();
            }
            else{
                var sendHtml=`<div>
                    <h3>Current hotspots record</h3>
                    <table>
                    <thead>
                        <tr>
                          <th>Location name</th>
                          <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>`;
                for (var i in result)
                {
                    var date = new Date(result[i].date);
                    var dateString = [
                      date.getUTCFullYear() ,
                      ("0" + (date.getUTCMonth()+1)).slice(-2),
                      ("0" + date.getUTCDate()).slice(-2)
                    ].join("-");
                    sendHtml +='<tr>'+'<td>'+dateString+'</td>'+'<td>'+result[i].name+'</td>'+'</tr>';
                }
                sendHtml+=`</tbody>
                    </table>
                </div>`;
                var mailOptions2 = {
                from: 'zhou1250912893@gmail.com',
                to: emailAddress,
                subject: 'Check whether you have been to a hotspot',
                html: sendHtml
                };
                transporter.sendMail(mailOptions2, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
                res.send();
            }
        });
    });
});

router.post('/checkIn', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var code = req.body.code;
        var query = "insert into history(uid,check_in_code,date) values(?,?,curdate());";
        connection.query(query, [req.session.uid,code], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.send();
        });
    });
});

router.get('/viewHistory', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "select history.history_id,history.date,locations.name,locations.lat,locations.lng from history,locations where history.uid=? and history.check_in_code=locations.check_in_code;";
        connection.query(query, [req.session.uid], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.send(result);
        });
    });
});

router.get('/showAllHotspots', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "select hotspots.hotspot_id,hotspots.check_in_code,locations.name,hotspots.start_date,hotspots.end_date from hotspots,locations where hotspots.check_in_code=locations.check_in_code;";
        connection.query(query, function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.send(result);
        });
    });
});

router.get('/seeCurrentHotspots', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "select hotspots.hotspot_id,locations.name,locations.lat,locations.lng from hotspots,locations where curdate()<=hotspots.end_date and hotspots.check_in_code=locations.check_in_code;";
        connection.query(query, function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.send(result);
        });
    });
});

router.get('/wentHotspots', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "select history.date,locations.name from history,hotspots,locations where history.date>=hotspots.start_date and history.date<=hotspots.end_date and history.check_in_code=locations.check_in_code and hotspots.check_in_code=locations.check_in_code and uid=? order by date;";
        connection.query(query, [req.session.uid], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            if (JSON.stringify(result)==="[]")
            {
                res.sendStatus(401);
            }
            else{
                res.send(result);
            }
        });
    });
});

router.get('/getVenueInfo', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "select locations.check_in_code,locations.name,locations.lat,locations.lng from locations,venues where venues.uid = ? and venues.check_in_code=locations.check_in_code;";
        connection.query(query, [req.session.uid], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            if (JSON.stringify(result)==="[]")
            {
                res.sendStatus(401);
            }
            else
            {
                res.send(result);
            }
        });
    });
});


router.post('/changeVenueInfo', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var checkInCode = req.body.check_in_code;
        var name = req.body.name;
        var lat = req.body.lat;
        var lng = req.body.lng;
        var query = "update locations set name = ?, lat = ?, lng = ? where check_in_code = ?;";
        connection.query(query, [name,lat,lng,checkInCode], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.send();
        });
    });
});

router.get('/test', function(req, res, next) {
  res.send(req.session);
});

router.get('/showVenueCheckInHistory', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "select history.history_id,users.uid,users.username,locations.name,history.date from users,history,locations,venues where venues.uid=? and venues.check_in_code=history.check_in_code and history.check_in_code=locations.check_in_code and users.uid=history.uid order by history_id ASC;";
        connection.query(query, [req.session.uid], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            if (JSON.stringify(result)==="[]")
            {
                res.sendStatus(401);
            }
            else
            {
                res.send(result);
            }
        });
    });
});

router.post('/createLocations', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "insert into locations(check_in_code,name,lat,lng) values(?,?,?,?);";
        connection.query(query, [req.body.check_in_code,req.body.name,req.body.lat,req.body.lng], function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.send();
        });
    });
});

router.post('/createHotspots', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query  = "insert into hotspots(check_in_code,start_date,end_date) values(?,?,?);";
        connection.query(query, [req.body.check_in_code,req.body.start_date,req.body.end_date], function(err, result) {
        connection.release();
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.send();
        });
    });
});

router.post('/changeTimeframe', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query  = "update hotspots set start_date = ?, end_date = ? where hotspot_id = ?;";
        connection.query(query, [req.body.start_date,req.body.end_date,req.body.hotspot_id], function(err, result) {
        connection.release();
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.send();
        });
    });
});

router.get('/showAllCheckInHistory', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "select history.history_id,users.uid,users.username,locations.name,history.date from users,history,locations where users.uid=history.uid and history.check_in_code=locations.check_in_code order by history_id ASC;";
        connection.query(query, function(err, result) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            if (JSON.stringify(result)==="[]")
            {
                res.sendStatus(401);
            }
            else
            {
                res.send(result);
            }
        });
    });
});

router.post('/allocateVenues', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query  = "insert into venues(uid,check_in_code) values(?,?);";
        connection.query(query, [req.body.uid,req.body.checkInCode], function(err, result) {
        connection.release();
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.send();
        });
    });
});

router.post('/removeUsers', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query  = "delete from users where uid=?;";
        connection.query(query, [req.body.uid], function(err, result) {
        connection.release();
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.send();
        });
    });
});

router.post('/removeOwners', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query  = "delete from owners where uid=?;";
        connection.query(query, [req.body.uid], function(err, result) {
        connection.release();
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.send();
        });
    });
});

router.post('/removeLocations', function(req, res, next) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query  = "delete from locations where check_in_code=?;";
        connection.query(query, [req.body.code], function(err, result) {
        connection.release();
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.send();
        });
    });
});

module.exports = router;
