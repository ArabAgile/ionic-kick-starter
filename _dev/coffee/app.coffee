
angular.module 'ionicKickStarter', ['ionic', 'ionicKickStarter.controllers', 'ionicKickStarter.services', 'ngResource']

  .run ['$ionicPlatform', ($ionicPlatform) ->
    $ionicPlatform.ready = ->
      if window.cordova && window.cordova.plugins.Keyboard
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar true

      if window.StatusBar 
        StatusBar.styleDefault()
        return
  ]

  .config ['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) ->
    
    # Main 
    $stateProvider

    .state 'app', {
      url: "/app"
      abstract: true
      templateUrl: "templates/menu.html"
      controller: 'AppCtrl'
    }

    # Main
    .state 'app.main', {
      url: "/main"
      views: {
        'menuContent' : {
          templateUrl: "templates/main.html"
          controller: 'MainCtrl'
        }
      }

    }

    $urlRouterProvider.otherwise '/app/main'

    return
  ]

  .config ['$httpProvider', ($httpProvider) ->
    $httpProvider.defaults.useXDomain = true
    delete $httpProvider.defaults.headers.common['X-Requested-With']
    return
  ]
