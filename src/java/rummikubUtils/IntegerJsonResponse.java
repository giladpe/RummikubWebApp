/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rummikubUtils;

/**
 *
 * @author Arthur
 */
public class IntegerJsonResponse  extends JsonResponse {

    private int intResponse;

    public IntegerJsonResponse() {
        super();
        this.intResponse = 0;
    }
    
    public void setIntResponse(int intResponse) {
        this.intResponse = intResponse;
    }

    public int getIntResponse() {
        return intResponse;
    }
    
    public void setResposne(boolean isException, int intResponse) {
        this.intResponse = intResponse;
        super.setIsException(isException);
    }
    
}
