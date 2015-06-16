var app = app || {};

app.userController = function (baseURL, headers) {

    var headers = headers;

    var users = {

        login: function (username, password) {

            var url = baseURL + 'login?' + 'username=' + username + '&password=' + password;

             headers.getHeaders().clearSession();
            return app.requester.get(url,headers.getHeaders().getHeaders())
        },
        logout: function () {

            var url = baseURL + 'logout';

            headers.getHeaders().clearSession();
            return app.requester.post(url,headers.getHeaders().getHeaders());

        },
        register: function (username, password) {

            var url = baseURL + 'users';

            dataObj = {
                username: username,
                password: password
            };

            return app.requester.post(url, headers.getHeaders().getHeaders(), dataObj)

        },
        edit: function (id, username, password, fullname) {

            var url = baseURL + 'users/' + id;
            var data = {
                username: username,
                password: password,
                fullname: fullname
            };

            return app.requester.put(url,headers.getHeaders().getHeaders(), data);
        }
        ,
        getUserData: function (id) {

            var url = baseURL + 'users/' + id;

            return app.requester.get(url, headers.getHeaders().getHeaders())
        }


    };
    return {
        users: users
    }
};