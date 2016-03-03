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
var WINNER_SCREEN = "winnerPage/winnerPage.html";
var EMPTY_STRING = "";
var GAME_OVER_MSG = "Game Is Over";
var PLAYER_DONE = " done his Turn";
var PLAYER_RESIGNED = " decided to quite";
var PLAY = " Play";
var WAIT = " Wait";

var currPlayerName;
var eventID = 0;
var gameName;
var gameButtonsList;
var myDetails;
var playersDetailsList;
var intervalTimer;
var timeOutTimer;
var tileId;
var serieId;
var isTileMoveFromHandOrOtherSerie = false;
//var tileMovedFromSerieToSerie;
//var movedTileFromSerieToSerie;


//activate the timer calls after the page is loaded
$(function () {//onload function
    currPlayerName = "";
    eventID = 0;
    gameName = getParameterByName('gid');
    gameButtonsList = $(".GameButton");
    serieId = 0;
    tileId = 0;

    $("#addSerieArea").sortable({
        connectWith: 'ul',
        helper: "clone",
        opacity: 0.5,
        cursor: "pointer",
        receive: handleDropOnNewSerieEvent
    });


    //prevent IE from caching ajax calls
    $.ajaxSetup({cache: false});
    getEventsWs();
});

function handleDropOnNewSerieEvent(event, ui) {

    var droppedTile = $('#' + ui.item.attr('id'));
    var sender = $(ui.sender);
    var droppedTileParentId = sender.attr('id');

    if (droppedTileParentId === "handTileDiv") {
        var tiles = [];
        tiles.push(createTileObj(droppedTile));
        createSequenceWs(tiles, droppedTile, sender);

    } else {
        sender.sortable('cancel');
    }
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
        setSeriesSortable();
        }

    return newSerieId;
}

function setSeriesSortable() {
    $(".serie").sortable({
        connectWith: "ul",
        helper: "clone",
        opacity: 0.5,
        cursor: "pointer",
        start: function (event, ui) {
            ui.item.startPos = ui.item.index();
            $(this).attr('data-prevPositionIndex', ui.item.index());
            $(this).attr('data-prevSerieIndex', (ui.item.closest("ul")).index());
            $(this).attr('data-senderID', (ui.item.closest("ul")).attr('id'));
        },
        receive: handleDropOnSerieEvent,
        stop: handleTileMoveInSerie
                //update:handleDropOnSerieEvent
    });
}

function handleTileMoveInSerie(event, ui) {
    var sourceSerieIndex = $(this).index(); //$(this).attr('data-senderID');
    var NOT_FOUND = -1;
    
    if (!isTileMoveFromHandOrOtherSerie && sourceSerieIndex !== NOT_FOUND) {
        var prevTilePositionIndex = $(this).attr('data-prevPositionIndex');
        var newTilePositionIndex = ui.item.index();
        //$(this).sortable('cancel');
        moveTileWs(sourceSerieIndex, prevTilePositionIndex, sourceSerieIndex, newTilePositionIndex, $(this));
    }
    
    isTileMoveFromHandOrOtherSerie = false;
}


function handleDropOnSerieEvent(event, ui) {
    isTileMoveFromHandOrOtherSerie = true;
    var droppedTile = $('#' + ui.item.attr('id'));
    var sender = $(ui.sender);
    var sourceID = sender.attr('id');
    var targetSequencePosition = droppedTile.index();
    var targetSequenceIndex = $(this).index();

    if (sourceID === "handTileDiv") {
    
        addTileWs(droppedTile, targetSequenceIndex, targetSequencePosition, sender);
    } else {  ///arrive from serie
        var sourceSequenceIndex = $('#' + sourceID).index();
        var sourceSequencePosition = ui.item.startPos;      //may be need to remove and find this tile in hand
        moveTileWs(sourceSequenceIndex, sourceSequencePosition, targetSequenceIndex, targetSequencePosition, sender);
    }

}

function createTileObj(tileView) {

    var color = (tileView.children().eq(0).attr("class"));
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
            helper: "clone",
            opacity: 0.5,
            cursor: "pointer",
            start: function (event, ui) {
                $(this).attr('data-prevPositionIndex', ui.item.index());
                $(this).attr('data-prevSerieIndex', (ui.item.closest("ul")).index());
                $(this).attr('data-senderID', (ui.item.closest("ul")).attr('id'));
            },
            receive: handleDropOnHand,
        });
    }
}

function handleDropOnHand(event, ui) {
    var sequencePosition = ui.item.startPos;
    var sender = $(ui.sender);
    var sequenceIndex = $('#' + sender.attr('id')).index();
    var droppedTile = $('#' + ui.item.attr('id'));
    takeBackTileToHandWs(sequenceIndex, sequencePosition, droppedTile, sender);
}

function handleRummikubWsEvent(event) {
    switch (event.type) {

        case GAME_OVER:
            handleGameOverEvent(event);
            break;

        case GAME_START:
            handleGameStartEvent(event);
            break;

        case GAME_WINNER:
            handleGameWinnerEvent(event);
            break;

        case PLAYER_FINISHED_TURN:
            handlePlayerFinishedTurnEvent(event);
            break;

        case PLAYER_RESIGNED:
            handlePlayerResignedEvent(event);
            break;

        case PLAYER_TURN:
            handlePlayerTurnEvent(event);
            break;

        case REVERT:
            handleRevertEvent(event);
            break;

        case SEQUENCE_CREATED:
            handleSequenceCreatedEvent(event);
            break;

        case TILE_ADDED:
            handleTileAddedEvent(event);
            break;

        case TILE_MOVED:
            handleTileMovedEvent(event);
            break;

        case TILE_RETURNED:
        default:
            handleTileReturnedEvent(event);
            break;
    }
    //removeEmptySeries();
}

function handleGameOverEvent(event) {

    disableButtons();
//            resetPlayersBar(); // in javafx it does nothing
    setGameMessage(GAME_OVER_MSG);
}

function handleGameStartEvent(event) {
    myDetails = getMyDetailsWs();
    playersDetailsList = getPlayersDetailsList(gameName);
    initAllComponent();
}

function handleGameWinnerEvent(event) {
    var winner = event.playerName;
    redirect(GAME_URL + WINNER_SCREEN + "?gwinner=" + winner);

    //game event screen need to get the result from event.playerName
}

function handlePlayerFinishedTurnEvent(event) {
    setGameMessage(event.playerName + PLAYER_DONE);
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
    showPlayerHandWs();
    initPlayersBar();
}

function handleSequenceCreatedEvent(event) {
    var newSerieId = createNewSerieWithId();
    var serie = $("#serie" + newSerieId);

//    if (tileMovedFromSerieToSerie) {
//        movedTileFromSerieToSerie.remove();
//        tileMovedFromSerieToSerie = false;
//    }
    printTilesInParent(event.tiles, serie);
    initPlayersBar();

}

function insertTileAtIndex(serie, tile, index) {
    var tileBefor = serie.children().eq(index - 1);

    index === 0 ? serie.prepend(tile) : tileBefor.after(tile);

//    if (index === 0) {
//        serie.prepend(tile);
//    }
//    else {
//        var tileBefor = serie.children().eq(index - 1);
//        tileBefor.after(tile);
//    }
}

function handleTileAddedEvent(event) {
    var serie = $('#seriesArea').children().eq(event.targetSequenceIndex);
    var tileToAdd = createViewTile(event.tiles[0]);
    insertTileAtIndex(serie, tileToAdd, event.targetSequencePosition);
    initPlayersBar();

}

function handleTileMovedEvent(event) {
    var serieSource = $('#seriesArea').children().eq(event.sourceSequenceIndex);
    var tileToMove = serieSource.children().eq(event.sourceSequencePosition);
    var serieTarget = $('#seriesArea').children().eq(event.targetSequenceIndex);

    insertTileAtIndex(serieTarget, tileToMove, event.targetSequencePosition);

    if (serieSource.find("li").length < 1) {
        serieSource.remove();
    }
}

function removeEmptySeries() {
    $("#seriesArea").each(
            function () {
                var elem = $(this);
                if (elem.children().length === 0) {
                    elem.remove();
                }
            }
    );
}

function handleTileReturnedEvent(event) {
    showPlayerHandWs();
    initPlayersBar();
}

//function handleTileReturnedEvent(event) {
//    showPlayerHandWs();
//}



function setGameMessage(msg) {
    $("#gameMsg").html(msg).fadeIn(500).delay(3000).fadeOut(500);
}
function initAllComponent() {
    initPlayersBar();
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
        timeout: 1500,
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
    setSeriesSortable();
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

function createSequenceWs(tiles, droppedTile, sender) {
    var JSONStringifiedTiles = JSON.stringify(tiles);

    $.ajax({
        url: GAME_URL + "CreateSequenceServlet",
        data: {"tiles": JSONStringifiedTiles},
        timeout: 1000,
        dataType: 'json',
        success: function (data) {
            sender.sortable('cancel');

            if (data.isException) { //success 
                setGameMessage(data.voidAndStringResponse);
            } else {
                droppedTile.remove();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            sender.sortable('cancel');
        }
    });
}

function addTileWs(droppedTile, sequenceIndex, sequencePosition, sender) {
    var tile = createTileObj(droppedTile);
    var JSONStringifiedTile = JSON.stringify(tile);

    $.ajax({
        url: GAME_URL + "AddTileServlet",
        async: false,
        data: {"tile": JSONStringifiedTile, "sequenceIndex": sequenceIndex, "sequencePosition": sequencePosition},
        timeout: 1000,
        dataType: 'json',
        success: function (data) {
            sender.sortable('cancel');

            if (data.isException) {
                setGameMessage(data.voidAndStringResponse);
            } else {
                droppedTile.remove();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            sender.sortable('cancel');
        }
    });
}

function moveTileWs(sourceSequenceIndex, sourceSequencePosition, targetSequenceIndex, targetSequencePosition, sender) {

    $.ajax({
        url: GAME_URL + "MoveTileServlet",
        async: false,
        data: {"sourceSequenceIndex": sourceSequenceIndex, "sourceSequencePosition": sourceSequencePosition,
            "targetSequenceIndex": targetSequenceIndex, "targetSequencePosition": targetSequencePosition},
        timeout: 1000,
        dataType: 'json',
        success: function (data) {
            sender.sortable('cancel');
            //$( this ).sortable( "cancel" );

            if (data.isException) {
                setGameMessage(data.voidAndStringResponse);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            sender.sortable('cancel');
            // $( this ).sortable( "cancel" );
        }
    });
}

function takeBackTileToHandWs(sequenceIndex, sequencePosition, droppedTile, sender) {
    $.ajax({
        url: GAME_URL + "TakeBackTileServlet",
        async: false,
        data: {"sequenceIndex": sequenceIndex, "sequencePosition": sequencePosition},
        timeout: 1000,
        dataType: 'json',
        success: function (data) {
            sender.sortable('cancel');

            if (data.isException) { //success 
                setGameMessage(data.voidAndStringResponse);

            } else {
                droppedTile.remove();

                if (sender.find("li").length < 1) {
                    sender.remove();
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            sender.sortable('cancel');
        }
    });
    return false;
}

function triggerAjaxEventMonitoring() {
    timeOutTimer = setTimeout(getEventsWs, refreshRate);
}

function getEventsWs() {
    
    if (eventID !== undefined) {
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
    return false;
}

function onResign() {
    $.ajax({
        url: GAME_URL + "ResignServlet",
        data: {},
        timeout: 1000,
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

function onFinishTurn() {
    $.ajax({
        url: GAME_URL + "FinishTurnServlet",
        async: true, //IMPORTANT: async: true because gui is reponsive
        data: {},
        timeout: 1000,
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
