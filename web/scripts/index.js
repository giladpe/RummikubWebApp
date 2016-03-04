/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var game_selected = "";
var NUM_OF_COLUMS = 6;
var CHOOSE_PLAYER = "Choose Player name: ";
var NAME_PLACEHOLDER = 'Insert player name';
var EMPTY_STRING = "";

$(function () { // onload...do
    $('#joinBtn').on('click', function (event) {
        joinGame();
        return false;
    });
    $('#newGamebtn').on('click', function (event) {
        createNewGame();
        return false;
    });
    $('#refreshGameBtn').on('click', function (event) {
        getWaitingGames();
        return false;
    });
    getWaitingGames();
});
//window.onload  = function() { 
//    getWaitingGames();
//    $('#joinBtn').on('click', function (event) {
//        joinGame();
//        return false;
//    });
//
//    $('#newGamebtn').on('click', function (event) {
//        createNewGame();
//        return false;
//    });
//    
//    $('#refreshGameBtn').on('click', function (event) {
//        getWaitingGames();
//        return false;
//    });
//};

////test zone

function processFile(e) {
    var file = e.target.result;
    loadServlet(file);
}

function onLoadGame() {
    var fileInput = $('#files');
    //var uploadButton = $('#upload');
    if (!window.FileReader) {
        alert('Your browser is not supported')
    }
    var input = fileInput.get(0);
    // Create a reader object
    var reader = new FileReader();
    if (input.files.length) {
        var textFile = input.files[0];
        reader.readAsText(textFile);
        $(reader).on('load', processFile);
    } else {
        setGameMessage('Please upload a file before continuing')
    }

//var txt = "";

//document.getElementById("demo").innerHTML = txt;
}

function setGameMessage(msg) {
    $("#errorMsg").html(msg).fadeIn(500).delay(3000).fadeOut(500);
}

function loadServlet(file) {

    $.ajax({
        url: "CreateGameFromXMLServlet", //servlet
        async: false,
        data: {"xmlData": file},
        timeout: 3000,
        dataType: 'json',
        success: function (data) {
            if (!data.isException) //success 
            {
                $('#errorMsg').html(data.voidAndStringResponse + 'game was created').fadeIn(500).delay(2000).fadeOut(500);
                updateGameList(data.voidAndStringResponse);
//                var gameTableDetailds = getTableGameDetails(data.voidAndStringResponse);
//                addRowToTable(gameTableDetailds);
//                getWaitingGames();
            } else
            {
                $("#errorMsg").html(data.voidAndStringResponse).fadeIn(500).delay(2000).fadeOut(500);
            }
            $('#files').val("");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("servlet Error : " + jqXHR.status);
            console.error(jqXHR + " " + textStatus + " " + errorThrown);
        }
    });
}

function convertXmlToString(file) {
    var r = new FileReader();
    var fileAsString = r.readAsText(file);
    alert(fileAsString);
    return fileAsString;
}


function joinGame() {
    var playerNameJs = $("#playerName").val();
    if (game_selected !== "" && playerNameJs !== "")
    {
        {
            $.ajax({
                url: "JoinGameServlet", //servlet
                data: {"gameName": game_selected, "playerName": playerNameJs},
                timeout: 3000,
                dataType: 'json',
                async: false,
                success: function (data) {
                    if (!data.isException)
                    {

                        redirect("gameRoom/gameRoom.html?gid=" + game_selected)
                    } else
                    {
                        $('#errorMsg').html(data.voidAndStringResponse).fadeIn(500).delay(2000).fadeOut(500);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(jqXHR + " " + textStatus + " " + errorThrown);
                }
            });
        }
    }
}

function createNewGame() {
    var gameNameJs = $("#gameName").val();
    var humanPlayersJs = $("#humanPlayers").val();
    var computerPlayersJs = $("#computerPlayers").val();
    if (computerPlayersJs === "") {
        computerPlayersJs = 0;
    }
    if (gameNameJs !== "" && humanPlayersJs !== "")
    {
        $.ajax({
            url: "CreateNewGameServlet", //servlet
            async: false,
            data: {"gameName": gameNameJs, "computerPlayers": computerPlayersJs, "humanPlayers": humanPlayersJs},
            timeout: 3000,
            dataType: 'json',
            success: function (data) {
                if (!data.isException)  //success 
                {
                    $('#errorMsg').html(gameNameJs + ' game was created').fadeIn(500).delay(2000).fadeOut(500);
                    var gameTableDetailds = getTableGameDetails(gameNameJs);
                    addRowToTable(gameTableDetailds);
                    clearNewGameFileds();
                } else
                {
                    $("#errorMsg").html(data.voidAndStringResponse).fadeIn(500).delay(2000).fadeOut(500);
                    clearNewGameFileds();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {

                alert("servlet Error : " + jqXHR.status);
                console.error(jqXHR + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function clearNewGameFileds() {
    var gameNameJs = $("#gameName").val("");
    var humanPlayersJs = $("#humanPlayers").val("");
    var computerPlayersJs = $("#computerPlayers").val("");
}

function getWaitingGames() {
    $("#tableBody tr").remove();
    $("#selectionBar option").remove();
    $.ajax({
        url: "GetWaitingGamesServlet", //servlet
        data: {},
        timeout: 5000,
        dataType: 'json',
        success: function (data) {
            game_selected = "";
            printTable(data.stringListResposne);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR + " " + textStatus + " " + errorThrown);
        }
    });
}

function printTable(watingGameList) {
    for (var i = 0; i < watingGameList.length; i++) {
        var gameTableDetailds = getTableGameDetails(watingGameList[i]);
        addRowToTable(gameTableDetailds);
    }
}

function getTableGameDetails(gameName) {
    var gameDetails = getGameDetails(gameName);
    return ([gameName, gameDetails.humanPlayers, gameDetails.computerizedPlayers, gameDetails.status, gameDetails.joinedHumanPlayers, gameDetails.loadedFromXML]);
}

function updateGameList(gameName) {
    var gameDetails = getGameDetails(gameName);

    if (gameDetails !== EMPTY_STRING) {
        addRowToTable(gameDetails);
        getWaitingGames();
    }
}

function addRowToTable(gameDetails) {
    var data = "";
    for (var i = 0; i < NUM_OF_COLUMS; i++) {
        data = data + "<td>" + gameDetails[i] + "</td>";
    }
    $('#gamesTable').append('<tr onclick="OnRowSel(this)">' + data + '</tr>');
}

function OnRowSel(obj) {
    var placeHolder = NAME_PLACEHOLDER;
    $(".rowSelected", "#gamesTable").removeClass('rowSelected');
    $(obj).addClass('rowSelected');
    var selectedRow = $(".rowSelected", "#gamesTable");
    game_selected = selectedRow[0].cells[0].innerText;
    if (isLoadedFromXml(selectedRow)) {
        placeHolder = CHOOSE_PLAYER + getXMLPlayersNames(game_selected);
    }
    $('#playerName').attr('placeholder', placeHolder);
}

function isLoadedFromXml(selectedRow) {
    var retVal = false;
    if (selectedRow[0].cells[NUM_OF_COLUMS - 1].innerText === "true") {
        retVal = true;
    }
    return retVal;
}

function getXMLPlayersNames(gameName) {
    var res = "";
    var playersDetailsList = getPlayersDetailsList(gameName);
    var playersNameArray = getPlayersNamesArray(playersDetailsList);
    for (var i = 0; i < playersNameArray.length; i++) {
        res += playersNameArray[i];
        if (i !== playersNameArray.length - 1) {
            res += ",";
        }
    }
    //res=res.slice(0,res.length-1);
    return res;
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    var textFieldFunctionColler = $('#'+event.target.id).attr('placeholder');
    if (charCode > 31 && (charCode < 48 || charCode > 57)){
        setGameMessage('Please insert valid '+ textFieldFunctionColler+' number');
        return false;
    }
    return true;
}





