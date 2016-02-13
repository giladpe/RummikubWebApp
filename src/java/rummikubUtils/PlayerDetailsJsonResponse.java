/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rummikubUtils;

import ws.rummikub.PlayerDetails;
/**
 *
 * @author Arthur
 */
public class PlayerDetailsJsonResponse extends JsonResponse {

    private PlayerDetails playerDetailsResposne;
    
    public PlayerDetailsJsonResponse() {
        this.playerDetailsResposne = null;
    }
    
    public PlayerDetails getPlayerDetailsResposne() {
        return playerDetailsResposne;
    }
    
    public void setResposne(boolean isException, PlayerDetails playerDetailsResposne) {
        this.playerDetailsResposne = playerDetailsResposne;
        super.setIsException(isException);
    }

    
}
