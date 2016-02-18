define([], function() {
    'use strict';

    function UuidService() {
        return {
            create: create
        };

        function create() {
            return ('0000' + (Math.random() * Math.pow(36,4) << 0).toString(36)).substr(-4);
        }
    }

    return UuidService;
});