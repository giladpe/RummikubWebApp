/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rummikubUtils;

import ws.rummikub.GameDetails;

/**
 *
 * @author Arthur
 */
public class GameDetailsJsonResponse extends JsonResponse {

    private GameDetails gameDetailsResposne;
    
    public GameDetailsJsonResponse() {
        this.gameDetailsResposne = null;
    }
    
    public GameDetails getGameDetailsResposne() {
        return gameDetailsResposne;
    }
    
    public void setResposne(boolean isException, GameDetails gameDetailsResposne) {
        this.gameDetailsResposne = gameDetailsResposne;
        super.setIsException(isException);
    }
}
