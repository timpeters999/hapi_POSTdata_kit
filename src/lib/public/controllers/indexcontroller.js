//this will add IndexController to the ThisApp angular app.
(function () {
    'use strict';
    
    var app= angular.module('ThisApp');
    app.controller('IndexController', function ($http) {
        
        this.authenticate = function() {
            
            $http({
                url: '/postto',
                method: "POST",
                data: { 'username' : this.username, 'password': this.password }})
            .then(function(response) {
                    //do something with your response
            });   
        };
    });
}());