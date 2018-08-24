
(function() {
    'use strict';

    angular.module('frontend.websites', []);

    // Module configuration
    angular.module('frontend.websites')
        .config([
            '$stateProvider',
            function config($stateProvider) {
                $stateProvider
                    .state('websites', {
                        parent : 'frontend',
                        url: '/websites',
                        data : {
                            activeNode : true,
                            pageName : "Websites",
                            pageDescription : "A website object represents a public web homepage.",
                            //displayName : "websites",
                            prefix : '<i class="material-icons text-primary">perm_identity</i>'
                        },
                        views: {
                            'content@': {
                                templateUrl: 'js/app/websites/websites.html',
                                controller: 'WebsitesController'
                            }
                        }
                    })
            }
        ])
    ;
}());
