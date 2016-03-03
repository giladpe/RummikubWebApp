/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.AbstractList;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import rummikubUtils.ServletParameterNamesConstants;
import rummikubUtils.ServletUtils;
import rummikubUtils.SessionUtils;
import ws.rummikub.Event;
import ws.rummikub.InvalidParameters_Exception;
import ws.rummikub.RummikubWebService;

/**
 *
 * @author Arthur
 */
@WebServlet(name = "GetEventsServlet", urlPatterns = {"/GetEventsServlet"})
public class GetEventsServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType(ServletParameterNamesConstants.JSON_CONTENT_TYPE);

        try (PrintWriter out = response.getWriter()) {
            RummikubWebService rummikubAPI = ServletUtils.getRummikubWsAPI(getServletContext());
            
            response.setStatus(response.SC_OK);

            try {
                Integer eventID = ServletUtils.getIntParameter(request, ServletParameterNamesConstants.EVENT_ID);
                Integer playerId = SessionUtils.getPlayerId(request);
                List<Event> eventList = getEventListFromWs(rummikubAPI, eventID, playerId);
                
                ServletUtils.eventListResposne.setResposne(!ServletUtils.EXCEPTION, eventList);
                out.print(ServletUtils.GlobalGsonObject.toJson(ServletUtils.eventListResposne));                
            }
            catch (InvalidParameters_Exception ex) {
                ServletUtils.voidAndStringResposne.setResposne(ServletUtils.EXCEPTION, ex.getMessage());
                out.print(ServletUtils.GlobalGsonObject.toJson(ServletUtils.voidAndStringResposne));                
            }

            out.flush();
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

    private List<Event> getEventListFromWs(RummikubWebService rummikubAPI, Integer eventID, Integer playerId) throws InvalidParameters_Exception {
        List<Event> eventList;
        
        if (playerId == null || eventID == null) {
            eventList = new ArrayList<>();
        } 
        else {
            eventList = rummikubAPI.getEvents(playerId, eventID);
        }    
        
        return eventList;
    }

}
