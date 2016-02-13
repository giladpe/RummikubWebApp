/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rummikubUtils;

import java.util.ArrayList;
import java.util.List;
import ws.rummikub.PlayerDetails;

/**
 *
 * @author Arthur
 */
public class PlayersDetailsListJsonResponse extends JsonResponse {
    private List<PlayerDetails> playersDetailsListResposne;
    
    public PlayersDetailsListJsonResponse() {
        this.playersDetailsListResposne = new ArrayList<>();
    }
    
    public List<PlayerDetails> getPlayerDetailsResposne() {
        return playersDetailsListResposne;
    }

    public void setResposne(boolean isException, List<PlayerDetails> playersDetailsListResposne) {
        this.playersDetailsListResposne = playersDetailsListResposne;
        super.setIsException(isException);
    }
}
