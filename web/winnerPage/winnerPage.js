/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var GAME_URL = "http://localhost:8080/RummikubWebApp/";
var MAIN_SCREEN = "index.html";

$(function () {//onload function
    
    var winner ="The Winner is: "+ getParameterByName('gwinner');
    $("#winnerMsg").text(winner);
});


function onGoToGameRoom(){  
    redirect(GAME_URL + MAIN_SCREEN);
}