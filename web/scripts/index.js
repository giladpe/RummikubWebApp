/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var game_selected = "";
$(function () { // onload...do
    getWaitingGames();
    $('#joinBtn').on('click', function (event) {
        joinGame();
    });
    $('#newGamebtn').on('click', function (event) {
        createNewGame();
        return false;
    });
    $('#refreshGameBtn').on('click', function (event) {
        getWaitingGames();
        return false;
    });

});



function joinGame()
{
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
                    if (data === "")
                    {
                        //document.location.href = "gamePage.html";  //go to the game pager
                    } else
                    {
                        $('#errorMsg').html(data).fadeIn(500).delay(2000).fadeOut(500);
                        ;
                    }

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(jqXHR + " " + textStatus + " " + errorThrown);
                }
            });
        }
    }
}

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
            async: false,
            data: {"gameName": gameNameJs, "computerPlayers": computerPlayersJs, "humanPlayers": humanPlayersJs},
            timeout: 3000,
            dataType: 'json',
            success: function (data) {
                if (data === "")//success **************************
                {
                    $('#errorMsg').html(gameNameJs + ' game was created').fadeIn(500).delay(2000).fadeOut(500);
                    var gameTableDetailds = getTableGameDetails(gameNameJs);
                    addRowToTable(gameTableDetailds);
                    clearNewGameFileds();

                } else
                {
                    $("#errorMsg").html(data).fadeIn(500).delay(2000).fadeOut(500);
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

function clearNewGameFileds()
{
    
    
    var gameNameJs = $("#gameName").val("");
    var humanPlayersJs = $("#humanPlayers").val("");
    var computerPlayersJs = $("#computerPlayers").val("");
}

function getWaitingGames()
{
    $("#tableBody tr").remove();
    $("#selectionBar option").remove();
    $.ajax({
        url: "GetWaitingGamesServlet", //servlet
        data: {},
        timeout: 5000,
        dataType: 'json',
        success: function (data) {
            game_selected = ""
            printTable(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error Servlet GetWaiting games");
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
function getTableGameDetails(gameName)
{
    var gameDetails = getGameDetails(gameName);
    return ([gameName, gameDetails.humanPlayers, gameDetails.computerizedPlayers, gameDetails.status]);
}

function addRowToTable(gameDetails) {
    var data = "";
    for (var i = 0; i < 4; i++) {
        data = data + "<td>" + gameDetails[i] + "</td>"
    }
    $('#gamesTable').append('<tr onclick="OnRowSel(this)">' + data + '</tr>');
}

function OnRowSel(obj)
{
    $(".rowSelected", "#gamesTable").removeClass('rowSelected');
    $(obj).addClass('rowSelected');
    var selectedRow = $(".rowSelected", "#gamesTable");
    game_selected = selectedRow[0].cells[0].innerText;

}
function getGameDetails(gameName) {
    var gameDetails = "";
    $.ajax({
        url: "GetGameDetailsServlet", //servlet
        data: {"gameName": gameName},
        async: false,
        timeout: 5000,
        dataType: 'json',
        success: function (data) {
            if (data !== "")
            {
                gameDetails = data;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("serv faild details");
            console.error(jqXHR + " " + textStatus + " " + errorThrown);
        }
    });
    return gameDetails;
}


