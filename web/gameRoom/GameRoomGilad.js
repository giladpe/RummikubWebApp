var GAME_START = "GameStart";
var GAME_OVER = "GameOver";
var GAME_WINNER = "GameWinner";
var PLAYER_TURN = "PlayerTurn";
var PLAYER_FINISHED_TURN = "PlayerFinishedTurn";
var PLAYER_RESIGNED = "PlayerResigned";
var SEQUENCE_CREATED = "SequenceCreated";
var TILE_ADDED = "TileAdded";
var TILE_RETURNED = "TileReturned";
var TILE_MOVED = "TileMoved";
var REVERT = "Revert";
var refreshRate = 1000; //miliseconds
var eventID;
var currPlayer = "";
//activate the timer calls after the page is loaded
$(function () {//onload function
    eventID = 0;

    //prevent IE from caching ajax calls
    $.ajaxSetup({cache: false});

    //The users list is refreshed automatically every second
    setInterval(getEvents, refreshRate);
    //The chat content is refreshed only once (using a timeout) but
    //on each call it triggers another execution of itself later (1 second later)
    triggerAjaxEventMonitoring();
});

function triggerAjaxEventMonitoring() {
    setTimeout(getEvents, refreshRate);
}

function getEvents() {
    $.ajax({
        url: "GetEventsServlet",
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
        error: function (error) {
            triggerAjaxEventMonitoring();
        }
    });
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

}

function onFinishTurn() {
 $.ajax({
        url: "FinishTurnServlet",
        async: false,
        data: {},
        timeout: 3000,
        dataType: 'json',
        success: function (data) {
            if (!data.isException) //success 
            {

            } else {
                setGameMessage(data.voidAndStringResponse);
            }

            triggerAjaxEventMonitoring();
        },
        error: function (error) {
            triggerAjaxEventMonitoring();
        }
    });

    
}

function onAddSerie() {
    initPlayersBar();
}

function handleGameOverEvent(event) {

}

function handleGameStartEvent(event) {
    initAllComponent();
}

function handleGameWinnerEvent(event) {

}

function handlePlayerFinishedTurnEvent(event) {
    
    
}

function handlePlayerResignedEvent(event) {

}

function handlePlayerTurnEvent(event) {

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
    var playersDetailsList = getPlayersDetailsList();
    var playerBar = $("#playerBar");

    for (var i = 0; i < playersDetailsList.length; i++) {
        playerBar[i * 2] = (playersDetailsList[i]).name;
        playerBar[i * 2 + 1] = (playersDetailsList[i]).numberOfTiles;
    }
}

function setCurrPlayerClass(newCurrPlayer)
{

    if (currPlayer !== "") {
        $(currPlayer, "#playerBar").currPlayer.removeClass('nameFcurrPlayer').addClass('nameF');
    }
    $(newCurrPlayer, "#playerBar").removeClass('nameF').addClass('nameFcurrPlayer');
    
}


function initBoard() {

}

