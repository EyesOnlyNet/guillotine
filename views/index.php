<h1 class="well">
    Guillotine
    <small>Lass die Köpfe rollen</small>
</h1>

<div class="well">
    <form class="row form-horizontal">
        <label class="col-xs-12">
            <span class="col-xs-4 control-label lead">Hallo Henker, wie ist dein Name:</span>
            <span class="col-xs-6 input-group btn-group input-group-lg">
                <input type="text" class="form-control" ng-model="playerName">
                <span class="input-group-btn">
                    <button class="btn btn-lg btn-warning" ng-disabled="!playerName" ng-click="addPlayer()">
                        an Exekution teilnehmen
                    </button>
                </span>
            </span>
        </label>
    </form>
</div>

<div class="container" ng-show="game.playerList.length">
    <h3>Mitspieler gefunden:</h3>

    <ul>
        <li ng-repeat="player in game.playerList">
            {{player.name}}
        </li>
    </ul>
</div>
