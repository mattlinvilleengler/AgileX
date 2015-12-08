(function (dbRepo, dbConnect, colors, mongodb) {

        var ObjectID = mongodb.ObjectID;


        //------------------------------------------------find everything in collection-----------------------------------------------



        var FindAllInCollectionAsArray = function (collectionName, callback) {
            dbConnect.ConnectToDB(function (db, closeDB) {

                db.collection(collectionName).find().toArray(function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(" Connected correctly to Mongo Server ".bgGreen.white);
                    callback(data);
                    console.log(" Custom passed-in callback fired ".bgYellow.white);
                    closeDB();
                    console.log(" Closed correctly from Mongo Server ".bgBlue.white);
                });

            });
        };


        //-----------------------find name, contrib, and sprints in projects-----------------------------------------------


        var FindAllNamesInCollectionAsArray = function (collectionName, callback) {
            dbConnect.ConnectToDB(function (db, closeDB) {

                db.collection(collectionName).find({}, {
                    name: 1,
                    contributors: 1,
                    sprints: 1
                }).toArray(function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(" Connected correctly to Mongo Server ".bgGreen.white);
                    callback(data);
                    console.log(" Custom passed-in callback fired ".bgYellow.white);
                    closeDB();
                    console.log(" Closed correctly from Mongo Server ".bgBlue.white);
                });

            });
        };


        //-----------------------find name, and messages in users-----------------------------------------------

        var FindAllMessagesInCollectionAsArray = function (collectionName, callback) {
            dbConnect.ConnectToDB(function (db, closeDB) {

                db.collection(collectionName).find({}, {
                    name: 1,
                    messages: 1
                }).toArray(function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(" Connected correctly to Mongo Server ".bgGreen.white);
                    callback(data);
                    console.log(" Custom passed-in callback fired ".bgYellow.white);
                    closeDB();
                    console.log(" Closed correctly from Mongo Server ".bgBlue.white);
                });

            });
        };



        //-----------------------find id, and project name, in stories-----------------------------------------------


        var FindAllIdsInCollectionAsArray = function (collectionName, callback) {
            dbConnect.ConnectToDB(function (db, closeDB) {

                db.collection(collectionName).find({}, {
                    id: 1,
                    project: 1,
                }).toArray(function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(" Connected correctly to Mongo Server ".bgGreen.white);
                    callback(data);
                    console.log(" Custom passed-in callback fired ".bgYellow.white);
                    closeDB();
                    console.log(" Closed correctly from Mongo Server ".bgBlue.white);
                });

            });
        };



        //-----------------------find user by name-----------------------------------------------


        var FindUserByName = function (collectionName, username, callback) {
            dbConnect.ConnectToDB(function (db, closeDB) {

                db.collection(collectionName).find({
                    name: username
                }).toArray(function (err, data) {
                    if (err) {
                        callback("err");
                        return console.log(err);
                    }
                    callback(data);
                    closeDB();
                });
            });
        };


        //-----------------------find user by ID-----------------------------------------------

        var FindUserByID = function (collectionName, id, callback) {
            dbConnect.ConnectToDB(function (db, closeDB) {

                db.collection(collectionName).find({
                    _id: new ObjectID(id)
                }).toArray(function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    callback(data);
                    closeDB();
                });
            });
        };

        //-----------------------find by ID-----------------------------------------------

        var FindSingle = function (collectionName, id, callback) {
            dbConnect.ConnectToDB(function (db, closeDB) {
                db.collection(collectionName).find({
                    _id: new ObjectID(id)
                }).toArray(
                    function (err, data) {
                        if (err) {
                            closeDB();
                            return console.log(err);
                        }
                        callback(data)
                        closeDB();
                    });
            });
        };


        //-----------------------find story by id-----------------------------------------------

        var FindStories = function (collectionName, id, callback) {
            dbConnect.ConnectToDB(function (db, closeDB) {
                db.collection(collectionName).find({
                    _id: new ObjectID(id)
                }).toArray(
                    function (err, data) {
                        if (err) {
                            closeDB();
                            return console.log(err);
                        }
                        callback(data)
                        closeDB();
                    });
            });
        };


        //-----------------------Add to collection-----------------------------------------------

        var CreateThing = function (collectionName, model, callback) {
            dbConnect.ConnectToDB(function (db, closeDB) {
                db.collection(collectionName).insert(model, function (err) {
                    if (err) {
                        closeDB();
                        return console.log(err);
                    }
                });
            });
        }



    //-----------------------add user to users-----------------------------------------------

    var CreateUser = function (collectionName, model, callback) {
        dbConnect.ConnectToDB(function (db, closeDB) {
            db.collection(collectionName).insert(model, function (err) {
                if (err) {
                    closeDB();
                    callback(false);
                    return console.log(err);
                }

                callback(true);
                closeDB();

            });
        });
    };

    //-----------------------find story by stories-----------------------------------------------

    var CreateStory = function (collectionName, model, callback) {
        dbConnect.ConnectToDB(function (db, closeDB) {
            db.collection(collectionName).insert(model, function (err) {
                if (err) {
                    closeDB();
                    callback(false);
                    return console.log(err);
                }

                callback(true);
                closeDB();

            });
        });
    };

    //-----------------------add project to projects-----------------------------------------------

    var CreateProject = function (collectionName, model, callback) {
        dbConnect.ConnectToDB(function (db, closeDB) {
            db.collection(collectionName).insert(model, function (err) {
                if (err) {
                    closeDB();
                    callback(false);
                    return console.log(err);
                }

                callback(true);
                closeDB();

            });
        });
    };



    //-----------------------add messages to messages array----------------------------------------------- 

    var FindOneAndUpdate = function (collectionName, model, callback) {
        dbConnect.ConnectToDB(function (db, closeDB) {
            db.collection(collectionName).update({
                    name: model.to
                }, {
                    $push: {
                        messages: model
                    }
                },
                function (err) {
                    if (err) {
                        closeDB();
                        return console.log(err);
                    }
                    console.log(model);
                    callback(true);
                });
        });
    };

    //-----------------------remove message-----------------------------------------------

    var FindMessageAndRemove = function (collectionName, model, callback) {
        dbConnect.ConnectToDB(function (db, closeDB) {
            db.collection(collectionName).update({
                    name: model.name
                }, {
                    $pull: {
                        messages: {
                            id: model.id
                        }
                    }
                },
                function (err) {
                    if (err) {
                        closeDB();
                        return console.log(err);
                    }
                    console.log(model);
                    callback(true);
                });
        });
    };
    
    //-----------------------Mark Message as Read-----------------------------------------------
    
        var FindMessageAndMark = function (collectionName, model, callback) {
        dbConnect.ConnectToDB(function (db, closeDB) {
            db.collection(collectionName).update({
                    name: model.name, 'messages.id': model.id 
                }, {
                    $set: { 'messages.$.read': true }
                    },
               
                function (err) {
                    if (err) {
                        closeDB();
                        return console.log(err);
                    }
                    console.log(model);
                    callback(true);
                });
        });
    };
    
    


    //-----------------------Update effort in story-----------------------------------------------

    var FindStoryAndUpdate = function (collectionName, model, callback) {
        dbConnect.ConnectToDB(function (db, closeDB) {
            db.collection(collectionName).update({
                    project: model.project,
                    id: model.id
                }, {
                    $push: {
                        efforts: {
                            effort: model.effortUpdate.effort,
                            date: model.effortUpdate.date
                        }
                    }
                },
                function (err) {
                    if (err) {
                        closeDB();
                        return console.log(err);
                    }
                    console.log(model);
                    callback(true);
                });
        });
    };

    //-----------------------update codeshare box-----------------------------------------------

    var FindCodeShareAndUpdate = function (collectionName, model, callback) {
        dbConnect.ConnectToDB(function (db, closeDB) {
            db.collection(collectionName).update({
                    codeShare: 1
                }, {
                    $set: {
                        box: model.codeShareBox
                    }
                },
                function (err) {
                    if (err) {
                        closeDB();
                        return console.log(err);
                    }
                    console.log(model);
                    callback(true);
                });
        });
    };


    //-----------------------get codeshare box info-----------------------------------------------

    var FindCodeShare = function (collectionName, model, callback) {
        dbConnect.ConnectToDB(function (db, closeDB) {

            db.collection(collectionName).find({
                codeShare: 1
            }).toArray(function (err, data) {
                if (err) {
                    return console.log(err);
                } else {

                    callback(data);
                    closeDB();
                }

            });

        });
    };

    //-----------------------callback for getting codesharebox info-----------------------------------------------

    var whatever = function () {
        db.collection(collectionName).find({
            codeShare: 1
        }).toArray(function (err, data) {
            if (err) {
                return console.log(err);
            } else {
                console.log(data[0].box);
                if (data[0].box == model.codeShareBox) {

                    return whatever(collectionName, model, callback);
                }

                callback(data);
                closeDB();
            }

        });
    };


    //-----------------------update company info-----------------------------------------------

    var FindCompanyAndUpdate = function (collectionName, model, callback) {
        dbConnect.ConnectToDB(function (db, closeDB) {
            db.collection(collectionName).update({
                    name: model.oldName
                }, {
                    $set: {
                        name: model.name,
                        address: model.address,
                        phone: model.phone,
                        stockName: model.stockName
                    }
                },
                function (err) {
                    if (err) {
                        closeDB();
                        return console.log(err);
                    }
                    callback(true);
                });
        });
    };


    //-----------------------delete by id-----------------------------------------------

    var DeleteThing = function (collectionName, id, callback) {

        dbConnect.ConnectToDB(function (db, closeDB) {

            db.collection(collectionName).remove({
                    _id: new ObjectID(id)
                },
                function (err) {
                    if (err) {
                        closeDB();
                        return console.log(err);
                    }

                    FindAllInCollectionAsArray("library", function (data) {
                        callback(data);
                    });
                });

        });

    };

//-----------------------declare functions to pass to server.js-----------------------------------------------

dbRepo.FindAllInCollectionAsArray = FindAllInCollectionAsArray;
dbRepo.FindSingle = FindSingle;
dbRepo.CreateThing = CreateThing;
dbRepo.FindOneAndUpdate = FindOneAndUpdate;
dbRepo.DeleteThing = DeleteThing;
dbRepo.FindUserByName = FindUserByName;
dbRepo.FindUserByID = FindUserByID;
dbRepo.CreateUser = CreateUser;
dbRepo.CreateProject = CreateProject;
dbRepo.CreateStory = CreateStory;
dbRepo.FindAllNamesInCollectionAsArray = FindAllNamesInCollectionAsArray;
dbRepo.FindAllIdsInCollectionAsArray = FindAllIdsInCollectionAsArray;
dbRepo.FindAllMessagesInCollectionAsArray = FindAllMessagesInCollectionAsArray;
dbRepo.FindCompanyAndUpdate = FindCompanyAndUpdate;
dbRepo.FindStoryAndUpdate = FindStoryAndUpdate;
dbRepo.FindMessageAndRemove = FindMessageAndRemove;
dbRepo.FindCodeShareAndUpdate = FindCodeShareAndUpdate;
dbRepo.FindCodeShare = FindCodeShare;
dbRepo.FindMessageAndMark =FindMessageAndMark;

})(
    module.exports,
    require("./mongoconnection.js"),
    require("colors"),
    require("mongodb")
);