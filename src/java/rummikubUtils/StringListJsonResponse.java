/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rummikubUtils;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Arthur
 */
public class StringListJsonResponse extends JsonResponse {
        private List<String> stringListResposne;
    
    public StringListJsonResponse() {
        this.stringListResposne = new ArrayList<>();
    }
    
    public List<String> getGameDetailsResposne() {
        return stringListResposne;
    }

    public void setResposne(boolean isException, List<String> stringListResposne) {
        this.stringListResposne = stringListResposne;
        super.setIsException(isException);
    }
}
