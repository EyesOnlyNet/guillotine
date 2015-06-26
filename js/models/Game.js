/* global Queue, NobleCard, ActionCard */

Game.actionCardsLimit = 5;
Game.queueStartCount = 12;

function Game() {
    this.gid = null;
    this.day = 0;
    this.playerList = [];
    this.queue = null;
    this.activePlayer = null;
    this.actionCardStack = [];
    this.playedActionCards = [];
    this.nobleCardStack = [];
    this.removedNobleCards = [];
    this.beheadedCards = [];

    /**
     * Actionkarten-Stapel befüllen
     */
    this.fillActionCardStack = function() {
        this.actionCardStack = ActionCard.cards;
    };

    /**
     * Adelskarten-Stapel befüllen
     */
    this.fillNobleCardStack = function() {
        this.nobleCardStack = NobleCard.cards;
    };

    /**
     * Alle Karten mischen
     */
    this.mixAllCards = function() {
        this.mixActionCardStack();
        this.mixNobleCardStack();
    };

    /**
     * Actionkarten-Stapel mischen
     */
    this.mixActionCardStack = function() {
        if (this.actionCardStack.length === 0) {
            this.fillActionCardStack();
        }

        this.actionCardStack = this.mixCards(this.actionCardStack);
    };

    /**
     * Adelskarten-Stapel mischen
     */
    this.mixNobleCardStack = function() {
        if (this.nobleCardStack.length === 0) {
            this.fillNobleCardStack();
        }

        this.nobleCardStack = this.mixCards(this.nobleCardStack);
    };

    /**
     * mischt die übergebenen Karten und gibt diese zurück
     */
    this.mixCards = function(cards) {
        length = cards.length;
        mixCycles = length * 3;

        for (i = 0; i < mixCycles; i++) {
            position   = Math.round((Math.random() * mixCycles)) % length;
            randomCard = cards[position];

            cards.splice(position, 1);
            cards.push(randomCard);
        }

        return cards;
    };

    /**
     * Auffüllen der Warteschlange
     *
     * @param count - auf wieviel die Warteschlange aufgefüllt werden soll
     */
    this.fillQueue = function(count) {
        if (this.queue === null) {
            this.queue = new Queue();
        }

        count -= this.queue.cards.length;
        cards = this.queue.cards.concat(this.drawNobleCards(count));
        this.queue.cards = cards;
    };

    /**
     * Karte(n) vom Actionkarten-Stapel ziehen
     *
     * @param count - wieviel Karten gezogen werden sollen
     */
    this.drawActionCards = function(count) {
        cards = [];

        if (count > 0) {
            cards = this.actionCardStack.splice(0, count);
        }

        return cards;
    };

    /**
     * Karte(n) vom Adelskarten-Stapel ziehen
     *
     * @param count - wieviel Karten gezogen werden sollen
     */
    this.drawNobleCards = function(count) {
        cards = [];

        if (count > 0) {
            cards = this.nobleCardStack.splice(0, count);
        }

        return cards;
    };

    /**
     * Verteilen der Karten an die Spieler
     */
    this.preparePlayers = function() {
        for (i = 0; i < Game.actionCardsLimitPerPlayer; i++) {
            for (var i in this.playerList) {
                if (this.playerList[i].count >= Game.actionCardsLimitPerPlayer) {
                    continue;
                }

                cards = this.playerList[i].actionCards.concat(this.drawActionCards(1));
            }
        }
    };

    /**
     * Ändern der Richtung der Warteschlange
     */
    this.changeQueueDirection = function() {
        this.queue.direction = Queue.direction.rtl - this.queue.direction;
    };

    /**
     * den ersten Adligen der Reihe köpfen
     */
    this.behead = function() {
        card = null;

        // ersten in der Reihe köpfen
        if (this.queue.direction === Queue.direction.ltr) {
            card = this.queue.cards.pop();
        } else {
            card = this.queue.cards.shift();
        }

        this.beheadedCards.push(card);
    };

    /**
     * Übertragen der geköpften Karten an den aktiven Spieler
     */
    this.activePlayerDrawBeheadedCards = function() {
        this.activePlayer.nobleCards = this.activePlayer.nobleCards.concat(this.beheadedCards);
        this.activePlayer.computePoints();

        this.beheadedCards = [];
    };

    /**
     * ziehen einer Aktionskarte
     */
    this.activePlayerDrawActionCard = function() {
        this.activePlayer.actionCards = this.activePlayer.actionCards.concat(this.drawActionCards(1));
    };

    /**
     * erzeugt einen unique identifier
     */
    this.createUid = function() {
        this.gid = ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).substr(-4);
    };

    this.init = function () {
        this.createUid();
        this.fillActionCardStack();
        this.fillNobleCardStack();
        this.mixAllCards();
        this.fillQueue(12);
        this.preparePlayers();
    };

    this.init();
}
