angular.module('githubscout', [
  'githubscout.user',
  'githubscout.language',
  'githubscout.search',
  'githubscout.home',
  'githubscout.services',
  'ui.router',
  'ngFx'
])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home/home.html',
      controller: 'HomeController'
    })
    .state('user', {
      url: '/user/:username',
      templateUrl: 'user/user.html',
      controller: 'UserController'
    })
    .state('languageIndex', {
      url: '/language/',
      templateUrl: 'language/index.html',
      controller: 'LanguageIndexController'
    })
    .state('language', {
      url: '/language/:language',
      templateUrl: 'language/language.html',
      controller: 'LanguageController'
    });

  $urlRouterProvider.otherwise('/');
});
