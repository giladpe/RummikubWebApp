/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rummikubUtils;

import java.util.ArrayList;
import java.util.List;
import ws.rummikub.Event;

/**
 *
 * @author Arthur
 */
public class EventListJsonResponse  extends JsonResponse {
    private List<Event> eventListResposne;
    
    public EventListJsonResponse() {
        this.eventListResposne = new ArrayList<>();
    }
    
    public List<Event> getGameDetailsResposne() {
        return eventListResposne;
    }

    public void setResposne(boolean isException, List<Event> eventListResposne) {
        this.eventListResposne = eventListResposne;
        super.setIsException(isException);
    }
}
