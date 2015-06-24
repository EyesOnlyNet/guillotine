<div class="well">
    <form class="row form-horizontal">
        <label class="col-xs-12">
            <span class="col-xs-4 control-label lead">Hallo Scharfrichter, wie ist dein Name:</span>
            <span class="col-xs-6 input-group btn-group input-group-lg">
                <input type="text" class="form-control" ng-model="name">
                <span class="input-group-btn">
                    <button class="btn btn-lg btn-warning" ng-disabled="!name" ng-click="createGame(name)">
                        Exekution starten
                    </button>
                </span>
            </span>
        </label>
    </form>
</div>
