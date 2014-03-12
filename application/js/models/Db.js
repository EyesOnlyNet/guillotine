function Db() {
    this.baseUrl            = 'https://api.mongolab.com/api/1';
    this.databaseGuillotine = '/databases/guillotine';
    this.collectionGame     = '/collections/games';
    this.apiKey             = '?apiKey=50773553e4b03a45bd2f336b'
    
    /**
     * setzt einen ajax-request ab
     */
    this.sendRequest = function(type, url, data, callback) {
        $.ajax({
            type: type,
            url: url,
            data: data,
            contentType: "application/json",
            success: function(data){
                data = JSON.parse(data);
                console.log('#SUCCESS');
                console.log(data);
                if (callback != undefined) {
                    callback(data);
                }
            },
            error: function(data){
                console.log('#ERROR');
                console.log(data);
            }
        });  
    };
    
    this.saveGame = function(game, callback) {
        var type = 'PUT';
        var url  = this.baseUrl + this.databaseGuillotine + this.collectionGame + '/' + game._id + this.apiKey;
        var data = ko.toJSON(game);
        
        this.sendRequest(type, url, data, callback);
    };
}