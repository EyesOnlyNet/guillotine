ActionCard.cards = [
    new ActionCard(
        'Revolte',
        'Mische die ersten 5 Karten der Warteschlange.',
        EventManager.steps.preBehead,
        false, false,
        EventManager.events.mixFirst5OfQueue,
        null
    ),
    new ActionCard(
        'Doppelkopf',
        'Köpfe den Ersten der Warteschlange.',
        EventManager.steps.postBehead,
        false, false,
        EventManager.events.behead1More,
        null
    ),
    new ActionCard(
        'Fortuna',
        'Du bekommst 2 Extrapunkte.',
        EventManager.steps.preBehead,
        true, true,
        EventManager.events.add2Points,
        null
    ),
    new ActionCard(
        'Nachschub',
        'Lege 3 Adlige an das Ende der Warteschlange.',
        EventManager.steps.preBehead,
        false, false,
        EventManager.events.add3NoblesToQueue,
        null
    ),
    new ActionCard(
        'Freigang',
        'Entferne einen beliebigen Adligen aus der Warteschlange.',
        EventManager.steps.preBehead,
        false, false,
        EventManager.events.remove1NobleFromQueue,
        EventManager.interactions.markNoblesInQueue
    ),
    new ActionCard(
        'Furchtlos',
        'Die Reihenfolge der Warteschlange darf solange nicht verändert werden, wie diese Karte ausgespielt ist.',
        EventManager.steps.preBehead,
        true, false,
        EventManager.events.blockQueueChanges,
        null
    ),
    new ActionCard(
        'Die Mutige',
        'Bewege Marie Antoinette an die Spitze der Warteschlange.',
        EventManager.steps.preBehead,
        true, false,
        EventManager.events.moveMarieToTheFront,
        null
    ),
    new ActionCard(
        'Königshaus',
        'Du erhältst für jeden roten Adligen einen Extrapunkt.',
        EventManager.steps.preBehead,
        true, true,
        EventManager.events.extraPointsForRedNobles,
        null
    ),
    new ActionCard(
        'Glaubensbekenntnis',
        'Du erhältst für jeden blauen Adligen einen Extrapunkt.',
        EventManager.steps.preBehead,
        true, true,
        EventManager.events.extraPointsForBlueNobles,
        null
    ),
    new ActionCard(
        'Volksherschaft',
        'Du erhältst für jeden grünen Adligen einen Extrapunkt.',
        EventManager.steps.preBehead,
        true, true,
        EventManager.events.extraPointsForGreenNobles,
        null
    ),
    new ActionCard(
        'Blaues Blut',
        'Du erhältst für jeden violetten Adligen einen Extrapunkt.',
        EventManager.steps.preBehead,
        true, true,
        EventManager.events.extraPointsForVioletNobles,
        null
    ),
    new ActionCard(
        'Glück im Unglück',
        'Jeder schwarze Adlige zählt einen Punkt.',
        EventManager.steps.preBehead,
        true, true,
        EventManager.events.onePointForBlackNobles,
        null
    ),
    new ActionCard(
        'Umgedreht',
        'Stelle die Guillotine an das andere Ende der Warteschlange.',
        EventManager.steps.preBehead,
        false, false,
        EventManager.events.moveGuillotineToOtherEnd,
        null
    ),
    new ActionCard(
        'Adelsanwärter',
        'Für jeden violetten geköpften Adligen darfst du eine Aktionskarte ziehen.',
        EventManager.steps.postBehead,
        true, false,
        EventManager.events.drawActionCardWhenBeheadVioletNoble,
        null
    ),
    new ActionCard(
        'Unglück',
        'Du bekommst 2 Punkte abgezogen.',
        EventManager.steps.preBehead,
        true, true,
        EventManager.events.remove2Points,
        null
    )
]

function ActionCard(title, text, step, persistent, playAfterLastDay, event, interaction) {
    this.title  = title || '';
    this.text   = text || '';
    this.event  = event || null;
    this.step   = step || '';
    this.playable    = true;
    this.persistent  = persistent || false;
    this.interaction = interaction || null;
    this.playableAfterLastDay = playAfterLastDay || false;
}