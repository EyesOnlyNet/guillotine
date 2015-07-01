<!doctype html>
<html ng-app="gameApp" lang="de">
    <head>
        <meta charset="utf-8">
        <title>Lass die Köpfe rollen</title>
        <link rel="shortcut icon" type="image/x-icon" href="/images/icons/crown.ico">
        <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
        <script type="text/javascript" src="/node_modules/angular/angular.min.js"></script>
        <script type="text/javascript" src="/node_modules/angular/angular-route.js"></script>
        <script type="text/javascript" src="/js/models/Me.js"></script>
        <script type="text/javascript" src="/js/models/Game.js"></script>
        <script type="text/javascript" src="/js/models/Event.js"></script>
        <script type="text/javascript" src="/js/models/Player.js"></script>
        <script type="text/javascript" src="/js/models/ActionCard.js"></script>
        <script type="text/javascript" src="/js/models/NobleCard.js"></script>
        <script type="text/javascript" src="/js/app.js"></script>
        <script type="text/javascript" src="/js/services.js"></script>
        <script type="text/javascript" src="/js/controllers.js"></script>
    </head>

    <body>
        <div ng-view ng-mousemove="refresh()"></div>
    </body>
</html>
