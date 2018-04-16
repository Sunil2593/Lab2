var mysql=require('mysql');
var md5=require('md5');
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime=require('mime-types');
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
/*var kafka = require('./kafka/client');*/
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'sunillalwani1@live.com',
        pass: 'Qazwsx@1'
    }
});

var mongo = require('./mongo');

var session = require('client-sessions');
var url='mongodb://Sunil:sunil@ds121015.mlab.com:21015/freelancer';



/*exports.checklogin=function (req,res) {
    var answer;
    var session=req.session;
    if (session.uid) {
        username:req.session.username;
        console.log(username);
        answer = "loggedIn";
        json_responses = {statusCode: 205, "answer": answer, "username": req.session.username}
        res.json(json_responses);
    }
    else{
        answer = "loggedOut";
        json_responses = {statusCode: 206, "answer": answer, "username": "undefined"}
        res.json(json_responses);
    }
}*/


/*exports.allProjects=function (req,res) {

    var user_id=req.body.user_id;
    var name=req.body.name;
                var con = mysql.createConnection({
                    host: "localhost",
                    user: "root",
                    password: "1111",
                    database: "freelancer"
                });


                con.connect(function (err) {

                    if (err)
                        throw err;
                    var json_responses;
                    var sql = "Select * from projects where status='Not Hired' and user_id not in(?)" ;
                    //var records =[username,password];
                    con.query(sql,[user_id], function (err, result, fields) {
                        if (err)
                            throw err;
                        if (result.length >= 1) {
                            console.log("Project initialized"+result[0]);
                            json_responses = {result: result};
                            res.json(json_responses);
                        }
                        else {
                            json_responses = {result: "No Result"};
                            res.json(json_responses);
                        }
                    });

                });


};*/



exports.download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);
        });
    });
};

/*exports.login=function(passport) {
    passport.use('login', new LocalStrategy(function(username , password, done) {
        exports.login=function (req,res) {

        var username=req.body.username;
        var password=req.body.password;
        var session=req.session;
        console.log('in passport');

        if(!(username==null) && !(username==""))
        {
            if(!(password==null) && !(password==""))
            {
                password = md5(password);

                var con = mysql.createConnection({
                    host: "localhost",
                    user: "root",
                    password: "1111",
                    database: "freelancer"
                });


                con.connect(function (err) {
                    var flag = false;
                    if (err)
                        throw err;
                    var json_responses;
                    var sql = "Select * from users where email = ? and password = ?";
                    con.query(sql, [username, password], function (err, result, fields) {
                        if (err)
                            throw err;
                        if (result.length >= 1) {
                            session.username = username;
                            session.uid=result[0].user_id;
                            console.log("Session initialized"+req.session.uid);
                            answer = "loggedIn";
                            json_responses = {statusCode: 205, "answer": answer,"username":req.session.username, result:result[0]};
                            res.json(json_responses);
                        }
                        else {
                            answer = "Please Enter Correct Username and Password";
                            json_responses = {"statusCode": 401,"answer":answer};
                            res.json(json_responses);
                        }
                    });

                });


            }
            else
            {
                answer="Please provide password";
                res.json({"answer":answer});
            }
        }
        else
        {
            answer="Please provide email";
            res.json({"answer":answer});
        }



        kafka.make_request('login_topic',{"username":username,"password":password}, function(err,results){
            console.log('in result');
            console.log(results);
            if(err){
                done(err,{});
            }
            else
            {
                if(results.code == 200){
                    done(null,{username:"sunil",password:"a"});
                    console.log("login done");
                }
                else {
                    done(null,false);
                }
            }
        });
    }));*/

exports.logout=function (req,res) {
    req.session.destroy();
    var answer = "loggedOut";
    json_responses = {statusCode: 205, "answer": answer, "username": req.session.username}
    res.json(json_responses);
};



exports.login=function (req,res) {

    var flag=false;
    var answer="";
    var username = req.body.username;
    var password=req.body.password;
    console.log("reached login");



   /* kafka.make_request('login_topic',{"username":username,"password":password}, function(err,results){
        console.log('in result');
        console.log(results);
        if(err){
            done(err,{});
        }
        else
        {
            if(results.code == 200){
                done(null,{username:username,password:password});
                console.log("login done");
            }
            else {
                done(null,false);
            }
        }
    });*/

    mongo.connect(function (db) {
        var coll = db.collection('users');
        coll.findOne({'email': username, 'password': password}, function (err, user) {
            if (err) {
                res.json({
                    status: '401'
                });
            }
            if (!user) {
                answer = "Please Enter Correct Username and Password";
                json_responses = {"statusCode": 401,"answer":answer};
                res.json(json_responses);
            }
            else {
                req.session.user = user.Username;

                console.log("Session initialized"+req.session.uid);
                answer = "loggedIn";
                json_responses = {statusCode: 205, "answer": answer,"username":req.session.username, result:user};
                res.json(json_responses);
            }
        });
    });
};


exports.signup=function (req,res) {

    console.log("i am here");
    var answer="";
    var name = req.body.name;
    var username = req.body.username;
    var password=req.body.password;


    if(!(name==null) && !(name==""))
    {
        if(!(username==null) && !(username==""))
        {
            if(!(password==null) && !(password==""))
            {
                var myobj = { name: name, username: username,password:password,skills:"",about_me:"",phone_no:""};

                mongo.connect(function (db) {
                    var coll = db.collection('users');
                    coll.insertOne(myobj, function(err, res) {
                        if (err) throw err;
                        console.log("1 document inserted");
                        /*json_responses = {"statusCode": 401,"answer":"signup successfull"};
                        res.json(json_responses);*/
                    });
                });
            }
        }
    }
    else
    {
        answer="Please provide Name";
        res.json({"answer":answer});
    }
};



/*exports.login=function (req,res) {
    var flag=false;
    var answer="";
    var username = req.body.username;
    var password=req.body.password;
    var session = req.session;


    if(!(username==null) && !(username==""))
    {
        if(!(password==null) && !(password==""))
        {
            password = md5(password);

            var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "1111",
                database: "freelancer"
            });


            con.connect(function (err) {
                var flag = false;
                if (err)
                    throw err;
                var json_responses;
                var sql = "Select * from users where email = ? and password = ?";
                con.query(sql, [username, password], function (err, result, fields) {
                    if (err)
                        throw err;
                    if (result.length >= 1) {
                        session.username = username;
                        session.uid=result[0].user_id;
                        console.log("Session initialized"+req.session.uid);
                        answer = "loggedIn";
                        json_responses = {statusCode: 205, "answer": answer,"username":req.session.username, result:result[0]};
                        res.json(json_responses);
                    }
                    else {
                        answer = "Please Enter Correct Username and Password";
                        json_responses = {"statusCode": 401,"answer":answer};
                        res.json(json_responses);
                    }
                });

            });


        }
        else
        {
            answer="Please provide password";
            res.json({"answer":answer});
        }
    }
    else
    {
        answer="Please provide email";
        res.json({"answer":answer});
    }

};*/

exports.allProjects=function (req,res) {

    var user_id=req.body.user_id;
    var name=req.body.name;
    mongo.connect(function (db) {
        var coll = db.collection('projects');
        coll.find({}).toArray(function(err, documents) {
            if (err) {
                res.json({
                    status: '401'
                });
            }
            if (!documents) {
                json_responses = {result: "No Result"};
                res.json(json_responses);
            }
            else {
                json_responses = {result: documents};
                res.json(json_responses);
            }
        });
    });
};

/*

exports.postProjects=function (req,res) {

    var name = req.body.name;
    var description = req.body.description;
    var skillsRequired = req.body.skillsRequired;
    var budgetRange = req.body.budgetRange;
    var files = req.body.files;
    var status = req.body.status;
    var estimateProjectCompletionDate = req.body.estimateProjectCompletionDate;
    var convertedDate=new Date(estimateProjectCompletionDate);
    var owner = req.body.owner;
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1111",
        database: "freelancer"
    });

    con.connect(function (err) {
        var flag = false;
        if (err)
            throw err;
        var json_responses;
        var sql = "insert into projects values (0,?,?,?,?,LOAD_FILE('/public/images/myImage.jpg'),?,?,?)";
        con.query(sql, [name,description,skillsRequired,budgetRange,status,convertedDate,owner], function (err, result, fields) {
            if (err)
                throw err;
            else {
                json_responses = {result: "Done and Dusted"};
                res.json(json_responses);
            }
        });

    });
};*/


exports.postProjects=function (req,res) {

    var name = req.body.name;
    var description = req.body.description;
    var skillsRequired = req.body.skillsRequired;
    var budgetRange = req.body.budgetRange;
    var files = req.body.files;
    var status = req.body.status;
    var estimateProjectCompletionDate = req.body.estimateProjectCompletionDate;
    var convertedDate=new Date(estimateProjectCompletionDate);
    var owner = req.body.owner;

    var myobj = { name: name, description: "Highway 37",skills_required:skillsRequired,budget_range:budgetRange,status:status,estimate_project_completion_date:convertedDate,owner:owner,project_given_to:null };

    mongo.connect(function (db) {
        var coll = db.collection('projects');
        coll.insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
};


/*
exports.getSelectedProject=function (req,res) {

    var project_id = req.body.projectId;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1111",
        database: "freelancer"
    });


    con.connect(function (err) {
        var flag = false;
        if (err)
            throw err;
        var json_responses;
        var sql = "Select * from projects where project_id = ?";
        //var records =[username,password];
        con.query(sql, [project_id], function (err, result, fields) {
            if (err)
                throw err;
            if (result.length >= 1) {
                json_responses = {result: result};
                res.json(json_responses);
            }
            else {
                json_responses = {result: "No Result"};
                res.json(json_responses);
            }
        });

    });


};
*/


exports.getSelectedProject=function (req,res) {

    var project_id = req.body.projectId;
    mongo.connect(function (db) {
        var coll = db.collection('projects');
        coll.find({name:project_id}).toArray(function(err, result) {
            if (err) {
                res.json({
                    status: '401'
                });
            }
            if (!result) {
                json_responses = {result: "No Result"};
                res.json(json_responses);
            }
            else {
                json_responses = {result: result[0]};
                res.json(json_responses);
            }
        });
    });
};


exports.getListOfAllBids=function (req,res) {

    var project_id = req.body.projectId;
    var json_responses;



    mongo.connect(function (db) {
        var coll = db.collection('bids');
        coll.find({projectName:project_id}).toArray(function(err, result) {
            if (err) {
                res.json({
                    status: '401'
                });
            }
            if (!result) {
                json_responses = {result: "No Result"};
                res.json(json_responses);
            }
            else {
                json_responses = {result: result};
                res.json(json_responses);
            }
        });
    });

};


/*
exports.getListOfAllBids=function (req,res) {

    var project_id = req.body.projectId;
    mongo.connect(function (db) {
        var coll = db.collection('projects');
        coll.find({name:project_id}, function(err, result) {
            if (err) {
                res.json({
                    status: '401'
                });
            }
            if (!result) {
                json_responses = {result: "No Result"};
                res.json(json_responses);
            }
            else {
                json_responses = {result: result.toJSON()};
                res.json(json_responses);
            }
        });
    });
};
*/


/*exports.makeBid=function (req,res) {

    var userId = req.body.userId;
    var projectId = req.body.projectId;
    var bidValue = req.body.bidValue;
    var days=req.body.days

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1111",
        database: "freelancer"
    });

    con.connect(function (err) {
        var flag = false;
        if (err)
            throw err;
        var json_responses;
        var sql = "insert into bid values (0,?,?,?,?)";
        con.query(sql, [userId,projectId,bidValue,days], function (err, result, fields) {
            if (err)
                throw err;
            else {
                json_responses = {result: "Bid Entered"};
                res.json(json_responses);
            }
        });

    });
};*/


exports.makeBid=function (req,res) {

    var userId = req.body.userId;
    var projectId = req.body.projectId;
    var bidValue = req.body.bidValue;
    var days=req.body.days

    var myobj = { username: userId, projectName: projectId,bid_value:bidValue,days:days };


    mongo.connect(function (db) {
        var coll = db.collection('bids');
        coll.insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
};

/*
exports.getListOfAllProjectsBidOn=function (req,res) {

    var user_id = req.body.user_id;

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1111",
        database: "freelancer"
    });


    con.connect(function (err) {
        var flag = false;
        if (err)
            throw err;
        var json_responses;
        var sql = "Select * from projects inner join bid where projects.project_id=bid.project_id and projects.project_id in (Select project_id from bid where user_id = ?) and bid.user_id=?";
        con.query(sql, [user_id,user_id], function (err, result, fields) {
            if (err)
                throw err;
            if (result.length >= 1) {
                json_responses = {result: result};
                res.json(json_responses);
            }
            else {
                json_responses = {result: "No Result"};
                res.json(json_responses);
            }
        });

    });


};*/


exports.getListOfAllProjectsBidOn=function (req,res) {

    var user_id = req.body.projectId;
    user_id='aditya';
    mongo.connect(function (db) {
        var coll = db.collection('projects');
        coll.find({owner:user_id}).toArray(function(err, result) {
            if (err) {
                res.json({
                    status: '401'
                });
            }
            if (!result) {
                json_responses = {result: "No Result"};
                res.json(json_responses);
            }
            else {
                json_responses = {result: result};
                res.json(json_responses);
            }
        });
    });




};


/*exports.getListOfAllProjectsAsEmployer=function (req,res) {

    var user_id = req.body.user_id;
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1111",
        database: "freelancer"
    });


    con.connect(function (err) {
        var flag = false;
        if (err)
            throw err;
        var json_responses;
        var sql = "Select * from projects where user_id = ?";
        con.query(sql, [user_id], function (err, result, fields) {
            if (err)
                throw err;
            if (result.length >= 1) {
                json_responses = {result: result};
                res.json(json_responses);
            }
            else {
                json_responses = {result: "No Result"};
                res.json(json_responses);
            }
        });

    });


};*/


exports.getListOfAllProjectsAsEmployer=function (req,res) {

    var user_id = req.body.projectId;
    user_id='aditya';
    mongo.connect(function (db) {
        var coll = db.collection('projects');
        coll.find({owner:user_id}).toArray(function(err, result) {
            if (err) {
                res.json({
                    status: '401'
                });
            }
            if (!result) {
                json_responses = {result: "No Result"};
                res.json(json_responses);
            }
            else {
                json_responses = {result: result};
                res.json(json_responses);
            }
        });
    });


};


/*exports.hireFreelancer=function (req,res) {

    var userId = req.body.user_id;
    var projectId = req.body.project_id;


    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1111",
        database: "freelancer"
    });

    con.connect(function (err) {
        var flag = false;
        if (err)
            throw err;
        var json_responses;
        var sql = "update projects set status='Hired' where project_id=?";
        con.query(sql, [projectId], function (err, result, fields) {
            if (err)
                throw err;
            else {
                json_responses = {result: "Freelancer Hired"};
                res.json(json_responses);
            }
        });
        /!*var mailOptions = {
            from: 'sunillalwani1@live.com',
            to: 'lalwanisunil2593@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'Hi Sir, You are hired as the freelancer for this project'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });*!/


    });
};*/



exports.hireFreelancer=function (req,res) {

    var userId = req.body.user_id;
    var projectId = req.body.project_id;
    mongo.connect(function (db) {
        var coll = db.collection('projects');

        coll.updateOne({'name':projectId},{$set:{'status':'Hired'}})
        var mailOptions = {
            from: 'sunillalwani1@live.com',
            to: 'lalwanisunil2593@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'Hi Sir, You are hired as the freelancer for this project'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


    });
};












