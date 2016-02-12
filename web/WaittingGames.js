/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () { // onload...do
    $('#joinBtn').on('click', function (event) {
        joinGame();
    });
    $('#newGamebtn').on('click', function (event) {
        createNewGame();
    });
    $('#refreshGameBtn').on('click', function (event) {
        getWaitingGames();
    });

});

function createNewGame()
{
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

            data: {"gameName": gameNameJs, "computerPlayers": computerPlayersJs, "humanPlayers": humanPlayersJs},
            timeout: 2000,
            dataType: 'json',
            success: function (data) {
                if (data === null)//success **************************
                {
                    alert("game was created");
                    $("#errorMsg").text(gameNameJs + " game was created");
                    //getWaitingGames();

                } else
                {
                    alert("game not created");
                    $("#errorMsg").text(data);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("servlet Error");
                console.error(jqXHR + " " + textStatus + " " + errorThrown);
            }
        });
    }
}
function clearNewGameFileds() {

}

function getWaitingGames()
{
    {
        $.ajax({
            url: "GetWaitingGamesServlet", //servlet
            data: {},
            timeout: 2000,
            dataType: 'json',
            success: function (data) {
                alert("suc Servlet GetWaiting games")
                printTable(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Error Servlet GetWaiting games")
                console.error(jqXHR + " " + textStatus + " " + errorThrown);
            }
        });
    }
}



function printTable(watingGameList) {
    addSelection("Test");
    for(var i=0;i<watingGameList.length;i++){
        addSelection(watingGameList[i]);
    }
}
function addSelection(gameName) {
    var selection = $("selectionBar");
    var option = $.createElement("option");
    option.text = gameName;
    selection.add(option, selection[0]);
}
function addRowToTable(gameDetails) {
    var table = $("#gamesTable");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    for (var i = 0; i < 4; i++) {
        row.insertCell(i).innerHTML = gameDetails[i];
    }
}



function joinGame()
{

    var player_value = $("#playerNameLabel").val();

    if (game_value !== "" && player_value !== "")
    {
        $.ajax({
            url: "JoinGameServlet", //servlet
            data: {"gameName": game_value, "playerName": player_value},
            timeout: 2000,
            dataType: 'json',
            success: function (data) {
                if (data === "")
                {
                    document.location.href = "gamePage.html";
                } else
                {
                    $("#errorMsg").text(data);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR + " " + textStatus + " " + errorThrown);
            }
        });
    }
}