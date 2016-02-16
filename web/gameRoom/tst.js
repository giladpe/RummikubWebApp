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
var WINNER_SCREEN = "WinnderScreen.html";
var EMPTY_STRING = "";
var GAME_OVER_MSG = "Game Is Over";
var PLAYER_DONE = " done his Turn";
var currPlayerName="";
var eventID;
var gameName;
var gameButtonsList;
var myDetails;
var PLAY = " Play";
var WAIT = " Wait";

//activate the timer calls after the page is loaded
$(function () {//onload function
    eventID = 0;
    gameName = getParameterByName('gid');
    gameButtonsList = $(".button");
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
        url:  GAME_URL + "GetEventsServlet",
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
   redirect(GAME_URL + MAIN_SCREEN);
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

            triggerAjaxEventMonitoring();
        },
        error: function (error) {
            triggerAjaxEventMonitoring();
        }
    });
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
    myDetails = getMyDetails();
            //not sure about the next lines prefer u gilad to check it
            //logicBoard = new Board();
           //setPlayersBarWs();
            //initPlayerLabelWs();
    initAllComponent();
}

function handleGameWinnerEvent(event) {
    redirect(GAME_URL + WINNER_SCREEN);
    //game event screen need to get the result from event,playerName
}

function handlePlayerFinishedTurnEvent(event) {
    showPlayerHandWs();
    setGameMessage(event.getPlayerName + PLAYER_DONE);
}

function showPlayerHandWs() {
    myDetails = getMyDetails();
    createPlayerHandWs(myDetails.tiles);
}

function createPlayerHandWs(tiles) {
    var hand = $("#handTileDiv");
    var newButton, currTile;
        hand.empty();
    
    for(tile in tiles){
        hand.append('<button id="tile" onclick="onTileClick()" class="tile ' + tiles[tile].color +'">'+tiles[tile].value +'</button>');
//          currTile = tiles[tile];
//          var value = currTile.value;
//          var color = currTile.color;
//        currTile = tiles[tile];
//        newButton = document.createElement('input');
//        newButton.type = 'button';
//        newButton.value = currTile.value;
//        newButton.class = "tile" + currTile.color;
//        newButton.id = "tile";
//        newButton.onclick = function() {
//            onTileClick();
//        };
//        hand.append(newButton);
    }
    
//        var i, buttonsToCreate, buttonContainer, newButton;
//        buttonsToCreate = ['button1','button2','button3','button4','button5'];
//        buttonContainer = document.getElementById('this_element_contains_my_buttons');
//        for (i = 0; i < buttonsToCreate.length; i++) {
//          newButton = document.createElement('input');
//          newButton.type = 'button';
//          newButton.value = buttonsToCreate[i];
//          newButton.id = buttonsToCreate[i];
//          newButton.onclick = function () {
//            alert('You pressed '+this.id);
//            arrayToModify[arrayToModify.length] = this.id;
//          };
//          buttonContainer.appendChild(newButton);
//      }
    
//        this.handTile.getChildren().clear();
//        for (rummikub.client.ws.Tile currWsTile : handWsTiles) {
//            AnimatedTilePane viewTile = new AnimatedTilePane(convertWsTileToLogicTile(currWsTile));
//            initTileListeners(viewTile);
//            this.handTile.getChildren().add(viewTile);
//        }
}

function handlePlayerResignedEvent(event) {

}

function handlePlayerTurnEvent(event) {
    
    setFirstTurnMsg();//todo!!!!
    setCurrPlayerClass(event.playerName);
    setGameMessage(getTurnMsg())
    showPlayerHandWs();
        if (myDetails.name === currPlayerName){
                enableButtons();
        }
        else{
                disableButtons();
        }
}

function setFirstTurnMsg(){}

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
    var j=0;
    
    for (var i = 0; i < playersDetailsList.length; i++) {
        playerBar[j].innerHTML = (playersDetailsList[i]).name;
        playerBar[j+1].innerHTML  = (playersDetailsList[i]).numberOfTiles;
        j+=2;
    }
}

function setCurrPlayerClass(currPlayer) {
    if (currPlayerName!== undefined && currPlayerName !== EMPTY_STRING) {
        $('nameFcurrPlayer', "#playerBar").removeClass('nameFcurrPlayer');
    }
    var test =$('nameFcurrPlayer', "#playerBar");
    var playersFileds=$('nameFcurrPlayer', "#playerBar");
    
    currPlayerName = currPlayer;
    
    var name=$.inArray(currPlayerName, playersFileds);
    //var name=$("div:contains("+currPlayerName+"), "#playerBar");
    name.addClass('nameFcurrPlayer');
}



function initBoard() {

}
function onTileClick() {
    
}

function getMyDetails() {
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
            } 
            else {
                setGameMessage(data.voidAndStringResponse);
            }

            triggerAjaxEventMonitoring();
        },
        error: function (error) {
            triggerAjaxEventMonitoring();
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
    for(button in gameButtonsList){
        var currButton = gameButtonsList[button];
        currButton.disable = disableButtons;
    }
}