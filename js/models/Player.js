function Player(name) {
    this.pid = null;
    this.name = name || '';
    this.color = '';
    this.points = 0;
    this.bonusPoints = 0;
    this.nobleCards = [];
    this.actionCards = [];
    this.actionCardPlayed = false;
    this.activeActionCards = [];
    this.activeInteractionCard = null;

    /**
     * berechnen der Punktzahl
     */
    this.computePoints = function() {
        this.points = 0;

        for (var i in this.nobleCards) {
            if (!isNaN(this.nobleCards[i].points)) {
                this.points += this.nobleCards[i].points;
            }
        }
    };

    /**
     * erzeugt einen unique identifier
     */
    this.createUid = function() {
        return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).substr(-4);
    };

    this.init = function () {
        this.pid = this.createUid();
    };

    this.init();
}
