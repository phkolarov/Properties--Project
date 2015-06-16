var app = app || {};


app.requester = (function(){


    function Requester (method,url, headers, success,error,data) {

        $.ajax({
            method: method,
            url: url,
            contentType: 'application/json',
            data: JSON.stringify(data),
            headers: headers,
            success: success,
            error: error
        });
    }

    function getRequest(url, headers) {

        var deferred = Q.defer();

        Requester('GET', url, headers, function (success) {
            deferred.resolve(success);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }


    function postRequest(url, headers, data) {

        var deferred = Q.defer();

        Requester('POST', url, headers, function (success) {
            deferred.resolve(success);
        }, function (error) {
            deferred.reject(error);
        }, data);

        return deferred.promise;
    }

    function putRequest(url, headers, data) {

        var deferred = Q.defer();

        Requester('PUT', url, headers, function (success) {
            deferred.resolve(success);
        }, function (error) {
            deferred.reject(error);
        }, data);

        return deferred.promise;
    }

    function deleteRequest(url, headers) {

        var deferred = Q.defer();

        Requester('DELETE', url, headers, function(success){
            deferred.resolve(success)
        }, function(error){
            deferred.reject(error);
        });

        return deferred.promise;

    }

    return{
        get: getRequest,
        post: postRequest,
        put: putRequest,
        delete: deleteRequest
    }
}());