/* global Event */

NobleCard.colors = {
    green: 'green',
    red: 'red',
    violet: 'violet',
    blue: 'blue',
    black: 'black'
};

NobleCard.cards = [
    new NobleCard('Pisspage',             NobleCard.colors.violet,  1),
    new NobleCard('Coiffeur',             NobleCard.colors.violet,  1),
    new NobleCard('Königlicher Kartograf',NobleCard.colors.violet,  1),
    new NobleCard('Hofdame',              NobleCard.colors.violet,  1, Event.types.draw1ActionCard),
    new NobleCard('Lord',                 NobleCard.colors.violet,  2, Event.types.draw1ActionCard),
    new NobleCard('Lady',                 NobleCard.colors.violet,  2, Event.types.draw1ActionCard),
    new NobleCard('Graf',                 NobleCard.colors.violet,  2, Event.types.add2PointsIfHasCountess),
    new NobleCard('Gräfin',               NobleCard.colors.violet,  2, Event.types.add2PointsIfHasCount),
    new NobleCard('Flotter Fürst',        NobleCard.colors.violet,  2, Event.types.behead1More),
    new NobleCard('Herzog',               NobleCard.colors.violet,  3),
    new NobleCard('Baron',                NobleCard.colors.violet,  3),
    new NobleCard('Robespierre',          NobleCard.colors.violet,  3, Event.types.endDay),
    new NobleCard('Regent',               NobleCard.colors.violet,  4),
    new NobleCard('Marie Antoinette',     NobleCard.colors.violet,  5),
    new NobleCard('König Ludwig XVI.',    NobleCard.colors.violet,  5),
    new NobleCard('Palastwache 1',        NobleCard.colors.red,     1, Event.types.multiplyPointsForGuards),
    new NobleCard('Palastwache 2',        NobleCard.colors.red,     1, Event.types.multiplyPointsForGuards),
    new NobleCard('Palastwache 3',        NobleCard.colors.red,     1, Event.types.multiplyPointsForGuards),
    new NobleCard('Palastwache 4',        NobleCard.colors.red,     1, Event.types.multiplyPointsForGuards),
    new NobleCard('Palastwache 5',        NobleCard.colors.red,     1, Event.types.multiplyPointsForGuards),
    new NobleCard('Leutnant',             NobleCard.colors.red,     2),
    new NobleCard('Leutnant',             NobleCard.colors.red,     2),
    new NobleCard('Hauptmann der Wache',  NobleCard.colors.red,     2, Event.types.add1NobleToQueue),
    new NobleCard('Oberst',               NobleCard.colors.red,     3),
    new NobleCard('General',              NobleCard.colors.red,     4, Event.types.add1NobleToQueue),
    new NobleCard('Meisterspion',         NobleCard.colors.red,     4, Event.types.moveToEndOfQueueIfActionCardPlayed),
    new NobleCard('Tragische Figur',      NobleCard.colors.black,  -1, Event.types.multiplyPointsForBlackNobles),
    new NobleCard('Unschuldiges Opfer',   NobleCard.colors.black,  -1, Event.types.remove1ActionCard),
    new NobleCard('Märtyrerin',           NobleCard.colors.black,  -1),
    new NobleCard('Märtyrerin',           NobleCard.colors.black,  -1),
    new NobleCard('Märtyrerin',           NobleCard.colors.black,  -1),
    new NobleCard('Der Clown',            NobleCard.colors.black,  -2, Event.types.giveNobleToPlayer),
    new NobleCard('Volksheld',            NobleCard.colors.black,  -3),
    new NobleCard('Henkersknecht',        NobleCard.colors.green,   1, Event.typesdraw1Noble),
    new NobleCard('Gendarm',              NobleCard.colors.green,   1),
    new NobleCard('Gendarm',              NobleCard.colors.green,   1),
    new NobleCard('Unbeliebter Richter',  NobleCard.colors.green,   2, Event.types.disableActionCards),
    new NobleCard('Unbeliebter Richter',  NobleCard.colors.green,   2, Event.types.disableActionCards),
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
    new NobleCard('Kardinal',             NobleCard.colors.blue,    5)
];

function NobleCard(title, color, points, event) {
    this.title = title || '';
    this.color = color || '';
    this.points = points || 0;
    this.event = event || 0;
}
