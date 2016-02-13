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
public class VoidAndStringJsonResponse extends JsonResponse {

    private String voidAndStringResponse;

    public VoidAndStringJsonResponse() {
        super();
        this.voidAndStringResponse = ServletUtils.EMPTY_STRING;
    }

    public String getVoidResponse() {
        return voidAndStringResponse;
    }
    
    public void setResposne(boolean isException, String voidAndStringResponse) {
        this.voidAndStringResponse = voidAndStringResponse;
        super.setIsException(isException);
    }
}
