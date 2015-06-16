var app = app || {};


(function () {

    var parseURL = 'https://api.parse.com/1/';
    var parseAppId = 'AOSfQC78afj1Zh7d5vDxF1c2alYu8DEjqGdXi44x';
    var parseRestApiKey = 'yadurTAu5CekG23YvB74BBjJumxOI5BIMD7jseRc';


    var headers = app.headers.load(parseAppId, parseRestApiKey);


    var estModel = app.estateController(parseURL,headers);
    var userModel = app.userController(parseURL,headers);


    app.router = Sammy(function () {
        var selector = '#main';

        //SHOW OR HIDE MAIN MENU
        this.before(function () {

            var session = sessionStorage.userSession;
            if (session) {
                $('#registered').show();
                $('#unregistered').hide();
                //$('#welcomeMenu').text('Welcome, ' + sessionStorage['username']);
            } else {
                $('#registered').hide();
                $('#unregistered').show();
            }
        });

        //BEFORE INITIALISE SAMMY CHECK FOR AUTHENTICATION
        this.before({except: {path:'#\/(register\/|login\/|loginIn|signUp)?'}}, function() {
            var userSession = sessionStorage.userSession;
            if(!userSession) {
                noty({
                    theme: 'relax',
                    text: 'You should be logged in to do this action!',
                    type:'error',
                    timeout: 2000,
                    closeWith: ['click']
                });
                this.redirect('#/');
                return false;
            }
        });

        //CHECK FOR LOG
        this.get('#/', function() {

            var userSession = sessionStorage.userSession;

            if (userSession) {

                app.router.setLocation('#/user/home/')
            } else {

                $(selector).load('./templates/welcome-screen.html')
            }
        });

        //REGISTER
        this.get('#/register/', function() {
            $(selector).load('templates/registration.html')
        });
        this.get('#/signUp', function() {

            var username = $('#username');
            var password = $('#password');
            var confirmpass = $('#confirm-password');

            if(username.val() && password.val() && confirmpass.val() &&  password.val() == confirmpass.val()){

                sessionStorage.username = username.val();

                userModel.users.register(username.val(), password.val())
                    .then(function (data) {
                        sessionStorage.userSession = data.sessionToken;

                        sessionStorage.objectId = data.objectId;

                        app.router.setLocation('#/user/home/');
                    }, function (error) {
                        noty({
                            theme: 'relax',
                            text: error.responseJSON.error,
                            type:'error',
                            timeout: 2000,
                            closeWith: ['click']
                        });
                        app.router.setLocation('#/register/');

                    })

            }else{
                noty({
                    theme: 'relax',
                    text: "Please fill correct input data",
                    type:'error',
                    timeout: 2000,
                    closeWith: ['click']
                });
                app.router.setLocation('#/register/');

            }

        });

        //LOGIN
        this.get('#/login/', function() {
            $(selector).load('templates/login.html')

            var loginButton = $('login-button');

        });
        this.get('#/loginIn', function() {


            var username = $('#username');
            var password = $('#password');


            if(username.val(), password.val()){

                userModel.users.login(username.val(), password.val()).then(function (data) {

                    sessionStorage.userSession = data.sessionToken;
                    sessionStorage.username = data.username;
                    sessionStorage.objectId = data.objectId;

                    noty({
                        theme: 'defaultTheme',
                        text: 'Successfully edited!',
                        type:'success',
                        timeout: 2000,
                        closeWith: ['click']
                    });

                    app.router.setLocation('#/user/home/');

                    console.log(data);
                }, function (error) {
                    noty({
                        theme: 'relax',
                        text: error.responseJSON.error,
                        type:'error',
                        timeout: 2000,
                        closeWith: ['click']
                    });
                    app.router.setLocation('#/login/');
                })
            }
        });

        //HOMEPAGE
        this.get('#/user/home/', function() {

            $('#registered').show();
            $('#unregistered').hide();

            if(sessionStorage.userSession){

                $.get('./templates/welcome-home-screen.html', function(template){

                    var obj = {
                        username: sessionStorage.username
                    };

                    var output = Mustache.render(template, obj);
                    $('#main').html(output);

                })
            }else{
                app.router.setLocation('#/');
            }
        });

        //LOGOUT
        this.get('#/user/logout/', function() {


            if(sessionStorage.userSession){

                userModel.users.logout().then(function (data) {
                    noty({
                        theme: 'defaultTheme',
                        text: 'Successfully logged out!',
                        type:'success',
                        timeout: 2000,
                        closeWith: ['click']
                    });
                    sessionStorage.clear();
                    app.router.setLocation('#/');
                }, function (error) {
                    console.log(error)
                })
            }

        });

        //ESTATES
        this.get('#/user/estates/', function() {

            $.get('templates/estate-list.html', function (template) {



                estModel.est.get()
                    .then(function (data) {

                        var id = sessionStorage.objectId;



                        var curObj = data.results;
                        for(var i in curObj){

                            if(curObj[i].ACL[id]){
                                curObj[i].admin = true
                            }
                        }

                        var obj = {
                            estate: data.results
                        };
                        console.log(obj)
                        var output = Mustache.render(template, obj);
                        $(selector).html(output);


                    }, function (error) {
                        noty({
                            theme: 'relax',
                            text: 'Cannot load estates',
                            type:'error',
                            timeout: 2000,
                            closeWith: ['click']
                        });
                        this.redirect('#/user/home/');
                    })





            });
        });

        //ADD ESTATE
        this.get('#/user/add-estate/', function() {

            $(selector).load('templates/add-estate.html', function (template) {


                    estModel.est.getCategories()
                        .then(function (data) {

                            console.log(data);
                            var obj = {
                                category: data.results
                            };

                            console.log(obj)
                            var output = Mustache.render(template,obj);
                            $(selector).html(output);
                        }, function (error) {
                            console.log(error)
                        });
            })
        });
        this.get('#/user/addingEstate/', function() {

            var name = $('#name');
            var price = $('#price');
            var category = $("select option:selected");


            if(name.val() && price.val() && category.val()){

                var estate = {
                    name: name.val(),
                    price: price.val(),
                    category:{__type:"Pointer",className:"Category",objectId:category.val()},
                    ACL: {}
                };

                estate.ACL['*']= {'read': true};
                estate.ACL[sessionStorage.objectId] = {'read': true, 'write': true};

                estModel.est.add(estate)
                    .then(function (data) {
                        noty({
                            theme: 'defaultTheme',
                            text: 'Successfully added!',
                            type:'success',
                            timeout: 2000,
                            closeWith: ['click']
                        });
                        app.router.setLocation('#/user/estates/');

                    }, function (error) {
                        noty({
                            theme: 'relax',
                            text: 'Cannot add estate',
                            type:'error',
                            timeout: 2000,
                            closeWith: ['click']
                        });
                        this.redirect('#/user/home/');
                    })
            }else{
                noty({
                    theme: 'relax',
                    text: 'Please fill all fields',
                    type:'error',
                    timeout: 2000,
                    closeWith: ['click']
                });
                this.redirect('#/user/home/');
            }


        });

        //DELETING ESTATE
        this.get('#/user/delete-estate/:objectId/', function() {

            var objectId = this.params['objectId'];
            console.log(objectId);

            estModel.est.delete(objectId)
                .then(function (data) {
                    console.log(data)
                    app.router.setLocation('#/user/estates/')
                }, function (error) {
                    console.log(error)
                })
        });

        this.get('#/user/edit-estate/:objectId/:name/:price/:category/', function() {
            var parameters = this.params;

            var estateData = {
                name: parameters.name,
                price: parameters.price,
                objectId: parameters.objectId,
                category:parameters.category
            };
            sessionStorage.estateData = JSON.stringify(estateData);

            $.get('templates/edit-estate.html', function (template) {

                var obj = JSON.parse(sessionStorage.estateData);
                var output = Mustache.render(template, obj);
                $(selector).html(output);

                var editBut = $('#edit-estate-button');

                editBut.on('click', function () {
                    var obj = JSON.parse(sessionStorage.estateData);
                    var name = $('#item-name').val();
                    var price = $('#price').val();

                    var objC = {
                        name: name,
                        price: price
                    };

                    estModel.est.edit(objC,obj.objectId)
                        .then(function (data) {
                            app.router.setLocation('#/user/estates/');
                            noty({
                                theme: 'defaultTheme',
                                text: 'Successfully edited!',
                                type:'success',
                                timeout: 2000,
                                closeWith: ['click']
                            });
                        }, function (error) {
                            noty({
                                theme: 'relax',
                                text: 'Canot Edit Estate!',
                                type:'error',
                                timeout: 2000,
                                closeWith: ['click']
                            });
                            this.redirect('#/');
                        });
                });


            });

        });


        //FILTER
        $.get('#/user/filter/', function (template) {



            console.log('')

        })


    });

    app.router.run('#/');

}());
