NobleCard.cards = [
    new NobleCard('Hofdame',              NobleCard.colors.violet,  1, Event.types.draw1ActionCard),
    new NobleCard('Lord',                 NobleCard.colors.violet,  2, Event.types.draw1ActionCard),
    new NobleCard('Lady',                 NobleCard.colors.violet,  2, Event.types.draw1ActionCard),
    new NobleCard('Flotter Fürst',        NobleCard.colors.violet,  2, Event.types.behead1More),
    new NobleCard('Robespierre',          NobleCard.colors.violet,  3, Event.types.endDay),
    new NobleCard('Hauptmann der Wache',  NobleCard.colors.red,     2, Event.types.add1NobleToQueue),
    new NobleCard('General',              NobleCard.colors.red,     4, Event.types.add1NobleToQueue),
    new NobleCard('Meisterspion',         NobleCard.colors.red,     4, Event.types.moveToEndOfQueueIfActionCardPlayed),
    new NobleCard('Unschuldiges Opfer',   NobleCard.colors.black,  -1, Event.types.remove1ActionCard),
    new NobleCard('Der Clown',            NobleCard.colors.black,  -2, Event.types.giveNobleToPlayer),
    new NobleCard('Henkersknecht',        NobleCard.colors.green,   1, Event.types.draw1Noble),
    new NobleCard('Unbeliebter Richter',  NobleCard.colors.green,   2, Event.types.disableActionCards),
    new NobleCard('Unbeliebter Richter',  NobleCard.colors.green,   2, Event.types.disableActionCards)
];
