EventManager.steps = {
    preBehead: 'beforeBehead',
    postBehead: 'afterBehead',
    endTurn: 'turnEnds',
    all: 'all'
}

EventManager.types = {
    points: 'points',
    player: 'player',
    noble: 'noble',
    action: 'action',
    queue: 'queue'
}

EventManager.interactions = {
    markNoblesInQueue: 'markNoblesInQueue()'
}

EventManager.events = {
    add1NobleToQueue: 'addNoblesToQueue(1)',
    add2Points: 'addPoints(2)',
    add2PointsIfHasCount: '',
    add2PointsIfHasCountess: '',
    add3NoblesToQueue: 'addNoblesToQueue(3)',
    behead1More: 'beheadNobles(1)',
    blockQueueChanges: 'blockQueueChanges()',
    disableActionCards: '',
    draw1ActionCard: 'drawActionCard(1)',
    draw1ActionCardWhenBeheadVioletNoble: '',
    draw1Noble: '',
    endDay: '',
    extraAction: '',
    extraPointsForRedNobles: 'addPointsForNobles(1, NobleCard.colors.red)',
    extraPointsForBlueNobles: 'addPointsForNobles(1, NobleCard.colors.blue)',
    extraPointsForGreenNobles: 'addPointsForNobles(1, NobleCard.colors.green)',
    extraPointsForVioletNobles: 'addPointsForNobles(1, NobleCard.colors.violet)',
    giveNobleToPlayer: '',
    mixFirst5OfQueue: 'mixQueue(5)',
    moveMarieToTheFront: '',
    moveGuillotineToOtherEnd: 'moveGuillotine()',
    moveNoble1StepBack: 'moveNobleCard(1, 1)',
    moveNoble1StepForward: 'moveNobleCard(1, 1)',
    moveNoble2StepsBack: 'moveNobleCard(2, 2)',
    moveNoble2StepsForward: 'moveNobleCard(2, 2)',
    moveNobleMax3StepsBack: 'moveNobleCard(1, 3)',
    moveNobleMax3StepsForward: 'moveNobleCard(1, 3)',
    moveToEndOfQueueIfActionCardPlayed: '',
    multiplyPointsForGuards: '',
    multiplyPointsForBlackNobles: '',
    onePointForBlackNobles: 'pointsForNobles(1, NobleCard.colors.black)',
    remove1NobleFromQueue: 'removeNobleFromQueue()',
    remove2Points: 'addPoints(-2)',
    remove1ActionCard: '',
    swapAllActionCards: 'swapActionCards()',
    swapAnyActionCards: 'swapActionCards(1)'
}

function EventManager(game) {
    this.game = game;

    // abarbeiten aller aktiven Aktionskarten
    this.processEvents = function() {
        this.game.activePlayer.bonusPoints = 0;
        activeActionCards = this.game.activePlayer.activeActionCards;

        for (var card in activeActionCards) {
            console.log(activeActionCards[card].event);
            eval('this.' + activeActionCards[card].event);
        }

        this.removeNonPersistentCards();
    };

    // removes all no-persistent actionCards
    this.removeNonPersistentCards = function() {
        activeActionCards = this.game.activePlayer.activeActionCards;

        for (var card in activeActionCards) {
            if (!activeActionCards[card].persistent) {
                activeActionCards.splice(card, 1);
            }
        }

        this.game.activePlayer.activeActionCards = activeActionCards;
    };

    // das veränderte "Spiel" zurückgeben
    this.getGame = function() {
        return this.game;
    };

    // Guillotine an das andere Ende der Queue stellen
    this.moveGuillotine = function() {
        this.game.changeQueueDirection()
    };

    // der aktive Spieler bekommt Bonuspunkte für farbige Karten
    this.addPointsForNobles = function(points, color) {
        bonusPoints = 0;
        nobleCards  = this.game.activePlayer.nobleCards;

        for (var card in nobleCards) {
            if (nobleCards[card].color == color) {
                bonusPoints += points;
            }
        }

        this.game.activePlayer.bonusPoints += bonusPoints;
    };

    // Karten der angegebenen Farbe sind x Punkte wert
    this.pointsForNobles = function(newPoints, color) {
        bonusPoints = 0;
        nobleCards  = this.game.activePlayer.nobleCards;

        for (var card in nobleCards) {
            if (nobleCards[card].color == color) {
                bonusPoints -= nobleCards[card].points;
                bonusPoints += newPoints;
            }
        }

        this.game.activePlayer.bonusPoints += bonusPoints;
    };

    // der aktive Spieler bekommt BonusPunkte
    this.addPoints = function(count) {
        this.game.activePlayer.bonusPoints += count;
    };

    // köpft mehrer Adlige
    this.beheadNobles = function(count) {
        for (i = 0; i < count; i++) {
            this.game.behead();
        }

        this.game.activePlayerDrawBeheadedCards();
    };

    // Fügt x Adlige an das Ende der Reihe
    this.addNoblesToQueue = function(count) {
        for (i = 0; i < count; i++) {
            nobleCard = this.game.nobleCardStack.pop();

            if (this.game.queue.direction == Queue.direction.ltr) {
                this.game.queue.cards.unshift(nobleCard);
            } else {
                this.game.queue.cards.push(nobleCard);
            }
        }
    };

    // mischt Karten der Warteschlange
    // count == positiv - mischt die ersten x Karten
    // count == negativ - mischt die letzten x Karten
    // count == 0 - mischt alle Karten
    this.mixQueue = function(count) {
        queueCards = this.game.queue.cards;

        if (!this.game.queue.direction) {
            count *= -1;
        }

        if (count == 0) {
            queueCards = this.game.mixCards(queueCards);
        }

        if (count > 0) {
            spliceCards = queueCards.splice(0, count);
            spliceCards = this.game.mixCards(spliceCards);

            queueCards = spliceCards.concat(queueCards);
        }

        if (count < 0) {
            count = Math.abs(count);
            index = queueCards.length - count;
            spliceCards = queueCards.splice(index, count);
            spliceCards = this.game.mixCards(spliceCards);

            queueCards = queueCards.concat(spliceCards);
        }

        this.game.queue.cards = queueCards;
    };

    // autom. eine Aktionskarte ziehen, wenn color geköpft wird
    this.drawActionCard = function(count, color) {
        beheadedCards = this.game.beheadedCards;
        actionCards   = this.game.activePlayer.actionCards;

        for (var card in beheadedCards) {
            if (beheadedCards[card].color == color) {
                cards = this.game.drawActionCards(count);
                actionCards = actionCards.concat(cards);
            }
        }

        this.game.activePlayer.actionCards = actionCards;
    };

    // einen Adligen aus der Warteschlange entfernen
    this.removeNobleFromQueue = function(noble) {
        index = this.game.queue.cards.indexOf(noble);
        this.game.queue.cards.splice(index, 1);
    };

    this.moveNobleCard = function(stepsMin, stepsMax, direction, color) {};
    this.playActionCard = function() {};
    this.blockQueueChanges = function() {};
    this.doublePointsForNoble = function(cardName) {};
    this.multiplyPointsforNoble = function(cardName) {};
    this.swapAllActionCards = function() {};

    // INTERACTIONS //

    this.markNoblesInQueue = function() {
        node = '#queue li';
        $(node).css('border', '1px solid blue');
        $(node).click(function() {
            $(this).remove();
        });
    }
}