/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () { // onload...do
    getWaitingGames();
    $('#joinBtn').on('click', function (event) {
        joinGame();
    });
    $('#newGamebtn').on('click', function (event) {
        createNewGame();
        getWaitingGames();
        return false;
    });
    $('#refreshGameBtn').on('click', function (event) {
        getWaitingGames();
        return false;
    });
    $('#tableBody').find('tr').on('click', function(event){
        tableSelected(this);
        alert('You clicked row '+ ($(this).index()) );
        return false;
});

});

function tableSelected(){    
    alert('You clicked row '+ ($(this).index()) );
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

            data: {"gameName": gameNameJs, "computerPlayers": computerPlayersJs, "humanPlayers": humanPlayersJs},
            timeout: 3000,
            dataType: 'json',
            success: function (data) {
                if (data === "")//success **************************
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

                alert("servlet Error : " + jqXHR.status);
                console.error(jqXHR + " " + textStatus + " " + errorThrown);
            }
        });
    }
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

            alert("suc Servlet GetWaiting games");
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
        addSelection(watingGameList[i]);
    }
    for (var i = 0; i < watingGameList.length; i++) {
        var gameName = watingGameList[i];
        addRowToTable([gameName, "", "", ""]);
    }
}
function addSelection(gameName) {
    //var selection = $("#selectionBar");
    $('<option>').val(gameName).text(gameName).appendTo('#selectionBar');
}



function joinGame()
{
    var gameNameJs = $('#selectionBar').find(":selected").text();
    var playerNameJs = $("#playerName").val();
    if (gameNameJs !== "" && playerNameJs !== "")
    {
        {
            $.ajax({
                url: "JoinGameServlet", //servlet
                data: {"gameName": gameNameJs, "playerName": playerNameJs},
                timeout: 2000,
                dataType: 'json',
                success: function (data) {
                    if (data === "")
                    {
                        //document.location.href = "gamePage.html";  //go to the game pager
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
}



function addRowToTable(gameDetails) {
    var table = document.getElementById("tableBody");

    var row = table.insertRow(0);
    for (var i = 0; i < 4; i++) {
        row.insertCell(i).innerHTML = gameDetails[i];
    }
}
function updateGamesDetails()
{
    var table = document.getElementById("tableBody");
    var size = table.childElementCount;
    var a = table.length;
    for (var i = 0; i < size; i++) {
        var row = document.getElementById("tableBody").rows[i];
        var cells = row[i].cells;
        var gameName = cells[0];
        initGameDetails(gameName, row);


    }
}
function initGameDetails(gameName, row) {
    $.ajax({
        url: "GetGameDetailsServlet", //servlet
        data: {"gameName": game_value, "playerName": player_value},
        timeout: 2000,
        dataType: 'json',
        success: function (data) {
            if (data !== "")
            {
                row.cells[1] = data.humanPlayers;
                row.cells[2] = data.computerizedPlayers
                row.cells[3] = data.status
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR + " " + textStatus + " " + errorThrown);
        }
    });


}

function test() {
    var watingGameList = ["aaa", "bbb", "ccc"];
    for (var i = 0; i < watingGameList.length; i++) {
        var gameName = watingGameList[i];
        addRowToTable([gameName, 1, 1, 1]);
    }
}

