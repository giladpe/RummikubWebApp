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
    var numOfPlayerJs = $("#numOfPlayers").val();
    var computerPlayersJs = $("#computerPlayers").val();

    if (computerPlayersJs === "") {
        computerPlayersJs = 0
    }
    if (gameNameJs !== "" && numOfPlayerJs !== "")
    {
        var humanPlayersJs = numOfPlayerJs - computerPlayersJs;
        $.ajax({
            url: "CreateNewGameServlet", //servlet

            data: {"gameName": gameNameJs, "computerPlayers": computerPlayersJs, "humanPlayers": humanPlayersJs},
            timeout: 2000,
            dataType: 'json',
            success: function (data) {
                if (data === "")//success **************************
                {
                    clearNewGameFileds();
                    $("#errorMsg").text(gameNameJs + " game was created")
                    getWaitingGames();

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
                printTable(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR + " " + textStatus + " " + errorThrown);
            }
        });
    }
}

function printTable(watingGameList) {

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