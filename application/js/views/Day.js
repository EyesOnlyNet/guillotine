function Day() {
    this.game = ko.observable(null);

    // @todo: vll ins Game auslagern und dann immer auf den
    // aktiven Spieler per playerList[activePlayer] zugreifen???
    this.activePlayerIndex = 0;

    this.startGame = function() {
        game = new Game();
        game.playerList = Storage.read('playerList');

        if (null == game.playerList) {
            document.location.href="./index.html";
            return;
        }

        game.started = true;

        game.mixAllCards();
        game.preparePlayers();

        game.activePlayer = game.playerList[this.activePlayerIndex];

        this.game(game);
        this.startDay(1);

        console.log(this.game());
    }

    this.startDay = function(day) {
        game = this.game();

        game.day = day;
        game.fillQueue(Queue.startCount);

        this.game(game);
    }

    this.playActionCard = function(actionCard) {
        if (this.game().activePlayer.actionCardPlayed == true) {
            return;
        }

        this.removeActionCardFromActivePlayer(actionCard);

        if (actionCard.interaction == null) {
            // Events der Aktionskarten ausführen
            this.processActionCards();
        } else {
            // Interaktion der Aktionskarte ausführen
            this.prepareInteraction(actionCard);
        }
    }.bind(this);

    this.behead = function() {
        // Karten köpfen
        this.game().behead();

        // Events der Aktionskarten ausführen
        this.processActionCards();

        // geköpfte Karten dem aktiven Spieler geben
        this.game().activePlayerDrawBeheadedCards();

        // Events der Aktionskarten ausführen
        this.processActionCards();

        // Aktionskarte ziehen
        this.game().activePlayerDrawActionCard();

        // nächsten Spieler bestimmen
        this.nextPlayer();


        // falls die Warteschlange leer ist, nächsten Tag beginnen
        if (this.game().queue.cards.length == 0) {
            this.startDay(this.game().day + 1);
        }
    }.bind(this);

    // abarbeiten der aktiven Events
    this.processActionCards = function() {
        eventManager = new EventManager(this.game());
        eventManager.processEvents();

        this.game(eventManager.getGame());
    }

    // Interaktion vorbereiten
    this.prepareInteraction = function(interactionCard) {
        this.game().activePlayer.activeInteractionCard = interactionCard;
        
        eventManager = new EventManager(this.game());

        console.log(interactionCard.interaction);
        eval('eventManager.' + interactionCard.interaction);
    }
    
    // Interaktion ausführen
    this.interaction = function(data) {
        eventManager = new EventManager(this.game());

        event = this.game().activePlayer.activeInteractionCard.event;

        console.log(data);
        eval('eventManager.' + event);
        
        this.game(eventManager.getGame());
    }

    // nächsten Spieler auswählen
    this.nextPlayer = function() {
        game = this.game();

        game.activePlayer.actionCardPlayed = false;

        this.activePlayerIndex = ++this.activePlayerIndex % game.playerList.length;
        game.activePlayer = game.playerList[this.activePlayerIndex];

        this.game(game);
    }

    // Aktionskarte vom aktiven Spieler entfernen
    this.removeActionCardFromActivePlayer = function(card) {
        game = this.game();

        game.activePlayer.actionCardPlayed = true;
        game.activePlayer.activeActionCards.push(card);

        index = game.activePlayer.actionCards.indexOf(card);
        game.activePlayer.actionCards.splice(index, 1);

        this.game(game);
    }

    this.startGame();
}