var app = app || {};


app.headers = (function() {
    function Headers(applicationId, restAPIKey) {
        this.appId = applicationId;
        this.restAPIKey = restAPIKey;
    }

    Headers.prototype.getHeaders = function () {
        var headers = {
            'X-Parse-Application-Id': this.appId,
            'X-Parse-REST-API-Key': this.restAPIKey,
            'Content-Type': 'application/json'
        };

        return {
            getHeaders: function () {
                if (sessionStorage.userSession || sessionStorage.userSession) {
                    headers['X-Parse-Session-Token'] = sessionStorage.userSession;
                } else {
                    delete headers['X-Parse-Session-Token'];
                }
                return headers
            },
            clearSession: function () {
                delete headers['X-Parse-Session-Token'];
                return headers
            }


        };
    };


    return {
        load : function (applicationId, restAPIKey) {
            return new Headers(applicationId, restAPIKey);
        }
    }
}());