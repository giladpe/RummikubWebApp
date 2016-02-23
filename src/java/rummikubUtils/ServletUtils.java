/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rummikubUtils;

import com.google.gson.Gson;
import java.net.MalformedURLException;
import java.net.URL;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import ws.rummikub.RummikubWebService;
import ws.rummikub.RummikubWebServiceService;
import ws.rummikub.Tile;
import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import ws.rummikub.Color;
//import rummikub.gameLogic.model.gameobjects.Tile;

/**
 *
 * @author Arthur
 */
public class ServletUtils {

    private static final String HTTP = "http://";
    private static final String address = "localhost";
    private static final String port = "8080";
    public static final String RUMMIKUB_API = "/RummikubApi/RummikubWebServiceService?wsdl";
    private static final String RUMMIKUB_WS_API = "rummikubWsApi";
    public static final Gson GlobalGsonObject = new Gson();
    public static final String EMPTY_STRING = "";
    public static final IntegerJsonResponse intResposne = new IntegerJsonResponse();
    public static final VoidAndStringJsonResponse voidAndStringResposne = new VoidAndStringJsonResponse();
    public static final GameDetailsJsonResponse gameDetailsResposne = new GameDetailsJsonResponse();
    public static final StringListJsonResponse stringListResposne = new StringListJsonResponse();
    public static final PlayerDetailsJsonResponse playerDetailsResposne = new PlayerDetailsJsonResponse();
    public static final PlayersDetailsListJsonResponse playersDetailsResposne = new PlayersDetailsListJsonResponse();
    public static final EventListJsonResponse eventListResposne = new EventListJsonResponse();

    public static final boolean EXCEPTION = true;

//    public static final JsonResponse jasonResponse = new JsonResponse();
//    public static final int NUM_OF_PARAMS_IN_JASON_RESPONSE = 2;
//    public static final int TYPE = 0;
//    public static final int CONTENT = 1;
//    public static final String[] JSON_RESPONSE = new String[NUM_OF_PARAMS_IN_JASON_RESPONSE];
    public static RummikubWebService getRummikubWsAPI(ServletContext servletContext) {
        try {
            if (servletContext.getAttribute(RUMMIKUB_WS_API) == null) {

                URL location = new URL(HTTP + address + ":" + port + RUMMIKUB_API);
                RummikubWebServiceService service = new RummikubWebServiceService(location);
                RummikubWebService rummikubWsAPI = service.getRummikubWebServicePort();

                servletContext.setAttribute(RUMMIKUB_WS_API, rummikubWsAPI);
            }

        } catch (MalformedURLException ex) {
        }

        return (RummikubWebService) servletContext.getAttribute(RUMMIKUB_WS_API);
    }

    public static Integer getIntParameter(HttpServletRequest request, String parameterName) {
        String value = request.getParameter(parameterName);
        Integer resVal = null;

        if (value != null) {
            try {
                resVal = Integer.parseInt(value);
            } catch (NumberFormatException numberFormatException) {
            }
        }

        return resVal;
    }

    public static Tile parseTileStringToWsTile(String strOfWsTile) {
        //Type typeOfT = new TypeToken<Tile.class>(){}.g
        //Tile tile = ServletUtils.GlobalGsonObject.fromJson(strOfWsTile, Tile.class);
        //[{"color":"RED","value":"1"}]
        Tile tile = new Tile();
        tile.setColor(getColor(strOfWsTile));
        tile.setValue(getVal(strOfWsTile));
        return tile;
    }

    private static Color getColor(String str) {
        Color retColor;
        if (str.contains("BLUE")) {
            retColor=Color.BLUE;
        } else if (str.contains("RED")) {
            retColor=Color.RED;
        } else if (str.contains("BLACK")) {
            retColor=Color.BLACK;
        } else {
            retColor=Color.YELLOW;
        }
        return retColor;
    }


    private static int getVal(String str) {
        int retVal;
        if (str.contains("13")) {
            retVal = 13;
        } else if (str.contains("12")) {
            retVal = 12;
        } else if (str.contains("11")) {
            retVal = 11;
        } else if (str.contains("10")) {
            retVal =10 ;
        } else if (str.contains("9")) {
            retVal =9 ;
        } else if (str.contains("8")) {
            retVal = 8;
        } else if (str.contains("7")) {
            retVal = 7;
        } else if (str.contains("6")) {
            retVal = 6;
        } else if (str.contains("5")) {
            retVal = 5;
        } else if (str.contains("4")) {
            retVal = 4;
        } else if (str.contains("3")) {
            retVal = 3;
        } else if (str.contains("2")) {
            retVal = 2;
        } else if (str.contains("1")) {
            retVal = 1;
        }else {
            retVal=0;
        }
        
        return retVal;
    }
}





