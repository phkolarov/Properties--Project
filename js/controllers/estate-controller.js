var app = app || {};

app.estateController = function (baseURL, headers) {

    var headers = headers;

    var est = {

        get: function(){

            var url  = baseURL + 'classes/Estates?include=category';
            return app.requester.get(url,headers.getHeaders().getHeaders());
        },
        getCategories: function(){

            var url  = baseURL + 'classes/Category';
            return app.requester.get(url,headers.getHeaders().getHeaders());
        },
        getById: function(id){

            var  url =baseURL + 'classes/Estates/' + id;
            return app.requester.get(url,headers.getHeaders().getHeaders());
        },
        add: function(dataObj){

            var url = baseURL + 'classes/Estates';
            return app.requester.post(url,headers.getHeaders().getHeaders(),dataObj)
        },
        delete: function(Id){

            var url = baseURL + 'classes/Estates/' + Id;
            console.log(Id);
            return app.requester.delete(url, headers.getHeaders().getHeaders());
        },
        edit: function(dataObj,Id){

            var url  = baseURL +  'classes/Estates/'+ Id;
            return app.requester.put(url,headers.getHeaders().getHeaders(),dataObj);
        }
    };

    return {
        est: est
    }
};