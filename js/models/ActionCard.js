/* global Event */

ActionCard.cards = [
    new ActionCard(
        'Revolte',
        'Mische die ersten 5 Karten der Warteschlange.',
        Event.steps.preBehead,
        false, false,
        Event.types.mixFirst5OfQueue,
        null
    ),
    new ActionCard(
        'Doppelkopf',
        'Köpfe den Ersten der Warteschlange.',
        Event.steps.postBehead,
        false, false,
        Event.types.behead1More,
        null
    ),
    new ActionCard(
        'Fortuna',
        'Du bekommst 2 Extrapunkte.',
        Event.steps.preBehead,
        true, true,
        Event.types.add2Points,
        null
    ),
    new ActionCard(
        'Nachschub',
        'Lege 3 Adlige an das Ende der Warteschlange.',
        Event.steps.preBehead,
        false, false,
        Event.types.add3NoblesToQueue,
        null
    ),
    new ActionCard(
        'Freigang',
        'Entferne einen beliebigen Adligen aus der Warteschlange.',
        Event.steps.preBehead,
        false, false,
        Event.types.remove1NobleFromQueue,
        Event.interactions.markNoblesInQueue
    ),
    new ActionCard(
        'Furchtlos',
        'Die Reihenfolge der Warteschlange darf solange nicht verändert werden, wie diese Karte ausgespielt ist.',
        Event.steps.preBehead,
        true, false,
        Event.types.blockQueueChanges,
        null
    ),
    new ActionCard(
        'Die Mutige',
        'Bewege Marie Antoinette an die Spitze der Warteschlange.',
        Event.steps.preBehead,
        true, false,
        Event.types.moveMarieToTheFront,
        null
    ),
    new ActionCard(
        'Königshaus',
        'Du erhältst für jeden roten Adligen einen Extrapunkt.',
        Event.steps.preBehead,
        true, true,
        Event.types.extraPointsForRedNobles,
        null
    ),
    new ActionCard(
        'Glaubensbekenntnis',
        'Du erhältst für jeden blauen Adligen einen Extrapunkt.',
        Event.steps.preBehead,
        true, true,
        Event.types.extraPointsForBlueNobles,
        null
    ),
    new ActionCard(
        'Volksherschaft',
        'Du erhältst für jeden grünen Adligen einen Extrapunkt.',
        Event.steps.preBehead,
        true, true,
        Event.types.extraPointsForGreenNobles,
        null
    ),
    new ActionCard(
        'Blaues Blut',
        'Du erhältst für jeden violetten Adligen einen Extrapunkt.',
        Event.steps.preBehead,
        true, true,
        Event.types.extraPointsForVioletNobles,
        null
    ),
    new ActionCard(
        'Glück im Unglück',
        'Jeder schwarze Adlige zählt einen Punkt.',
        Event.steps.preBehead,
        true, true,
        Event.types.onePointForBlackNobles,
        null
    ),
    new ActionCard(
        'Umgedreht',
        'Stelle die Guillotine an das andere Ende der Warteschlange.',
        Event.steps.preBehead,
        false, false,
        Event.types.moveGuillotineToOtherEnd,
        null
    ),
    new ActionCard(
        'Adelsanwärter',
        'Für jeden violetten geköpften Adligen darfst du eine Aktionskarte ziehen.',
        Event.steps.postBehead,
        true, false,
        Event.types.drawActionCardWhenBeheadVioletNoble,
        null
    ),
    new ActionCard(
        'Unglück',
        'Du bekommst 2 Punkte abgezogen.',
        Event.steps.preBehead,
        true, true,
        Event.types.remove2Points,
        null
    )
];

function ActionCard(title, text, step, persistent, playAfterLastDay, event, interaction) {
    this.title = title || '';
    this.text = text || '';
    this.event = event || null;
    this.step = step || '';
    this.playable = true;
    this.persistent = persistent || false;
    this.interaction = interaction || null;
    this.playableAfterLastDay = playAfterLastDay || false;
}
