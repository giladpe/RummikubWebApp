/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package rummikubUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @author Arthur
 */
public class SessionUtils {
    private static final String PLAYED_ID = "playerId";
    private static final boolean CREATE_NEW_SESSION_IF_ABSENT = true;

    public static Integer getPlayerId (HttpServletRequest request) {
        Integer playerId;
        HttpSession session = request.getSession(!CREATE_NEW_SESSION_IF_ABSENT);        
        Object sessionAttribute = session != null ? session.getAttribute(PLAYED_ID) : null;
        
        playerId  = sessionAttribute != null ? (Integer)sessionAttribute : null;
                
        return playerId;
    }
    
    public static void setPlayerId (HttpServletRequest request, int playerID) {
        HttpSession session = request.getSession(CREATE_NEW_SESSION_IF_ABSENT);        
        session.setAttribute(PLAYED_ID, playerID);
    }
    
    public static Integer getEventId (HttpServletRequest request) {
        Integer eventID;
        HttpSession session = request.getSession(!CREATE_NEW_SESSION_IF_ABSENT);        
        Object sessionAttribute = session != null ? session.getAttribute(PLAYED_ID) : null;
        
        if (sessionAttribute != null) {
            eventID = (Integer)sessionAttribute;
        }
        else {
            eventID = 0;
            setEventId(request,eventID);
        }
        
        return eventID;
    }
    
    public static void setEventId (HttpServletRequest request, int eventID) {
        HttpSession session = request.getSession(CREATE_NEW_SESSION_IF_ABSENT);        
        session.setAttribute(PLAYED_ID, eventID);
    }
    

    public static void clearSession (HttpServletRequest request) {
        request.getSession().invalidate();
    }
}
