'use strict';

/* Controllers */

angular.module('myApp.controllers', [])


//------------------------------------------------Login Controller -----------------------------------------------



.controller('LoginCtrl', ['$scope', '$http', function ($scope, $http) {
    
    //-------------declare variables -----------------------


    $scope.buttons = true;
    $scope.loginShow = false;
    $scope.registerShow = false;
    $scope.$parent.login_success = false;
    $scope.$parent.register_success = false;
    $scope.$parent.registration_error_check = false;
    $scope.user = {};
    
    
    //-------------end declare variables -----------------------
    
                //-------------display login form-----------------------
    
    $scope.ShowLogin = function () {
        if ($scope.loginShow == false) {
            $scope.loginShow = true;
        } else {
            $scope.registerShow = false;
        }
        $scope.buttons = false;
    };
    
        //-------------display register form -----------------------

    $scope.ShowRegister = function () {
        if ($scope.registerShow == false) {
            $scope.registerShow = true;
        } else {
            $scope.loginShow = false;
        }
        $scope.buttons = false;
    };

        //-------------Login!-----------------------
    
    $scope.LoginUser = function () {
        var model = {
            username: $scope.user.name,
            password: $scope.user.password
        };
        
                //-------------post model to server.js -----------------------

        $http.post("/login", model).success(function (response) {
            console.log(response);
            if (response.success == true) {
                $scope.$parent.login_success = true;
                $scope.$parent.login_message = "Welcome " + model.username + "!";;
                $scope.hombre.name = model.username;
                $scope.hombre.signedIn = true;
                if ($scope.hombre.name == "Matt Engler") {
                    $scope.hombre.admin = true;
                } else {
                    $scope.hombre.user = true;
                }
                window.location = "#/dashboard";

            } else {
                $scope.showLoginError = true;
                console.log("Login Failed");
                
            }
        });
            //-------------reset variables -----------------------
        
        $scope.user.password = "";
        $scope.user.name = "";
    };
        
        //-------------Register! -----------------------
        
    $scope.RegisterUser = function () {

        var registerModel = {
            name: $scope.user.name,
            email: $scope.user.email,
            password: $scope.user.password,
            messages: []
        };
        
        //-------------if passwords are equal -----------------------

        if ($scope.user.passwordCheck == $scope.user.password) {
            $http.post("/register", registerModel).success(function (response) {
                if (response.success == true) {
                    $scope.$parent.register_success = true;
                    $scope.$parent.register_message = "Welcome " + registerModel.name + "!";
                    $scope.$parent.showRegister = false;
                    $scope.loginShow = true;
                    $scope.registerShow = false;
                } else {
                    $scope.$parent.registration_error_check = true;
                    $scope.$parent.registration_error = "Registration failed";
                }
            });
            //-------------reset variables -----------------------
            
            $scope.user.password = "";
            $scope.user.email = "";
            $scope.user.name = "";
            $scope.user.passwordCheck = "";

        } else {
            $scope.$parent.registration_error = "Passwords don't match";
        }
    };

}])



//------------------------------------------------Story Dev Controller -----------------------------------------------



.controller('StoryMakerCtrl', ['$scope', '$http', function ($scope, $http) {
    
    
    //-------------declare variables -----------------------


    $scope.userNames = [];
    $scope.projectNames = [];
    $scope.story = {};
    $scope.story.project = "Select Rock";
    $scope.story.sprint = "Select Sprint";
    $scope.$parent.newId = 0;
    $scope.stories = [];
    $scope.selectedDevelopers = [];
    $scope.selectedDevelopersDisp = "Select Contributing Developers";
    $scope.totalSprints = [];
    $scope.steplist = [];
    $scope.count = 1;
    
    //------------- end declare variables -----------------------
    

        //-------------display sstory id and contributers dependant on which project -----------------------
    
    $scope.formDisp = function () {
        var countForID = 0;
        for (var count in $scope.stories) {
            if ($scope.story.project == $scope.stories[count].project) {
                countForID++;
            }
        }

        $scope.$parent.newId = (countForID + 1001);
        $scope.userNames = [];

        for (var i in $scope.projectNames) {
            if ($scope.story.project == $scope.projectNames[i].name) {
                for (var l in $scope.projectNames[i].contributors) {
                    $scope.userNames.push({
                        name: $scope.projectNames[i].contributors[l],
                            //-------------set button color-----------------------
                        backgroundColor: "grey",
                        color: "#151c2b",
                        selected: false
                    });
                }
                    //-------------add label to sprint selector-----------------------
                $scope.totalSprints = [{
                    sprintName: "Select Sprint"
                }];

                for (var t in $scope.projectNames[i].sprints) {
                    $scope.totalSprints.push({
                        sprintName: $scope.projectNames[i].sprints[t]
                    });
                }

            }
        }

    };
    
    //-------------select contributors-----------------------

    $scope.selectUser = function (users) {
        var selects = [];
        var selectsDisp = "";
            if (users.selected == false) {
            users.selected = true;
            users.backgroundColor = "#151c2b";
            users.color = "grey";
        } else {
            users.selected = false;
            users.backgroundColor = "grey";
            users.color = "#151c2b";
        
        }
        for (var j in $scope.userNames) {

            $scope.selectedDevelopers = [];
            if ($scope.userNames[j].selected == true) {
                selects.push($scope.userNames[j].name);
                selectsDisp += " " + $scope.userNames[j].name + " | ";
            }
        }
        $scope.selectedDevelopers = selects;
        $scope.selectedDevelopersDisp = selectsDisp;

    };

    //-------------get project names -----------------------

    $http.get('/retrieveProjects').then(function (response) {
        $scope.projectNames = response.data.success;
        $scope.projectNames.push({
            name: "Select Rock"
        });
        $scope.totalSprints.push({
            sprintName: "Select Sprint"
        });
    });
    
    //-------------get total stories in project -----------------------

    $http.get('/retrieveStoryTotal').then(function (response) {
        $scope.stories = response.data.success;

    });

    
        //-------------add steps to form -----------------------

    $scope.AddStep = function () {

        $scope.steplist.push({
            step: "",
            then: "",
            stepNumber: $scope.count
        });
        $scope.count++;

    };
    
        //-------------Submit Story -----------------------

    $scope.CreateStory = function () {

        $scope.story.id = $scope.$parent.newId;

        var model = {

            project: $scope.story.project,
            id: $scope.story.id,
            name: $scope.story.name,
            owner: $scope.selectedDevelopers,
            sprint: $scope.story.sprint,
            theme: $scope.story.theme,
            days: $scope.story.days,
            as: $scope.story.as,
            iwant: $scope.story.iwant,
            sothat: $scope.story.sothat,
            steps: $scope.steplist,
            notes: $scope.story.notes
        };

        $http.post("/storymaker", model).success(function (response) {
            if (response.success == true) {
                $scope.$parent.storySuccess = true;
                $scope.$parent.storySuccessMessage = "Story Created";

            } else {
                $scope.showStoryError = true;
                $scope.storyErrorMsg = "Sorry Failed";
            }

        });
        
        //-------------reset variables -----------------------
        
        $scope.$parent.newID = "";
        $scope.story.name = "";
        $scope.story.project = "Select Project";
        $scope.story.sprint = "Select Sprint";
        $scope.story.owner = "Story Owner";
        $scope.story.theme = "";
        $scope.story.days = "";
        $scope.story.as = "";
        $scope.story.iwant = "";
        $scope.story.sothat = "";
        $scope.story.notes = "";
        $scope.steplist = [];
        $scope.count = 1;




    };


    }])



//------------------------------------------------Project Dev Controller -----------------------------------------------



.controller('ProjectDevCtrl', ['$scope', '$http', function ($scope, $http) {
    
    
    
    //-------------declare variables -----------------------

    $scope.userNames = [];
    $scope.selectedDevelopers = [];
    $scope.selectedDevelopersDisp = "Select Contributing Developers";
    $scope.sprintTotal = [];
    
    
    //------------- end declare variables -----------------------

    $http.get('/retrieveNames').then(function (response) {
        $scope.userNames = response.data.success;
        for (var m in $scope.userNames) {
            $scope.userNames[m].backgroundColor = "grey";
            $scope.userNames[m].color = "#151c2b";
            $scope.userNames[m].selected = false;
        }

    });
        
        //-------------select users -----------------------

    $scope.selectUser = function (users) {
        var selects = [];
        var selectsDisp = "";
        if (users.selected == false) {
            users.selected = true;
            users.backgroundColor = "#151c2b";
            users.color = "grey";
        } else {
            users.selected = false;
            users.backgroundColor = "grey";
            users.color = "#151c2b";
        }
        for (var j in $scope.userNames) {

            $scope.selectedDevelopers = [];
            if ($scope.userNames[j].selected == true) {
                selects.push($scope.userNames[j].name);
                selectsDisp += " " + $scope.userNames[j].name + " | ";
            }
        }
        $scope.selectedDevelopers = selects;
        $scope.selectedDevelopersDisp = selectsDisp;

    };
    
        //-------------Submit new project -----------------------


    $scope.CreateProject = function () {
        $scope.sprintTotal = [];
        for (var i = 1; i <= $scope.project.sprints; i++) {
            $scope.sprintTotal.push(i);
        }

        var model = {

            name: $scope.project.name,
            description: $scope.project.description,
            startDate: $scope.project.startDate,
            sprints: $scope.sprintTotal,
            sprintLength: $scope.project.sprintLength,
            daysOffPerSprint: $scope.project.daysOffPerSprint,
            completionDate: $scope.project.completionDate,
            contributors: $scope.selectedDevelopers,
            designSpec: $scope.project.designSpec,
            techSpec: $scope.project.techSpec
        };

        $http.post("/projectMaker", model).success(function (response) {
            if (response.success == true) {
                $scope.$parent.projectSuccess = true;
                $scope.$parent.projectSuccessMessage = "Project Created";

            } else {
                $scope.showStoryError = true;
                $scope.storyErrorMsg = "Project Failed";
            }

        });
        
            //-------------reset variables -----------------------
        
        $scope.project.name = "";
        $scope.project.description = "";
        $scope.project.startDate = "";
        $scope.project.sprints = "";
        $scope.sprintTotal = [];
        $scope.project.sprintLength = "";
        $scope.project.daysOffPerSprint = "";
        $scope.project.completionDate = "";
        $scope.selectedDevelopersDisp = "Select Contributing Developers";
        $scope.project.designSpec = "";
        $scope.project.techSpec = "";




    };
    }])



//------------------------------------------------Show Stories Controller -----------------------------------------------


.controller('StorysCtrl', ['$scope', '$http', function ($scope, $http) {

    
    //-------------declare variables -----------------------

    $scope.currentEffort = 0;
    $scope.storyUpdate = {};
    $scope.updateButton = true;
    $scope.updateEffortShow = false;
    $scope.bigStories = [];
    $scope.stories = [];
    $scope.showSprints = {};
    $scope.showStorys = {};
    $scope.showSprints.show = false;
    $scope.showStorys.show = false;
    $scope.showSprints.name = "";
    $scope.showStorys.sprintId = "";
    $scope.currentStory = {};
    $scope.currentStory.show = false;
    $scope.showStorys.search = false;
    $scope.storySearch = "";
    $scope.storyRemoveShow = false;
    $scope.storySearchShow = true;
    $scope.currentStoryBox = {};
    $scope.projectNames = [];

    
    
    //-------------end declare variables -----------------------


            //-------------Count Effort -----------------------

    $scope.currentStoryEffort = function () {

        var totalEfforts = 0;
        var countEfforts = 0;

        for (var f in $scope.currentStory.efforts) {

            totalEfforts += Number($scope.currentStory.efforts[f].effort);
            countEfforts++
        }

        return totalEfforts;

    };


        //-------------show update effort input -----------------------
    
    $scope.UpdateEffortButton = function () {
        $scope.updateButton = false;
        $scope.updateEffortShow = true;

    };
    
        //-------------update effort -----------------------

    $scope.UpdateEffort = function () {

        var model = {
            project: $scope.currentStory.project,
            id: $scope.currentStory.id,
            effortUpdate: {
                effort: Number($scope.currentEffort),
                date: new Date().toDateString()
            }
        };
        console.log(model);

        $http.post("/updateEffort", model).success(function (response) {
            if (response.success == true) {
                $scope.message_success = true;
                $scope.updateButton = true;
                $scope.updateEffortShow = false;
                $scope.currentEffort = 0;
            } else {
                $scope.message_error_check = true;
                $scope.message_error = "message failed";
            }
        });

    };

        //-------------Remove Searched Stories -----------------------
    
    $scope.RemoveStorySearch = function () {

        $scope.showStorys.search = false;
        $scope.storyRemoveShow = false;
        $scope.storySearchShow = true;
        $scope.storySearch = "";
    };
    
        //-------------show stories on sprint select -----------------------

    $scope.storyShow = function (id, project) {
        for (var chill in $scope.bigStories) {
            if ((id == $scope.bigStories[chill].id) && (project == $scope.bigStories[chill].project) && ($scope.currentStory.show == false)) {
                $scope.currentStory = $scope.bigStories[chill];
                return $scope.currentStory.show = true;
            } else {
                $scope.currentStory.show = false;
            }
        }
    };
    
        //-------------show percentage of story complete / currently not used -----------------------

    $scope.storyShowPercent = function (id, project) {
        var totalEfforts = 0;
        var percentComplete = 0;
        for (var chill in $scope.bigStories) {
            if ((id == $scope.bigStories[chill].id) && (project == $scope.bigStories[chill].project) && ($scope.currentStory.show == false)) {
                $scope.currentStoryBox = $scope.bigStories[chill];
            }
        }

        for (var f in $scope.currentStoryBox.efforts) {
            totalEfforts += Number($scope.currentStoryBox.efforts[f].effort);

        }
        percentComplete = ((totalEfforts / $scope.currentStoryBox.days) * 100);
        return percentComplete;

    };
    
        //-------------show global sprints-----------------------

    $scope.gsprints = function (projectName) {
        if ((projectName == $scope.showSprints.name) && ($scope.showSprints.show == true)) {
            $scope.showSprints.show = false;
            $scope.currentStory.show = false;
            $scope.showStorys.show = false;
        } else {
            $scope.showSprints.show = true;
            $scope.showSprints.name = projectName;
        }
    };
        
        //-------------show global stories -----------------------

    $scope.gstorys = function (id) {
        if ((id == $scope.showStorys.sprintId) && ($scope.showStorys.show = true)) {
            $scope.showStorys.show = false;
            $scope.currentStory.show = false;
        } else {
            $scope.showStorys.show = true;
            $scope.showStorys.sprintId = id;
        }
    };
    
    //-------------get stories -----------------------

    $http.get('/retrieveStories').then(function (response) {
        $scope.bigStories = response.data.success;

    });

    //-------------get project names -----------------------
    
    $http.get('/retrieveProjects').then(function (response) {
        $scope.projectNames = response.data.success;
    });

    //-------------Render Stories -----------------------

    $scope.renderStories = function (projectName, sprintID) {
        $scope.stories = [];
        for (var a in $scope.stories) {
            if ($scope.bigStories[a].project == projectName && $scope.bigStories[a].sprint == ("Sprint #" + sprintID)) {
                $scope.stories.push($scope.bigStories[a]);
            }
        }
    };
    
    //-------------turn on stories searched display -----------------------
    
        $scope.storySearchOn = function () {
        $scope.showStorys.search = true;
        $scope.storyRemoveShow = true;
        $scope.storySearchShow = false;

    };



    }])




//------------------------------------------------ Show Global Stories Controller (for Admin) -----------------------------------------------


.controller('GlobalStorysCtrl', ['$scope', '$http', function ($scope, $http) {
    
    //-------------declare variables -----------------------

    $scope.bigStories = [];
    $scope.stories = [];
    $scope.showSprints = {};
    $scope.showStorys = {};
    $scope.showSprints.show = false;
    $scope.showStorys.show = false;
    $scope.showSprints.name = "";
    $scope.showStorys.sprintId = "";
    $scope.currentStory = {};
    $scope.currentStory.show = false;
    $scope.showStorys.search = false;
    $scope.storySearch = "";
    $scope.storyRemoveShow = false;
    $scope.storySearchShow = true;
    $scope.projectNames = [];
    
    
    //------------- end declare variables -----------------------

    $scope.storySearchOn = function () {
        $scope.showStorys.search = true;
        $scope.storyRemoveShow = true;
        $scope.storySearchShow = false;

    };
    
    //-------------exit story search-----------------------


    $scope.RemoveStorySearch = function () {

        $scope.showStorys.search = false;
        $scope.storyRemoveShow = false;
        $scope.storySearchShow = true;
        $scope.storySearch = "";
    };
    
    //-------------show stories dependant on sprint-----------------------

    $scope.storyShow = function (id, project) {
        for (var chill in $scope.bigStories) {
            if ((id == $scope.bigStories[chill].id) && (project == $scope.bigStories[chill].project) && ($scope.currentStory.show == false)) {
                $scope.currentStory = $scope.bigStories[chill];
                return $scope.currentStory.show = true;
            } else {
                $scope.currentStory.show = false;
            }
        }
    };


    //-------------show sprints dependant on project -----------------------
    
    $scope.gsprints = function (projectName) {
        if ((projectName == $scope.showSprints.name) && ($scope.showSprints.show == true)) {
            $scope.showSprints.show = false;
            $scope.currentStory.show = false;
            $scope.showStorys.show = false;
        } else {
            $scope.showSprints.show = true;
            $scope.showSprints.name = projectName;
        }
    };
    
    //------------- show stories-----------------------

    $scope.gstorys = function (id) {
        if ((id == $scope.showStorys.sprintId) && ($scope.showStorys.show = true)) {
            $scope.showStorys.show = false;
            $scope.currentStory.show = false;
        } else {
            $scope.showStorys.show = true;
            $scope.showStorys.sprintId = id;
        }
    };
    
    //-------------get stories -----------------------
    
    $http.get('/retrieveStories').then(function (response) {
        $scope.bigStories = response.data.success;

    });
    
    //-------------get project names -----------------------

    $http.get('/retrieveProjects').then(function (response) {
        $scope.projectNames = response.data.success;
    });

    //-------------show story info -----------------------

    $scope.renderStories = function (projectName, sprintID) {
        $scope.stories = [];
        for (var a in $scope.stories) {
            if ($scope.bigStories[a].project == projectName && $scope.bigStories[a].sprint == ("Sprint #" + sprintID)) {
                $scope.stories.push($scope.bigStories[a]);
            }
        }
    };



    }])








//------------------------------------------------Dashboard Controller -----------------------------------------------



.controller('DashboardCtrl', ['$scope', '$http', function ($scope, $http) {
    
    //------------- declare variables -----------------------

    $scope.showCompanyDiv = true;
    $scope.showMessagesDiv = false;
    $scope.company = {};
    $scope.userNames = [];
    $scope.message = {};
    $scope.message.to = "Send To";
    $scope.userData = [];
    $scope.userMessages = [];
    $scope.message.id = 2000;
    $scope.userNewMessages = 0;
    $scope.messageSearch = "";
    $scope.messageIn = {};
    $scope.NYTSearch="";
    
    //------------- end declare variables -----------------------

     //-------------search nyt api -----------------------
    
    $scope.newYorkTimesSearch = function() {
        
        var newQuery = $scope.NYTSearch.replace(/\s+/g, '+');
        console.log(newQuery);
        
            //-------------nyt base -----------------------

        var hn_BASE = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + newQuery + '&page=1&sort=newest&api-key=9b671449aee0790a24195cdc9386c661:0:73612733';

        $scope.nytStories = [];
        $scope.now = "";

        $scope.queryNewYork = function () {

            $http.get(hn_BASE).success(function (res) {
                $scope.nytStories = (res.response.docs);
                $scope.now = (res.response.docs[0].headline.main);

            });

        };

        $scope.queryNewYork();
        
    };
    
    //-------------create message date -----------------------

    $scope.dateGeneration = function (mesDate) {
        return mesDate.toDateString();
    };


    //-------------remove message by id -----------------------
    
    $scope.RemoveMessage = function (mesId) {

        var model = {

            id: mesId,
            name: $scope.hombre.name

        };

        $http.post("/removeMessage", model).success(function (response) {
            if (response.success == true) {
                console.log("removed");
                //update messages
                    
                    //-------------update messages-----------------------

                $http.get('/retrieveMessages').then(function (response) {
                    $scope.userData = response.data.success;
                    for (var n in $scope.userData) {
                        if ($scope.hombre.name == $scope.userData[n].name) {
                            $scope.userMessages = ($scope.userData[n].messages);
                               
                        }
                    }
                            //-------------set inner message to show on hover -----------------------
                    
                      for (var x in $scope.userMessages) {
                            $scope.userMessages[x].show = true;
                            $scope.userMessages[x].reply = false;
                      }
                })
            } else {
                //failed

            }
        });
    };
                    
    
            //-------------mark message as read by id on hover -----------------------
    
        $scope.MessageIsRead = function (isRead, mesId) {
            
            if (isRead == false){

        var model = {

            id: mesId,
            name: $scope.hombre.name

        };

        $http.post("/MarkMessageRead", model).success(function (response) {
            if (response.success == true) {
                console.log("MarkedAsRead");
                
                //------------- update messages -----------------------

                $http.get('/retrieveMessages').then(function (response) {
                    $scope.userData = response.data.success;
                    for (var n in $scope.userData) {
                        if ($scope.hombre.name == $scope.userData[n].name) {
                            $scope.userMessages = ($scope.userData[n].messages);
                        }
                    }
                    
                        //-------------update new messages by value of message[?].read -----------------------
                    
                    var newMes = 0;
                    for (var x in $scope.userMessages) {
                        $scope.userMessages[x].show = true;
                        $scope.userMessages[x].reply = false;
                        
                        if ($scope.userMessages[x].read == false) {
                            newMes++;
                        }
                    }
                    $scope.userNewMessages = newMes;
    
                });
            } else {
                //failed

            }
        });
            }
    };


    //-------------change view on dashboard from company info and news-----------------------
    
    $scope.Dashboard = function () {

        $scope.showCompanyDiv = false;
        $scope.showMessagesDiv = true;

    };

    //-------------change view on dashboard from messages -----------------------
    
    $scope.Dashboard1 = function () {
        $scope.showMessagesDiv = false;
        $scope.showCompanyDiv = true;

    };
    
    //-------------get company info, then display info via api's -----------------------

    $http.get('/retrieveCompany').then(function (response) {
        $scope.company = (response.data.success[0]);

        var hn_BASE = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + $scope.company.name + '&page=1&sort=newest&api-key=9b671449aee0790a24195cdc9386c661:0:73612733';

        $scope.nytStories = [];
        $scope.now = "";
        
        //-------------query new york times -----------------------

        $scope.queryNewYork = function () {

            $http.get(hn_BASE).success(function (res) {
                $scope.nytStories = (res.response.docs);
                $scope.now = (res.response.docs[0].headline.main);

            });

        };
        
        //-------------call query nyt -----------------------

        $scope.queryNewYork();
        
        //-------------stock information, currently not used-----------------------

        $scope.symbol = $scope.company.stockName;
        $scope.appData = [];

        var urlSymbol = "http://www.google.com/finance/info?q=NSE:";

        $scope.FetchFeed = function () {
            $http.get(urlSymbol + $scope.symbol).then(function (response) {
                var sinfo = JSON.parse(response.data.slice(4, response.data.length));
                $scope.appData.push({
                    dataNum: $scope.count,
                    id: sinfo[0].id,
                    name: sinfo[0].t,
                    price: sinfo[0].l,
                    diva: sinfo[0].div,
                    open: sinfo[0].pcls_fix,
                    change: sinfo[0].c,
                    pchange: sinfo[0].cp,
                    close: sinfo[0].l,
                    currentPrice: sinfo[0].el_cur,
                    exchange: sinfo[0].e,
                });

            });

        };
        $scope.FetchFeed();



    });
    
    //------------ get usernames  -----------------------

    $http.get('/retrieveNames').then(function (response) {
        $scope.userNames = response.data.success;
        $scope.userNames.push({
            name: "Send To"
        });
    });
    
    //-------------send message! -----------------------

    $scope.SendMessage = function () {

        $scope.userDataSend = [];
        $scope.userMessagesLength = 0;


            //-------------get messages to add proper id on new sent message -----------------------
        
        $http.get('/retrieveMessages').then(function (response) {
            $scope.userDataSend = response.data.success;
            for (var ab in $scope.userData) {
                if ($scope.message.to == $scope.userData[ab].name) {
                    $scope.userMessagesLength = (2000 + $scope.userData[ab].messages.length);
                }
            }

            var model = {
                to: $scope.message.to,
                from: $scope.hombre.name,
                subject: $scope.message.subject,
                text: $scope.message.text,
                urgent: $scope.message.urgent,
                starred: false,
                read: false,
                id: $scope.userMessagesLength
            };
            console.log(model);

            $http.post("/sendMessage", model).success(function (response) {
                if (response.success == true) {
                    $scope.message_success = true;
                } else {
                    $scope.message_error_check = true;
                    $scope.message_error = "message failed";
                }
            });
            
            //-------------reset variables -----------------------

            $scope.message.to = "";
            $scope.message.subject = "";
            $scope.message.text = "";
            $scope.message.urgent = "";

        });
    };

    //-------------switch inner message from message to reply -----------------------
    
    $scope.ActivateMessage = function (currentId) {
        for (var y in $scope.userMessages) {
            if ($scope.userMessages[y].id == currentId) {
                $scope.userMessages[y].show = false;
                $scope.userMessages[y].reply = true;
                console.log($scope.userMessages[y]);
            }
        }

    };
    
    //-------------get messages for user -----------------------

    $http.get('/retrieveMessages').then(function (response) {
        $scope.userData = response.data.success;
        for (var n in $scope.userData) {
            if ($scope.hombre.name == $scope.userData[n].name) {
                $scope.userMessages = ($scope.userData[n].messages);
            }
        }
                //-------------set messages to show on hover -----------------------
        for (var f in $scope.userMessages) {
            $scope.userMessages[f].show = true;
            $scope.userMessages[f].reply = false;
            
            //-------------count new messages -----------------------

            if ($scope.userMessages[f].read == false) {
                $scope.userNewMessages++;
            }
        }

    });
    
    //-------------send message from hover box-----------------------

    $scope.SendMessageIn = function (outgoing) {
        $scope.userDataSend = [];
        $scope.userMessagesLength = 0;


        //-------------get messages to add proper id to new message -----------------------

        $http.get('/retrieveMessages').then(function (response) {
            $scope.userDataSend = response.data.success;
            for (var n in $scope.userData) {
                if (outgoing == $scope.userData[n].name) {
                    $scope.userMessagesLength = (2000 + $scope.userData[n].messages.length);
                }
            }

            var model = {
                to: outgoing,
                from: $scope.hombre.name,
                subject: $scope.messageIn.subject,
                text: $scope.messageIn.text,
                urgent: $scope.messageIn.urgent,
                starred: false,
                read: false,
                id: $scope.userMessagesLength
            };
            console.log(model);

            $http.post("/sendMessage", model).success(function (response) {
                if (response.success == true) {
                    $scope.message_success = true;
                } else {
                    $scope.message_error_check = true;
                    $scope.message_error = "message failed";
                }
            });

             //-------------set variables to "" and switch to show message instead of reply functionality-----------------------
            
            $scope.message.to = "";
            $scope.messageIn.subject = "";
            $scope.messageIn.text = "";
            $scope.messageIn.urgent = "";
             $scope.userMessages[f].show = true;
            $scope.userMessages[f].reply = false;

        });

    };


    }])



//------------------------------------------------Company Info Controller -----------------------------------------------


.controller('CompanyCtrl', ['$scope', '$http', function ($scope, $http) {
    
    //------------- declare variables -----------------------

    $scope.$parent.company_success = false;
    $scope.$parent.company_error_check = false;
    $scope.setupShow = false;
    $scope.updateShow = false;
    $scope.buttons = true;
    $scope.upCompany = {};
    $scope.company = {};
    
    //------------- end declare variables -----------------------

    
     //-------------get company info -----------------------    
    
    $http.get('/retrieveCompany').then(function (response) {
        $scope.company = (response.data.success[0]);
    });
    
     //-------------show company update form -----------------------

    $scope.companyUpdateShow = function () {
        if ($scope.updateShow == false) {
            $scope.updateShow = true;
        } else {
            $scope.updateShow = false;
        }
        $scope.buttons = false;
    };
    
    //-------------show company setup form -----------------------

    $scope.companySetupShow = function () {
        if ($scope.setupShow == false) {
            $scope.setupShow = true;
        } else {
            $scope.setupShow = false;
        }
        $scope.buttons = false;
    };

    //-------------set company info -----------------------

    $scope.CompanyInfo = function () {

        var model = {
            name: $scope.newCompany.name,
            address: $scope.newCompany.address,
            phone: $scope.newCompany.phoneNumber,
            stockName: $scope.newCompany.stockName
        };

        $http.post("/companyInfo", model).success(function (response) {
            if (response.success == true) {
                $scope.$parent.company_success = true;
                $scope.$parent.company_message = "Welcome " + model.name + "!";
                window.location = "#/dashboard";
            } else {
                $scope.$parent.company_error_check = true;
                $scope.$parent.company_error = "Company failed";
            }
        });

    };

    //-------------update company info-----------------------
    
    $scope.CompanyInfoUpdate = function () {


        var upModel = {
            oldName: $scope.company.name,
            name: $scope.upCompany.name,
            address: $scope.upCompany.address,
            phone: $scope.upCompany.phoneNumber,
            stockName: $scope.upCompany.stockName
        };

        $http.post("/updateCompanyInfo", upModel).success(function (response) {
            if (response.success == true) {
                $scope.$parent.company_success = true;
                $scope.$parent.company_message = "Welcome " + upModel.name + "!";
                $scope.company = upModel;
                window.location = "#/dashboard";
            } else {
                $scope.$parent.company_error_check = true;
                $scope.$parent.company_error = "Company failed";
            }
        });

    };

    }])



//------------------------------------------------Analytics Controller -----------------------------------------------


.controller('AnalyticsCtrl', ['$scope', '$http', function ($scope, $http) {
    
    //------------- declare variables -----------------------

    $scope.bigStories = {};
    $scope.whichData = {};
    
    $scope.currentEffort = 0;
    $scope.storyUpdate = {};
    $scope.updateButton = true;
    $scope.updateEffortShow = false;
    $scope.bigStories = [];
    $scope.stories = [];
    $scope.showSprints = {};
    $scope.showStorys = {};
    $scope.showSprints.show = false;
    $scope.showStorys.show = false;
    $scope.showSprints.name = "";
    $scope.showStorys.sprintId = "";
    $scope.currentStory = {};
    $scope.currentStory.show = false;
    $scope.showStorys.search = false;
    $scope.storySearch = "";
    $scope.storyRemoveShow = false;
    $scope.storySearchShow = true;
    $scope.currentStoryBox = {};
    $scope.dateIN = {};
    
    
    
    
    //------------- end declare variables -----------------------

    //-------------get stories info -----------------------

    $http.get('/retrieveStories').then(function (response) {
        $scope.data1 = response.data.success;
        console.log($scope.bigStories);

    });

    //-------------select which data to show-----------------------
    
    $scope.ChooseData = function (ind) {

        $scope.whichData.ind = ind;

    };
    
    //-------------get current story total effort -----------------------

    $scope.currentStoryEffort = function () {

        var totalEfforts = 0;
        var countEfforts = 0;

        for (var f in $scope.currentStory.efforts) {

            totalEfforts += Number($scope.currentStory.efforts[f].effort);
            countEfforts++
        }

        return totalEfforts;

    };
    

    $http.get('/retrieveStories').then(function (response) {
        $scope.bigStories = response.data.success;

    });
    
    //-------------Get Project Names -----------------------

    $scope.projectNames = [];


    $http.get('/retrieveProjects').then(function (response) {
        $scope.projectNames = response.data.success;
    });

    //-------------show stories -----------------------

    $scope.renderStories = function (projectName, sprintID) {
        $scope.stories = [];
        for (var a in $scope.stories) {
            if ($scope.bigStories[a].project == projectName && $scope.bigStories[a].sprint == ("Sprint #" + sprintID)) {
                $scope.stories.push($scope.bigStories[a]);
            }
        }
    };



    }])


//------------------------------------------------CodeShare Controller// NOT USED-----------------------------------------------


.controller('CodeShareCtrl', ['$scope', '$http', function ($scope, $http) {
    
    
    //------------- declare variables -----------------------

    $scope.codeShareBox;

    //------------- end declare variables -----------------------
    
        //-------------on change to box, post info -----------------------
    
    $scope.CodeShareBoxChange = function () {

        var model = {

            codeShareBox: $scope.codeShareBox

        };

        $http.post("/codeShareBoxPost", model).success(function (response) {
            if (response.success == true) {
                console.log("update Success");

            } else {

            }
        });
    };



//-------------get box info -----------------------

    var GetText = function () {

        var model = {

            codeShareBox: $scope.codeShareBox

        };

        $http.post("/codeShareBoxGet").success(function (response) {
            if (response.failure == false) {
                $scope.codeShareBox = response.success[0].box;
                GetText();

            } else {
                console.log("error, error");

            }
        });

    };

    GetText();


}])


//------------------------------------------------Main Controller -----------------------------------------------


.controller('AppCtrl', ['$scope', '$http', function ($scope, $http) {
    
    //------------- declare variables -----------------------
    
    $scope.company = {};
    $scope.hombre = {};
    $scope.hombre.name = "";
    $scope.hombre.signedIn = false;
    $scope.hombre.admin = false;
    $scope.hombre.user = false;
    $scope.messageNav={};
    $scope.messageNav.to ="Send To";
    
    
    //------------- end declare variables -----------------------
    
        //-------------get company info -----------------------

    $http.get('/retrieveCompany').then(function (response) {
        $scope.company = (response.data.success[0]);
    });

        //-------------logout button / reset variables to "" and nt loggd in -----------------------

    $scope.Logout = function () {
        $scope.hombre = {};
        $scope.hombre.name = "";
        $scope.hombre.signedIn = false;
        $scope.hombre.admin = false;
        $scope.hombre.user = false;
        $scope.login_success = false;
        window.location = "#/login";
         $scope.userNamesNav = [];
    };
    
    
    //-------------get user names for navbar messaging -----------------------
    
        $http.get('/retrieveNames').then(function (response) {
        $scope.userNamesNav = response.data.success;
        $scope.userNamesNav.push({
            name: "Send To"
        });
    });

    //-------------send message from nav -----------------------
    
    $scope.SendMessageNav = function () {

        $scope.userDataSend = [];
        $scope.userMessagesLength = 0;


        //-------------get messages length to add proper id to new message -----------------------
        
        $http.get('/retrieveMessages').then(function (response) {
            $scope.userDataSend = response.data.success;
            for (var ab in $scope.userData) {
                if ($scope.message.to == $scope.userData[ab].name) {
                    $scope.userMessagesLength = (2000 + $scope.userData[ab].messages.length);
                }
            }

            var model = {
                to: $scope.messageNav.to,
                from: $scope.hombre.name,
                subject: $scope.messageNav.subject,
                text: $scope.messageNav.text,
                urgent: $scope.messageNav.urgent,
                starred: false,
                read: false,
                id: $scope.userMessagesLength
            };
            console.log(model);

            $http.post("/sendMessage", model).success(function (response) {
                if (response.success == true) {
                    $scope.message_success = true;
                } else {
                    $scope.message_error_check = true;
                    $scope.message_error = "message failed";
                }
            });
            
            //-------------reset variables-----------------------

            $scope.messageNav.to = "";
            $scope.messageNav.subject = "";
            $scope.messageNav.text = "";
            $scope.messageNav.urgent = "";

        });
    };

    
    
    //------------------------------------------------End Controllers-----------------------------------------------
    }]);


