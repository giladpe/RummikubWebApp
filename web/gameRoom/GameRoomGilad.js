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

    var droppedTile = $('#' + ui.draggable.prop('id'));
    var droppedTileParentId = $(droppedTile).closest("div").attr("id");

    if (droppedTileParentId === "handTileDiv") {
        var tiles = [];
        tiles.push(createTileObj(droppedTile));
        if (createSequenceWs(tiles)) {
            droppedTile.remove();
        }
    }
    //    var newSerieId = createNewSerieWithId(droppedTile);
    //$("#serie" + newSerieId).append(droppedTile);
}



function createTileObj(tileButton) {

    var classes = (tileButton.attr("class")).split(" ");
    var color = classes[1];
    var value = tileButton.attr("value");
    var tile = new Tile(color, value);
    return tile;
}

function Tile(color, value) {

    // Add object properties like this
    this.color = color;
    this.value = value;
}


function triggerAjaxEventMonitoring() {
    timeOutTimer = setTimeout(getEventsWs, refreshRate);
}

function getEventsWs() {
    $.ajax({
        url: GAME_URL + "GetEventsServlet",
        data: {"eventID": eventID},
        async: false,
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
    //$( ".serie" ).sortable({
//    serieToAdd.sortable({
//      connectWith: ".tile"
//    }).disableSelection();

    return newSerieId;

}

//$(function() {
//    $( "#sortable1, #sortable2" ).sortable({
//      connectWith: ".connectedSortable"
//    }).disableSelection();
//  });

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

function createTileButton(tileToCreate) {
    var tileValue = tileToCreate.value !== 0 ? tileToCreate.value : "J";
    var tileButton = document.createElement('input');
    tileButton.type = 'button';
    tileButton.value = tileValue;
    tileButton.className = "tile " + tileToCreate.color;
    tileButton.id = "tile" + tileId;
    tileId++;
    return tileButton;
}

function printTilesInParent(tiles, parent) {
    for (var tile in tiles) {
        var tileToAdd = createTileButton(tiles[tile]);
//        var tileValue = tiles[tile].value !== 0 ? tiles[tile].value : "J";
//        var tileToAdd = document.createElement('input');
//        tileToAdd.type = 'button';
//        tileToAdd.value = tileValue; 
//        tileToAdd.className = "tile " + tiles[tile].color;
//        tileToAdd.id = "tile" + tileId;
//        tileId++;
        parent.append(tileToAdd);
    }
    if (currPlayerName === myDetails.name) {

        $(".tile").draggable({
            cancel: false,
            revert: 'invalid',
            helper: 'clone'

        });
    }
}
function createPlayerHandWs(tiles) {
    var hand = $("#handTileDiv");
    hand.empty();
    printTilesInParent(tiles, hand);
}
//function createPlayerHandWs(tiles) {
//    var hand = $("#handTileDiv");
//    hand.empty();
//
//    for (var tile in tiles) {
//        var tileValue = tiles[tile].value !== 0 ? tiles[tile].value : "J";
//        //Create an input type dynamically.   
//        var tileToAdd = document.createElement('input');
//        tileToAdd.type = 'button';
//        tileToAdd.value = tileValue; // Really? You want the default value to be the type string?
//        tileToAdd.className = "tile " + tiles[tile].color;  // And the name too?
//        tileToAdd.id = "tile" + tileId;
//        tileId++;
//        hand.append(tileToAdd);
//        //tileToAdd.data('color', tiles[tile].color);
//    }
//
//    if (currPlayerName === myDetails.name) {
//
//        $(".tile").draggable({
//            cancel: false,
//            revert: 'invalid',
//            helper: 'clone'
//
//        });
//    }
//    //$(".tile").draggable({});
////        $(".tile").onclick = function() { // Note this is a function
////            //alert("blabla");
////        };
//
//
////    if(currPlayerName === myDetails.name){
////        var test = $(".tile");
////        $("#tile").draggable({addClasses: false});
////    } 
//
////    var buttonsList = hand.children();
////    
////    for (var button in buttonsList) {
////        var t = buttonsList[button];
////        t.draggable();
////    }
//
//}

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
    $("#seriesArea").empty();
}

function handleSequenceCreatedEvent(event) {
    var newSerieId = createNewSerieWithId();
    var serie = $("#serie" + newSerieId);
    printTilesInParent(event.tiles, serie);
    $(".serie").sortable({
            revert: true
    });
    //$("#serie" + newSerieId).append(droppedTile);
}
function insertTileAtIndex(serie, tile, index) {
    if (index === 0) {
        serie.prepend(tile);
    } else {
        var tileBefor = serie.children().eq(index - 1);
        tileBefor.after(tile);
    }
}
function handleTileAddedEvent(event) {
    //var seriesList=$('#seriesArea');
    var serie = $('#seriesArea').children().eq(event.targetSequenceIndex);
    var tileToAdd = createTileButton(event.tiles[0]);
    insertTileAtIndex(serie, tileToAdd, event.targetSequencePosition);


    //protected int targetSequenceIndex;
    //protected int targetSequencePosition;
    // printTilesInParent(,)

}
//    private void handleTileAddedEvent(Event event) {
//
//        rummikub.client.ws.Tile tileToAdd = event.getTiles().get(0);
//        int targetSerie = event.getTargetSequenceIndex();
//        int targetPosition = event.getTargetSequencePosition();
//        Serie toSerie = this.logicBoard.getSeries(targetSerie);
//
//        if (toSerie.getSizeOfSerie() == targetPosition) {
//            toSerie.addSpecificTileToSerie(convertWsTileToLogicTile(tileToAdd));
//        } else {
//            toSerie.addSpecificTileToSerie(convertWsTileToLogicTile(tileToAdd), targetPosition); //maybe need to check if to add to end 
//        }
//        Platform.runLater(() -> {
//            showGameBoard();
//            showPlayerHandWs();
//        });


function handleTileMovedEvent(event) {
    var serieSource = $('#seriesArea').children().eq(event.sourceSequenceIndex);
    var tileToMove = serieSource.children().eq(event.sourceSequencePosition);
    var serieTarget = $('#seriesArea').children().eq(event.targetSequenceIndex);
    insertTileAtIndex(serieTarget, tileToMove, event.targetSequencePosition);
}

//private void handleTileMovedEvent(Event event) {
//        int sourcePosition = event.getSourceSequencePosition();
//        int sourceSerie = event.getSourceSequenceIndex();
//        int targetSerie = event.getTargetSequenceIndex();
//        int targetPosition = event.getTargetSequencePosition();
//        Point target = new Point(targetSerie, targetPosition);
//        Point source = new Point(sourceSerie, sourcePosition);
//        SingleMove singleMove = new SingleMove(target, source, SingleMove.MoveType.BOARD_TO_BOARD);
//        checkIfToAddNewSeriesToBoard(singleMove);
//        setTilesAfterChange(singleMove);
//        Platform.runLater(() -> (showGameBoard()));
//    }



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
    playersDetailsList = getPlayersDetailsList(gameName);
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
    var test = JSON.stringify(tiles);
    var retVal = true;
    $.ajax({
        url: GAME_URL + "CreateSequenceServlet",
        async: false,
        data: {"tiles": test},
        timeout: 3000,
        dataType: 'json',
        success: function (data) {
            if (data.isException) { //success 
                setGameMessage(data.voidAndStringResponse);
                retVal = !retVal;
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return retVal;
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