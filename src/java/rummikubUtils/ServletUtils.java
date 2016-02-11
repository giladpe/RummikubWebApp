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
        
        if (value != null) 
        {
            try 
            {
                resVal = Integer.parseInt(value);
            }
            catch (NumberFormatException numberFormatException) {}
        }
        
        return resVal;
    }

    public static Tile parseTileStringToWsTile(String strOfWsTile) {
        Tile tile = new Tile();
        tile.setColor(null);
        tile.setValue(Integer.parseInt(strOfWsTile));
        return tile;
    }

}
