function Index() {
    var game = new Game();
    
    this.playerName = ko.observable('');
    
    this.init = function() {
        var gameId = this.getParam('gid');
        
        if (gameId != undefined) {
            this.loadGame(gameId);
        }
    };
    
    this.loadGame = function(gameId) {
        var type = 'GET';
        var url  = '/' + gameId;
        var callback = this.loadGameOrRedirect;
        
        var apiKey  = '?apiKey=50773553e4b03a45bd2f336b'
        var baseUrl = 'https://api.mongolab.com/api/1'
            + '/databases/guillotine'
            + '/collections/games';
    
        url = baseUrl + url + apiKey;
    
        $.ajax({
            type: type,
            url: url,
            contentType: "application/json",
            success: function(data){
                data = JSON.parse(data);
                console.log('SUCCESS');
                console.log(data);
                callback(data);
            },
            error: function(data){
                console.log('ERROR');
                console.log(data);
            }
        });  
    };
    
    this.getParam = function(param) {
        var queryString  = window.location.search.replace('?', '&');
        var searchString = '&' + param + '=';
        
        if (queryString.indexOf(searchString) >= 0) {
            return queryString.split(searchString)[1].split('&')[0];
        }
        
        return null;
    };
    
    this.loadGameOrRedirect = function(data) {
        var pid = this.getParam('pid');

        for (var key in data.players)
        {
            if (data.players[key].id == pid) {
                this.redirect(data);
            }
        }

        game = data;
    }.bind(this);
    
    this.addPlayer = function() {
        var player = this.createPlayer();
        var db     = new Db();
        
        game.players.push(player);
        
        db.saveGame(game, this.redirect);
    };
    
    this.createPlayer = function() {
        var name = this.playerName();
        
        return new Player(name);
    };
    
    this.redirect = function(game) {
        var pid = this.getParam('pid');
        var url = "./start.html?gid=" + game._id + "&pid=";
        
        pid = (pid) ? pid : game.players.pop().id;
        
        document.location.href = url + pid;
    }.bind(this);
    
    this.init();
}