function Player(name) {
    this.pid = null;
    this.name = name || '';
    this.points = 0;
    this.nobleCards = [];
    this.actionCards = [];
    this.actionCardPlayed = false;
    this.activeActionCards = [];
}
