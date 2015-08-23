<link rel="stylesheet" href="/styles/player.css">
<link rel="stylesheet" href="/styles/results.css">

<h1 class="well">
    <a href="/#/">Guillotine</a>
    <small>Ergebnisse</small>
</h1>

<section class="row">
    <div class="col-xs-12 text-center">
        <div class="well well-sm">
            <ul class="list-inline player-list">
                <li class="player" ng-repeat="player in game.playerList">
                    <div class="panel panel-default"
                         ng-class="{'active': game.activePid === player.pid, 'me': me.pid === player.pid}">
                        <div class="panel-body">
                            {{player.name}}
                        </div>
                    </div>

                    <div class="detail">
                        <div class="panel panel-default">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    Adelskarten: <span class="badge">{{player.nobleCards.length}}</span>
                                </li>
                                <li class="list-group-item">
                                    Aktionskarten: <span class="badge">{{player.actionCards.length}}</span>
                                </li>
                                <li class="list-group-item">
                                    aktive Aktionskarten: <span class="badge">{{player.activeActionCards.length}}</span>
                                </li>
                                <li class="list-group-item">
                                    Punkte: <span class="badge">{{player.points}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</section>
