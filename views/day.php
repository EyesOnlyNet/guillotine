<link rel="stylesheet" href="/styles/player.css">
<link rel="stylesheet" href="/styles/day.css">

<header class="header row">
    <div class="day col-xs-1 well well-sm">
        <h1>Tag {{dayView.game.day}}</h1>
    </div>

    <div class="info-bar col-xs-11 text-right">
        <div class="well well-sm">
            <ul class="list-inline player-list">
                <li class="player" ng-repeat="player in dayView.game.playerList">
                    <div class="compact panel panel-default"
                         ng-class="{'active': dayView.game.activePid === player.pid, 'me': me.pid === player.pid}">
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
</header>

<div class="container">
    <div class="col-xs-12" ng-show="!dayView.game.day">
        <p ng-show="dayView.game.activePid === me.pid && dayView.game.playerList.length > 1">
            <span>
                Das Spiel kann gestartet werden:
                <button ng-click="dayView.startGame()" class="btn btn-warning btn-sm">Start</button>
            </span>
        </p>

        <p ng-show="dayView.game.activePid !== me.pid">
            Das Spiel startet, sobald genügend Henker teilnehmen.
        </p>

        <p>
            Henker einladen:
            <span class="well well-sm">
                <?= sprintf('http://%s/#/guest/{{dayView.game.gid}}', filter_input(INPUT_SERVER, 'HTTP_HOST')); ?>
            </span>
        </p>
    </div>

    <div class="row">
        <ul class="col-xs-12 queue list-inline" ng-show="dayView.game.day">
            <li ng-repeat="card in dayView.game.queue">
                <div class="panel panel-default" ng-class="card.color" ng-click="dayView.behead()">
                    <div class="panel-heading">{{card.title}}</div>
                    <div class="panel-body">
                        <h3>{{card.points}}</h3>
                    </div>
                </div>
            </li>
        </ul>
    </div>

    <pre>
        {{dayView.game | json}}
    </pre>

    <pre>
        {{me | json}}
    </pre>
</div>
