var GAME_START = "GAME_START";
var GAME_OVER = "GAME_OVER";
var GAME_WINNER = "GAME_WINNER";
var PLAYER_TURN = "PLAYER_TURN";
var PLAYER_FINISHED_TURN = "PLAYER_FINISHED_TURN";
var PLAYER_RESIGNED = "PLAYER_RESIGNED";
var SEQUENCE_CREATED = "SEQUENCE_CREATED";
var TILE_ADDED = "TILE_ADDED";
var TILE_RETURNED = "TILE_RETURNED";
var TILE_MOVED = "TILE_MOVED";
var REVERT = "REVERT";
var refreshRate = 1000; //miliseconds
var GAME_URL = "http://localhost:8080/RummikubWebApp/";
var MAIN_SCREEN = "index.html";
var WINNER_SCREEN = "WinnerScreen.html";
var EMPTY_STRING = "";
var GAME_OVER_MSG = "Game Is Over";
var PLAYER_DONE = " done his Turn";
var PLAYER_RESIGNED = " decided to quite";

var currPlayerName = "";
var eventID;
var gameName;
var gameButtonsList;
var myDetails;
var PLAY = " Play";
var WAIT = " Wait";
var playersDetailsList = "";
var intervalTimer;
var timeOutTimer;
var id=0;
//activate the timer calls after the page is loaded
$(function () {//onload function
    eventID = 0;
    tileId=0;
    
    gameButtonsList = $(".button");
    $("#serie").droppable({
        accept: ".tile",
        drop: handleDropOnNewSerieEvent
    });
    createPlayerHandWs();
    //prevent IE from caching ajax calls
   // $.ajaxSetup({cache: false});

    //intervalTimer = setInterval(getEventsWs, refreshRate);
    //triggerAjaxEventMonitoring();
});

function handleDropOnNewSerieEvent(event, ui) {

    var draggable = ui.draggable;
    //alert($(this).data('name'));
    var test=$('#'+ui.draggable.prop('id'));
    $('#testDiv').append(test);
}




function createPlayerHandWs() {
    var hand = $("#handTileDiv");
    hand.empty();
//    for(var tile in tiles){
//        var tileValue = tiles[tile].value !== 0 ? tiles[tile].value : "j";
    //hand.append('<button id="tile" onclick="onTileClick(this)" class="tile ' + tiles[tile].color +'">'+tileValue +'</button>');
//    }

    for (var i = 0; i < 13; i++) {
        //Create an input type dynamically.   
        var tileToAdd = document.createElement('input');
        tileToAdd.type = 'button';
        tileToAdd.value = i; // Really? You want the default value to be the type string?
        tileToAdd.className = "tile " + "BLUE";  // And the name too?
        tileToAdd.id="tile"+tileId;
        tileId++;

        hand.append(tileToAdd);
    }
    $(".tile").draggable({
        cancel: false,
        revert: 'invalid',
        iframeFix: true
    });
}
//$(".tile").draggable({});
//        $(".tile").onclick = function() { // Note this is a function
//            //alert("blabla");
//        };


//    if(currPlayerName === myDetails.name){
//        var test = $(".tile");
//        $("#tile").draggable({addClasses: false});
//    } 

//    var buttonsList = hand.children();
//    
//    for (var button in buttonsList) {
//        var t = buttonsList[button];
//        t.draggable();
//    }




function setGameMessage(msg) {
    $("#gameMsg").html(msg).fadeIn(500).delay(2000).fadeOut(500);
}


function onTileClick(clickedElement) {
    //not sure about it
    // make tiles active only in my turn
//    if(currPlayerName === myDetails.name){
//    } 
}


