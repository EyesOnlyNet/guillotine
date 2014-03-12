NobleCard.colors = {
    green:  'green',
    red:    'red',
    violet: 'violet',
    blue:   'blue',
    black:  'black'
};

NobleCard.cards = [
    new NobleCard('Pisspage',             NobleCard.colors.violet,  1),
    new NobleCard('Coiffeur',             NobleCard.colors.violet,  1),
    new NobleCard('Königlicher Kartograf',NobleCard.colors.violet,  1),
    new NobleCard('Hofdame',              NobleCard.colors.violet,  1, EventManager.events.draw1ActionCard),
    new NobleCard('Lord',                 NobleCard.colors.violet,  2, EventManager.events.draw1ActionCard),
    new NobleCard('Lady',                 NobleCard.colors.violet,  2, EventManager.events.draw1ActionCard),
    new NobleCard('Graf',                 NobleCard.colors.violet,  2, EventManager.events.add2PointsIfHasCountess),
    new NobleCard('Gräfin',               NobleCard.colors.violet,  2, EventManager.events.add2PointsIfHasCount),
    new NobleCard('Flotter Fürst',        NobleCard.colors.violet,  2, EventManager.events.behead1More),
    new NobleCard('Herzog',               NobleCard.colors.violet,  3),
    new NobleCard('Baron',                NobleCard.colors.violet,  3),
    new NobleCard('Robespierre',          NobleCard.colors.violet,  3, EventManager.events.endDay),
    new NobleCard('Regent',               NobleCard.colors.violet,  4),
    new NobleCard('Marie Antoinette',     NobleCard.colors.violet,  5),
    new NobleCard('König Ludwig XVI.',    NobleCard.colors.violet,  5),
    new NobleCard('Palastwache 1',        NobleCard.colors.red,     1, EventManager.events.multiplyPointsForGuards),
    new NobleCard('Palastwache 2',        NobleCard.colors.red,     1, EventManager.events.multiplyPointsForGuards),
    new NobleCard('Palastwache 3',        NobleCard.colors.red,     1, EventManager.events.multiplyPointsForGuards),
    new NobleCard('Palastwache 4',        NobleCard.colors.red,     1, EventManager.events.multiplyPointsForGuards),
    new NobleCard('Palastwache 5',        NobleCard.colors.red,     1, EventManager.events.multiplyPointsForGuards),
    new NobleCard('Leutnant',             NobleCard.colors.red,     2),
    new NobleCard('Leutnant',             NobleCard.colors.red,     2),
    new NobleCard('Hauptmann der Wache',  NobleCard.colors.red,     2, EventManager.events.add1NobleToQueue),
    new NobleCard('Oberst',               NobleCard.colors.red,     3),
    new NobleCard('General',              NobleCard.colors.red,     4, EventManager.events.add1NobleToQueue),
    new NobleCard('Meisterspion',         NobleCard.colors.red,     4, EventManager.events.moveToEndOfQueueIfActionCardPlayed),
    new NobleCard('Tragische Figur',      NobleCard.colors.black,  -1, EventManager.events.multiplyPointsForBlackNobles),
    new NobleCard('Unschuldiges Opfer',   NobleCard.colors.black,  -1, EventManager.events.remove1ActionCard),
    new NobleCard('Märtyrerin',           NobleCard.colors.black,  -1),
    new NobleCard('Märtyrerin',           NobleCard.colors.black,  -1),
    new NobleCard('Märtyrerin',           NobleCard.colors.black,  -1),
    new NobleCard('Der Clown',            NobleCard.colors.black,  -2, EventManager.events.giveNobleToPlayer),
    new NobleCard('Volksheld',            NobleCard.colors.black,  -3),
    new NobleCard('Henkersknecht',        NobleCard.colors.green,   1, EventManager.eventsdraw1Noble),
    new NobleCard('Gendarm',              NobleCard.colors.green,   1),
    new NobleCard('Gendarm',              NobleCard.colors.green,   1),
    new NobleCard('Unbeliebter Richter',  NobleCard.colors.green,   2, EventManager.events.disableActionCards),
    new NobleCard('Unbeliebter Richter',  NobleCard.colors.green,   2, EventManager.events.disableActionCards),
    new NobleCard('Grundbesitzer',        NobleCard.colors.green,   2),
    new NobleCard('Steuereintreiber',     NobleCard.colors.green,   2),
    new NobleCard('Ratsmitglied',         NobleCard.colors.green,   3),
    new NobleCard('Bürgermeister',        NobleCard.colors.green,   3),
    new NobleCard('Gouverneur',           NobleCard.colors.green,   4),
    new NobleCard('Reicher Priester',     NobleCard.colors.blue,    1),
    new NobleCard('Reicher Priester',     NobleCard.colors.blue,    1),
    new NobleCard('Ketzer',               NobleCard.colors.blue,    2),
    new NobleCard('Bischof',              NobleCard.colors.blue,    2),
    new NobleCard('Böse Nonne',           NobleCard.colors.blue,    3),
    new NobleCard('Erzbischof',           NobleCard.colors.blue,    4),
    new NobleCard('Kardinal',             NobleCard.colors.blue,    5),
];

function NobleCard(title, color, points, event) {
    this.title  = title || '';
    this.color  = color || '';
    this.points = points || 0;
    this.event  = event || '';
}