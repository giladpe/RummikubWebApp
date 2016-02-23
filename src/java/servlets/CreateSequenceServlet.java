/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import rummikubUtils.ServletParameterNamesConstants;
import rummikubUtils.ServletUtils;
import rummikubUtils.SessionUtils;
import ws.rummikub.InvalidParameters_Exception;
import ws.rummikub.RummikubWebService;

/**
 *
 * @author Arthur
 */
@WebServlet(name = "CreateSequenceServlet", urlPatterns = {"/CreateSequenceServlet"})
public class CreateSequenceServlet extends HttpServlet {

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
            String[] strVals = request.getParameterValues(ServletParameterNamesConstants.TILES);
            ArrayList<ws.rummikub.Tile> tiles = new ArrayList<>();

            for (String strVal : strVals) {
                System.out.println(strVal);
                ws.rummikub.Tile tile = ServletUtils.parseTileStringToWsTile(strVal);
                tiles.add(tile);
            }

            response.setStatus(response.SC_OK);

            try {
                rummikubAPI.createSequence(SessionUtils.getPlayerId(request), tiles);
                ServletUtils.voidAndStringResposne.setResposne(!ServletUtils.EXCEPTION, ServletUtils.EMPTY_STRING);
            }
            catch (InvalidParameters_Exception ex) {
                ServletUtils.voidAndStringResposne.setResposne(ServletUtils.EXCEPTION, ex.getMessage());
            }

            out.print(ServletUtils.GlobalGsonObject.toJson(ServletUtils.voidAndStringResposne));                
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
