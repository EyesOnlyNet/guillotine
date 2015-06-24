Event.types = {
    mixFirst5OfQueue: 1,
    behead1More: 2,
    add2Points: 3,
    add3NoblesToQueue: 4,
    remove1NobleFromQueue: 5,
    blockQueueChanges: 6,
    moveMarieToTheFront: 7,
    extraPointsForRedNobles: 8,
    extraPointsForBlueNobles: 9,
    extraPointsForGreenNobles: 10,
    extraPointsForVioletNobles: 11,
    onePointForBlackNobles: 12,
    moveGuillotineToOtherEnd: 13,
    drawActionCardWhenBeheadVioletNoble: 14,
    remove2Points: 15,
    draw1ActionCard: 16,
    add2PointsIfHasCountess: 17,
    add2PointsIfHasCount: 18,
    add1NobleToQueue: 19,
    multiplyPointsForGuards: 20,
    moveToEndOfQueueIfActionCardPlayed: 21,
    multiplyPointsForBlackNobles: 22,
    remove1ActionCard: 23,
    giveNobleToPlayer: 24,
    typesdraw1Noble: 25,
    disableActionCards: 26
};

Event.steps = {
    preBehead: 1,
    postBehead: 2
};

Event.interactions = {
    markNoblesInQueue: 1
};

function Event() {
    this.type = 0;
    this.step = 0;
    this.interaction = 0;
};
