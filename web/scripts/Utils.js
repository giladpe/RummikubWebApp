/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gameName="";

function redirect(destAddress) {
    window.location=destAddress;
}

function getGameDetails(gameName) {
    var gameDetails = "";
    $.ajax({
        url: "http://localhost:8080/RummikubWebApp/GetGameDetailsServlet", //servlet
        data: {"gameName": gameName},
        async: false,
        timeout: 5000,
        dataType: 'json',
        success: function (data) {
            if (!data.isException)
            {
                gameDetails = data.gameDetailsResposne;
            }
            else {
                 $('#errorMsg').html(data.voidAndStringResponse).fadeIn(500).delay(2000).fadeOut(500);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("serv faild details");
            console.error(jqXHR + " " + textStatus + " " + errorThrown);
        }
    });
    return gameDetails;
}

function getPlayersDetailsList(gameName){
        var playersDetails = "";
    $.ajax({
        url: "http://localhost:8080/RummikubWebApp/GetPlayersDetailsServlet", //servlet
        data: {"gameName": gameName},
        async: false,
        timeout: 5000,
        dataType: 'json',
        success: function (data) {
            if (!data.isException)
            {
                playersDetails = data.playersDetailsListResposne;
            }
            else {
                 $('#errorMsg').html(data.voidAndStringResponse).fadeIn(500).delay(2000).fadeOut(500);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("serv faild details");
            console.error(jqXHR + " " + textStatus + " " + errorThrown);
        }
    });
    return playersDetails;
}

function getPlayersNamesArray(playersDetailsList){
    var playersNamesArray = [];
    for(var i=0;i<playersDetailsList.length;i++){
        if(playersDetailsList[i].status === undefined){
        playersNamesArray.push(playersDetailsList[i].name);
        }
    }
    return playersNamesArray;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}