/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import rummikubUtils.ParameterNamesConstants;
import rummikubUtils.ServletUtils;
import ws.rummikub.GameDoesNotExists_Exception;
import ws.rummikub.PlayerDetails;
import ws.rummikub.RummikubWebService;

/**
 *
 * @author Arthur
 */
@WebServlet(name = "GetPlayersDetailsServlet", urlPatterns = {"/GetPlayersDetailsServlet"})
public class GetPlayersDetailsServlet extends HttpServlet {

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
        response.setContentType(ParameterNamesConstants.CONTENT_TYPE);

        try (PrintWriter out = response.getWriter()) {
            String gameName = request.getParameter(ParameterNamesConstants.GAME_NAME);
            RummikubWebService rummikubAPI = ServletUtils.getRummikubWsAPI(getServletContext());
            
            response.setStatus(response.SC_OK);

            try {
                List<PlayerDetails> playerDetailsList = rummikubAPI.getPlayersDetails(gameName);
                out.print(ServletUtils.GlobalGsonObject.toJson(playerDetailsList));
            }
            catch (GameDoesNotExists_Exception ex) {
                out.print(ServletUtils.GlobalGsonObject.toJson(ex.getMessage()));
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

}
