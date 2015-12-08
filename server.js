(function (express, server, bodyParser, mongoDB, passport, passportLocal, fs,
    cookieParser, expressSession, mongoRepo) {



    server.use(bodyParser.urlencoded({
        extended: true
    }));
    server.use(bodyParser.json());

    server.use(cookieParser());
    //set up express's session with a secret and options
    server.use(expressSession({
        secret: process.env.secretStuffMan || 'IAMBATMAN!!!!@!@!#@!#!',
        resave: false,
        saveUninitialized: false
    }));

    //the above must come before passport middleware is used!!!!

    //middleware to initialize passport's functionality
    server.use(passport.initialize());
    //allows us to put passport information into session
    server.use(passport.session());


    //------------------------------------------------Set Public Files -----------------------------------------------

    server.use(express.static("public"));

    server.get("/", function (req, res) {
        fs.readFile("templates/index.html", function (err, data) {
            res.send(data.toString());
        });
    });



    //------------------------------------------------Login / register-----------------------------------------------

    passport.use(new passportLocal.Strategy(function (username, password, done) {
        //hit the database
        console.log("hit the local-strat");
        mongoRepo.FindUserByName("users", username, function (user) {
            if (password == user[0].password) {
                done(null, {
                    id: user[0]._id
                });
            } else {
                done(null, null);
            }
        });
    }));

    //allows us to serialize a user object
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        //query DB and fill in the object below
        mongoRepo.FindUserByID("users", id, function (user) {
            done(null, user[0]);
        });
    });

    function CheckAuth(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect("/");
        }
    }



    //Angular sends form data to this route with method of POST
    server.post("/login", passport.authenticate('local'), function (req, res) {
        //do our passport login logic
        //if they are successfully logged in send a success true
        //else send success false

        console.log("This actually fired");

        var successObj = {
            success: false
        };

        if (req.isAuthenticated()) {
            successObj.success = true;
        }

        res.json(successObj);
    });


    server.post("/register", function (req, res) {

        var model = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            messages: req.body.messages
        };

        mongoRepo.CreateUser("users", model, function (status) {

            var newUserResponse = {
                success: status
            };

            res.json(newUserResponse)

        });
    });




    //------------------------------------------------Get Data Requests-----------------------------------------------

    server.get("/retrieveStories", function (req, res) {

        mongoRepo.FindAllInCollectionAsArray('stories', function (data) {

            if (data) {
                res.json({
                    success: data,
                    failure: false
                });
            } else {
                res.json({
                    success: false,
                    failure: true
                });
            }

        });

    });

    server.get("/retrieveNames", function (req, res) {

        mongoRepo.FindAllNamesInCollectionAsArray('users', function (data) {

            if (data) {
                res.json({
                    success: data,
                    failure: false
                });
            } else {
                res.json({
                    success: false,
                    failure: true
                });
            }

        });

    });

    server.get("/retrieveProjects", function (req, res) {

        mongoRepo.FindAllNamesInCollectionAsArray('projects', function (data) {

            if (data) {
                res.json({
                    success: data,
                    failure: false
                });
            } else {
                res.json({
                    success: false,
                    failure: true
                });
            }

        });

    });

    server.get("/retrieveCompany", function (req, res) {

        mongoRepo.FindAllInCollectionAsArray('companies', function (data) {

            if (data) {
                res.json({
                    success: data,
                    failure: false
                });
            } else {
                res.json({
                    success: false,
                    failure: true
                });
            }

        });

    });



    server.get("/retrieveMessages", function (req, res) {

        mongoRepo.FindAllMessagesInCollectionAsArray('users', function (data) {

            if (data) {
                res.json({
                    success: data,
                    failure: false
                });
            } else {
                res.json({
                    success: false,
                    failure: true
                });
            }

        });

    });

    server.post("/CodeShareBoxGet", function (req, res) {
        var model = {
            codeShareBox: req.body.codeShareBox,
        };


        mongoRepo.FindCodeShare('codeshare', model, function (data) {

            if (data) {
                res.json({
                    success: data,
                    failure: false
                });
            } else {
                res.json({
                    success: false,
                    failure: true
                });
            }

        });

    });



    server.get("/retrieveStoryTotal", function (req, res) {

        mongoRepo.FindAllIdsInCollectionAsArray('stories', function (data) {

            if (data) {
                res.json({
                    success: data,
                    failure: false
                });
            } else {
                res.json({
                    success: false,
                    failure: true
                });
            }

        });

    });





    //------------------------------------------------Post Info Requests-----------------------------------------------    



    server.post("/storymaker", function (req, res) {

        var model = {
            project: req.body.project,
            id: req.body.id,
            name: req.body.name,
            owner: req.body.owner,
            sprint: req.body.sprint,
            days: req.body.days,
            theme: req.body.theme,
            as: req.body.as,
            iwant: req.body.iwant,
            sothat: req.body.sothat,
            steps: req.body.steps,
            notes: req.body.notes,
            efforts: []

        };

        mongoRepo.CreateStory("stories", model, function (status) {

            var newStoryResponse = {
                success: status
            };

            res.json(newStoryResponse)

        });
    });


    server.post("/projectMaker", function (req, res) {

        var model = {
            name: req.body.name,
            description: req.body.description,
            startDate: req.body.startDate,
            sprints: req.body.sprints,
            sprintLength: req.body.sprintLength,
            daysOffPerSprint: req.body.daysOffPerSprint,
            completionDate: req.body.completionDate,
            contributors: req.body.contributors,
            designSpec: req.body.designSpec,
            techSpec: req.body.techSpec
        };



        mongoRepo.CreateProject("projects", model, function (status) {

            var newProjectResponse = {
                success: status
            };

            res.json(newProjectResponse)

        });
    });


    server.post("/sendMessage", function (req, res) {

        var model = {
            to: req.body.to,
            from: req.body.from,
            subject: req.body.subject,
            text: req.body.text,
            urgent: req.body.urgent,
            starred: req.body.starred,
            read: req.body.read,
            id: req.body.id,
            dateCreated: new Date().toDateString()
        };

        mongoRepo.FindOneAndUpdate("users", model, function (status) {

            var newUserResponse = {
                success: status
            };

            res.json(newUserResponse)

        });
    });

    server.post("/CodeShareBoxPost", function (req, res) {

        var model = {
            codeShareBox: req.body.codeShareBox,
        };

        mongoRepo.FindCodeShareAndUpdate("codeshare", model, function (status) {

            var newUserResponse = {
                success: status
            };

            res.json(newUserResponse)

        });
    });


    server.post("/companyInfo", function (req, res) {

        var model = {
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            stockName: req.body.stockName
        };

        mongoRepo.CreateUser("companies", model, function (status) {

            var newUserResponse = {
                success: status
            };

            res.json(newUserResponse)

        });
    });


    //------------------------------------------------Update Data Requests-----------------------------------------------


    server.post("/updateEffort", function (req, res) {

        var model = {

            project: req.body.project,
            id: req.body.id,
            effortUpdate: req.body.effortUpdate

        };

        mongoRepo.FindStoryAndUpdate("stories", model, function (status) {

            var newUserResponse = {
                success: status
            };

            res.json(newUserResponse)

        });
    });

    server.post("/removeMessage", function (req, res) {

        var model = {

            name: req.body.name,
            id: req.body.id,
        };

        mongoRepo.FindMessageAndRemove("users", model, function (status) {

            var newUserResponse = {
                success: status
            };

            res.json(newUserResponse)

        });
    });
    
        server.post("/MarkMessageRead", function (req, res) {

        var model = {

            name: req.body.name,
            id: req.body.id,
        };

        mongoRepo.FindMessageAndMark("users", model, function (status) {

            var newUserResponse = {
                success: status
            };

            res.json(newUserResponse)

        });
    });




    server.post("/updateCompanyInfo", function (req, res) {

        var model = {
            oldName: req.body.oldName,
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            stockName: req.body.stockName
        };

        console.log(model);

        mongoRepo.FindCompanyAndUpdate("companies", model, function (status) {

            var newUserResponse = {
                success: status
            };

            res.json(newUserResponse)

        });
    });


    //------------------------------------------------listen on given IP, or on 1338-----------------------------------------------


    server.listen((process.env.PORT ), (process.env.IP ),
        function () {
            console.log(" server online ");
        });

})(
    require("express"),
    require("express")(),
    require("body-parser"),
    require("mongodb"),
    require("passport"),
    require("passport-local"),
    require("fs"),
    require('cookie-parser'),
    require('express-session'),
    require('./mongo_repo')



);