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
    gameButtonsList = $(".GameButton");
    
    $("#addSerieArea").sortable({
        connectWith: 'ul',
        helper:"clone", 
        opacity:0.5,
        cursor:"pointer",
        receive: handleDropOnNewSerieEvent
    });
    
//    $("#addSerieArea").droppable({
//        accept: ".tile",
//        drop: handleDropOnNewSerieEvent
//    });

    //prevent IE from caching ajax calls
    $.ajaxSetup({cache: false});

    intervalTimer = setInterval(getEventsWs, refreshRate);
    triggerAjaxEventMonitoring();
});


function handleDropOnNewSerieEvent(event, ui) {
    //var droppedTile = $('#' + ui.draggable.prop('id'));
    var droppedTile = $('#' + ui.item.attr('id'));
    var droppedTileParentId = $(ui.sender).attr('id');

    if (droppedTileParentId === "handTileDiv") {
        var tiles = [];
        tiles.push(createTileObj(droppedTile));
        if (createSequenceWs(tiles)) {
            droppedTile.remove();
        }
    }
    else{
        //may be need to change to handle drop from board to new serie
        $(ui.sender).sortable('cancel');
    }
    //    var newSerieId = createNewSerieWithId(droppedTile);
    //$("#serie" + newSerieId).append(droppedTile);
}
function createNewSerieWithId() {
    var newSerieId = serieId;
    var serieArea = $("#seriesArea");

    var serieToAdd = document.createElement('ul');
    serieToAdd.type = 'ul';
    serieToAdd.className = "serie";
    serieToAdd.id = "serie" + serieId;
    serieArea.append(serieToAdd);
    serieId++;
    
    if (currPlayerName === myDetails.name) {
        $(".serie").sortable({
            connectWith: "ul",
            helper:"clone", 
            opacity:0.5,
            cursor:"pointer",
           start: function(event, ui) {ui.item.startPos = ui.item.index();},
            receive: handleDropOnSerieEvent 
            //cancel: null
        });
    }

    return newSerieId;
}

function handleDropOnSerieEvent(event, ui){
    //        if($(ui.sender).attr('id')==='sort1' 
    //       && $('#sort2').children('li').length>3){
    //      $(ui.sender).sortable('cancel');
     var droppedTile = $('#' + ui.item.attr('id'));
     var sourceID = $(ui.sender).attr('id');
     //var targetID = $(this).attr('id');
     var sequencePosition = droppedTile.index();
     var sequenceIndex = $(this).index();
     //var targetSize = $("#"+targetID+" li").length;
     //if(toIndex===0||targetSize-1===toIndex){
        if(sourceID === "handTileDiv"){
            var tile = createTileObj(droppedTile);
            var isTileAdded = addTileWs(tile, sequenceIndex, sequencePosition);

            if(isTileAdded) {
                $(ui.sender).sortable('cancel'); // we have to cancel the sortable action and the remove the tile
                droppedTile.remove();
            }
            else {
                $(ui.sender).sortable('cancel');
            }
        }else {  ///arrive from serie
            var sourceSequenceIndex = $('#' + sourceID).index();
            var sourceSequencePosition =  ui.item.startPos;//may be need to remove and find this tile in hand
            moveTileWs(sourceSequenceIndex, sourceSequencePosition, sequenceIndex, sequencePosition); 
            $(ui.sender).sortable('cancel');
        }
     //}else{  ///split  
     //}
//     var sourceSize = $("#"+sourceID+" li").length;
//    if(sourceSize===0&&sourceID!=="handTileDiv"){
//        //remove sender if have no tiles in it  
//        $("#"+sourceID).remove();
//    }

    
}

function createTileObj(tileView) {

    //var classes = (tileButton.attr("class")).split(" ");
    var color = (tileView.children().eq(0).attr("class"));
    //var color = classes[0];
    var value = tileView.children().eq(0).text();
    var tile = new Tile(color, value);
    return tile;
}

function Tile(color, value) {
    this.color = color;
    this.value = value;
}


function createViewTile(tileToCreate) {
    var tileValue = tileToCreate.value !== 0 ? tileToCreate.value : "J";
    var tile = document.createElement('li');
    tile.type = 'li';
    tile.className = "tile";
    tile.id = "tile" + tileId;
    tileId++;
    
    var tileValueLabel = document.createElement('span');
    tileValueLabel.className = tileToCreate.color;
    tileValueLabel.innerHTML = tileValue;
    tile.appendChild(tileValueLabel);

    return tile;
}

/////TEST VERSION - added: the hand is sortable only if it is my turn
function printTilesInParent(tiles, parent) {
    for (var tile in tiles) {
        var tileToAdd = createViewTile(tiles[tile]);
        parent.append(tileToAdd);
    }
}

function createPlayerHandWs(tiles) {
    var hand = $("#handTileDiv");
    hand.empty();
    printTilesInParent(tiles, hand);
    
    if (currPlayerName === myDetails.name) {
        hand.sortable({
            connectWith: 'ul',
            helper:"clone", 
            opacity:0.5,
            cursor:"pointer"
        });
    }
}
//END OF TEST


//function printTilesInParent(tiles, parent) {
//    for (var tile in tiles) {
//        var tileToAdd = createViewTile(tiles[tile]);
//        parent.append(tileToAdd);
//    }
//    
//    if (currPlayerName === myDetails.name) {
//
//    }
//}
//function createPlayerHandWs(tiles) {
//    var hand = $("#handTileDiv");
//    hand.empty();
//    printTilesInParent(tiles, hand);
//    hand.sortable({
//        connectWith: 'ul',
//        helper:"clone", 
//        opacity:0.5,
//        cursor:"pointer"
//    });
//}

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
//    $(".serie").sortable({
//        revert: true
//    });
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
    var tileToAdd = createViewTile(event.tiles[0]);
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
    if(serieSource.find("li").length < 1){
        serieSource.remove();
    }
}

function handleTileReturnedEvent(event) {

}

function setGameMessage(msg) {
    $("#gameMsg").html(msg).fadeIn(500).delay(3000).fadeOut(500);
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
    
//    for(var i=0; i < gameButtonsList.length ;i++ ) {
//        var currButton = gameButtonsList[i];
//        currButton.disabled = disableButtons;        
//    }

    for (var button in gameButtonsList) {
        var currButton = gameButtonsList[button];
        currButton.disabled = disableButtons;
    }
}

// <editor-fold defaultstate="collapsed" desc="function calling servlets">

function createSequenceWs(tiles) {
    var JSONStringifiedTiles = JSON.stringify(tiles);
    var retVal = true;
    $.ajax({
        url: GAME_URL + "CreateSequenceServlet",
        async: false,
        data: {"tiles": JSONStringifiedTiles},
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
    var JSONStringifiedTile = JSON.stringify(tile);
    var isTileAdded;
    $.ajax({
        url: GAME_URL + "AddTileServlet",
        async: false,
        data: {"tile": JSONStringifiedTile, "sequenceIndex": sequenceIndex, "sequencePosition": sequencePosition}, 
        timeout: 3000,
        dataType: 'json',
        success: function (data) {
            isTileAdded = !data.isException;
            
            if (data.isException) { 
                setGameMessage(data.voidAndStringResponse);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return isTileAdded;
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
            if (data.isException) { 
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
            if (data.isException) { 
                setGameMessage(data.voidAndStringResponse);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return false;
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

function onResign() {
    $.ajax({
        url: GAME_URL + "ResignServlet",
        async: false,
        data: {},
        timeout: 3000,
        dataType: 'json',
        success: function (data) {
            if (data.isException)
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
        async: true,  //IMPORTANT: async: true because gui is reponsive
        data: {},
        timeout: 3000,
        dataType: 'json',
        success: function (data) {
            if (data.isException)
            {
                setGameMessage(data.voidAndStringResponse);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return false;
}

function getLastEventID(eventList) {
    return (eventList[eventList.length - 1]).id;
}

// </editor-fold>