<link rel="stylesheet" href="/styles/day.css">

<header>
    <div class="col-xs-1 well well-sm">
        <h1>Tag {{game.day}}</h1>
    </div>

    <div class="col-xs-11 text-right">
        <ul class="well well-sm list-inline">
            <li ng-repeat="player in game.playerList">
                <div class="panel">
                    <div class="panel-body">
                        {{player.name}}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</header>

<div class="container">
    <ul class="queue list-inline">
        <li ng-repeat="card in game.queue.cards">
            <div class="panel panel-default" ng-class="card.color" ng-click="behead()">
                <div class="panel-heading">{{card.title}}</div>
                <div class="panel-body">
                    <h3>{{card.points}}</h3>
                </div>
            </div>
        </li>
    </ul>

    <pre>
        {{game | json}}
    </pre>
</div>
