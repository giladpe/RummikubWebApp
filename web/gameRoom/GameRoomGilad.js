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
var tileId = 0;
var serieId = 0;
//activate the timer calls after the page is loaded
$(function () {//onload function
    serieId = 0;
    eventID = 0;
    tileId = 0;
    gameName = getParameterByName('gid');
    gameButtonsList = $(".button");
    $("#addSerieArea").droppable({
        accept: ".tile",
        drop: handleDropOnNewSerieEvent
    });

    //prevent IE from caching ajax calls
    $.ajaxSetup({cache: false});

    intervalTimer = setInterval(getEventsWs, refreshRate);
    triggerAjaxEventMonitoring();
});


function handleDropOnNewSerieEvent(event, ui) {

    var newSerieId = createNewSerieWithId(droppedTile);
    var droppedTile = $('#' + ui.draggable.prop('id'));
    var droppedTileParentId = $(droppedTile).closest("div").attr("id");
    
    //need to remove the parent if its an empty serie 


    $("#serie" + newSerieId).append(droppedTile);

}
function createNewSerieServlet() {
    //toDO

}

function triggerAjaxEventMonitoring() {
    timeOutTimer = setTimeout(getEventsWs, refreshRate);
}

function getEventsWs() {
    $.ajax({
        url: GAME_URL + "GetEventsServlet",
        data: {"eventID": eventID},
        timeout: 1000,
        dataType: 'json',
        success: function (data) {
            if (!data.isException) //success 
            {
                var eventList = data.eventListResposne;

                if (eventList.length !== 0) {
                    for (var i = 0; i < eventList.length; i++) {
                        handleRummikubWsEvent(eventList[i]);
                    }
                    eventID = getLastEventID(eventList);
                }
            } else {
                setGameMessage(data.voidAndStringResponse);
            }

            triggerAjaxEventMonitoring();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            triggerAjaxEventMonitoring();
        }
    });
}

function createNewSerieWithId() {
    var newSerieId = serieId;
    var serieArea = $("#seriesArea");

    var serieToAdd = document.createElement('span');
    serieToAdd.type = 'span';
    serieToAdd.className = "serie";
    serieToAdd.id = "serie" + serieId;
    serieArea.append(serieToAdd);
    serieId++;
    
    return newSerieId;

}



function getLastEventID(eventList) {
    return (eventList[eventList.length - 1]).id;
}

function handleRummikubWsEvent(event) {
    switch (event.type) {
        case GAME_OVER:
        {
            handleGameOverEvent(event);
            break;
        }
        case GAME_START:
        {
            handleGameStartEvent(event);
            break;
        }
        case GAME_WINNER:
        {
            handleGameWinnerEvent(event);
            break;
        }
        case PLAYER_FINISHED_TURN:
        {
            handlePlayerFinishedTurnEvent(event);
            break;
        }
        case PLAYER_RESIGNED:
        {
            handlePlayerResignedEvent(event);
            break;
        }
        case PLAYER_TURN:
        {
            handlePlayerTurnEvent(event);
            break;
        }
        case REVERT:
        {
            handleRevertEvent(event);
            break;
        }
        case SEQUENCE_CREATED:
        {
            handleSequenceCreatedEvent(event);
            break;
        }
        case TILE_ADDED:
        {
            handleTileAddedEvent(event);
            break;
        }
        case TILE_MOVED:
        {
            handleTileMovedEvent(event);
            break;
        }
        case TILE_RETURNED:
        {
            handleTileReturnedEvent(event);
            break;
        }
        default:
        {
            break;
        }
    }
}


function onResign() {
    $.ajax({
        url: GAME_URL + "ResignServlet",
        async: false,
        data: {},
        timeout: 3000,
        dataType: 'json',
        success: function (data) {
            if (data.isException) //success 
            {
                setGameMessage(data.voidAndStringResponse);
            } else {
                redirect(GAME_URL + MAIN_SCREEN);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return false;
}

function onFinishTurn() {
    $.ajax({
        url: GAME_URL + "FinishTurnServlet",
        async: false,
        data: {},
        timeout: 3000,
        dataType: 'json',
        success: function (data) {
            if (data.isException) //success 
            {
                setGameMessage(data.voidAndStringResponse);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return false;
}

function onAddSerie() {
    setCurrPlayerClass();
}

function handleGameOverEvent(event) {

    disableButtons();
//            resetPlayersBar(); // in javafx it does nothing
    setGameMessage(GAME_OVER_MSG);
}

function handleGameStartEvent(event) {
    myDetails = getMyDetailsWs();
    playersDetailsList = getPlayersDetailsList(gameName);
    //$(".gameBoard").empty().append('<div class = "serie" id = serie><div>new Series</div></div>');
    //$("#serie").droppable({
//       accept: ".tile",
//        drop: handleDropOnNewSerieEvent
//        
//    });

    //not sure about the next lines prefer u gilad to check it
    //logicBoard = new Board();
    //setPlayersBarWs();
    //initPlayerLabelWs();
    initAllComponent();
}

function handleGameWinnerEvent(event) {
    redirect(GAME_URL + WINNER_SCREEN);
    //game event screen need to get the result from event.playerName
}

function handlePlayerFinishedTurnEvent(event) {
    setGameMessage(event.getPlayerName + PLAYER_DONE);
    showPlayerHandWs();
}

function showPlayerHandWs() {
    myDetails = getMyDetailsWs();
    createPlayerHandWs(myDetails.tiles);
}

function createPlayerHandWs(tiles) {
    var hand = $("#handTileDiv");
    hand.empty();

//    for(var tile in tiles){
//        var tileValue = tiles[tile].value !== 0 ? tiles[tile].value : "j";
    //hand.append('<button id="tile" onclick="onTileClick(this)" class="tile ' + tiles[tile].color +'">'+tileValue +'</button>');
//    }

    for (var tile in tiles) {
        var tileValue = tiles[tile].value !== 0 ? tiles[tile].value : "J";
        //Create an input type dynamically.   
        var tileToAdd = document.createElement('input');
        tileToAdd.type = 'button';
        tileToAdd.value = tileValue; // Really? You want the default value to be the type string?
        tileToAdd.className = "tile " + tiles[tile].color;  // And the name too?
        tileToAdd.id = "tile" + tileId;
        tileId++;
        hand.append(tileToAdd);
        //tileToAdd.data('color', tiles[tile].color);
    }

    if (currPlayerName === myDetails.name) {

        $(".tile").draggable({
            cancel: false,
            revert: 'invalid',
            helper: 'clone'

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

}

function handlePlayerResignedEvent(event) {
    var playerResignedName = event.playerName;
    setGameMessage(playerResignedName + PLAYER_RESIGNED);

    if (myDetails.name === playerResignedName) {
        clearTimeout(intervalTimer);
        clearTimeout(timeOutTimer);
        redirect(GAME_URL + MAIN_SCREEN);
    }
}

function handlePlayerTurnEvent(event) {

    setFirstSequenceTurnMsg();
    setCurrPlayerClass(event.playerName);
    setGameMessage(getTurnMsg());
    showPlayerHandWs();
    if (myDetails.name === currPlayerName) {
        enableButtons();
    } else {
        disableButtons();
    }
}

function setFirstSequenceTurnMsg() {

    if (myDetails.playedFirstSequence) {
        $('#turnMsg').html("Played Sequence");
    } else {
        $('#turnMsg').html("Didn't Played Sequence");
    }
}

function getTurnMsg() {
    var myName = myDetails.name;
    if (myName === currPlayerName) {
        myName += PLAY;
    } else {
        myName += WAIT;
    }
    return myName;
}


function handleRevertEvent(event) {

}

function handleSequenceCreatedEvent(event) {

}

function handleTileAddedEvent(event) {

}

function handleTileMovedEvent(event) {

}

function handleTileReturnedEvent(event) {

}

function setGameMessage(msg) {
    $("#gameMsg").html(msg).fadeIn(500).delay(2000).fadeOut(500);
}

function initAllComponent() {
    initPlayersBar();
    initBoard();
}

function initPlayersBar() {
    var playersDetailsList = getPlayersDetailsList(gameName);
    var playerBar = $(".nameF");
    var j = 0;

    for (var i = 0; i < playersDetailsList.length; i++) {
        playerBar[j].innerHTML = (playersDetailsList[i]).name;
        playerBar[j + 1].innerHTML = (playersDetailsList[i]).numberOfTiles;
        j += 2;
    }
}

function setCurrPlayerClass(currPlayer) {
    if (currPlayerName !== undefined && currPlayerName !== EMPTY_STRING) {
        $('.nameFcurrPlayer').removeClass('nameFcurrPlayer');
    }
    currPlayerName = currPlayer;

    $(getPlayerNameFiled(currPlayer)).addClass('nameFcurrPlayer');
    $(getPlayerTileFiled(currPlayer)).addClass('nameFcurrPlayer');
}

function getPlayerNameFiled(name) {
    return  "#PlayerF" + getPlayerIndexByName(name);
}
function getPlayerTileFiled(name) {
    return  "#TileF" + getPlayerIndexByName(name);
}

function getPlayerIndexByName(playerName) {
    var retVal = -1;
    for (var player in playersDetailsList) {
        if (playerName === playersDetailsList[player].name) {
            retVal = player;
        }

    }
    return retVal;
}

function initBoard() {

}

function onTileClick(clickedElement) {
    //not sure about it
    // make tiles active only in my turn
//    if(currPlayerName === myDetails.name){
//    } 
}



function getMyDetailsWs() {
    var myDetails = EMPTY_STRING;

    $.ajax({
        url: GAME_URL + "GetPlayerDetailsServlet",
        async: false,
        data: {},
        timeout: 3000,
        dataType: 'json',
        success: function (data) {
            if (!data.isException) { //success 
                myDetails = data.playerDetailsResposne;
            } else {
                setGameMessage(data.voidAndStringResponse);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });

    return myDetails;
}

function disableButtons() {
    initButtons(true);
}

function enableButtons() {
    initButtons(false);
}

function initButtons(disableButtons) {
    for (var button in gameButtonsList) {
        var currButton = gameButtonsList[button];
        currButton.disable = disableButtons;
    }
}


function createSequenceWs(tiles) {
    $.ajax({
        url: GAME_URL + "CreateSequenceServlet",
        async: false,
        data: {"tiles": tiles},
        timeout: 3000,
        dataType: 'json',
        success: function (data) {
            if (data.isException) { //success 
                setGameMessage(data.voidAndStringResponse);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return false;
}

function addTileWs(tile, sequenceIndex, sequencePosition) {
    $.ajax({
        url: GAME_URL + "AddTileServlet",
        async: false,
        data: {"tile": tile, "sequenceIndex": sequenceIndex, "sequencePosition": sequencePosition},
        timeout: 3000,
        dataType: 'json',
        success: function (data) {
            if (data.isException) { //success 
                setGameMessage(data.voidAndStringResponse);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return false;
}

function moveTileWs(sourceSequenceIndex, sourceSequencePosition, targetSequenceIndex, targetSequencePosition) {
    $.ajax({
        url: GAME_URL + "MoveTileServlet",
        async: false,
        data: {"sourceSequenceIndex": sourceSequenceIndex, "sourceSequencePosition": sourceSequencePosition,
            "targetSequenceIndex": targetSequenceIndex, "targetSequencePosition": targetSequencePosition},
        timeout: 3000,
        dataType: 'json',
        success: function (data) {
            if (data.isException) { //success 
                setGameMessage(data.voidAndStringResponse);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return false;
}

function takeBackTileToHandWs(sequenceIndex, sequencePosition) {
    $.ajax({
        url: GAME_URL + "TakeBackTileServlet",
        async: false,
        data: {"sequenceIndex": sequenceIndex, "sequencePosition": sequencePosition},
        timeout: 3000,
        dataType: 'json',
        success: function (data) {
            if (data.isException) { //success 
                setGameMessage(data.voidAndStringResponse);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return false;
}