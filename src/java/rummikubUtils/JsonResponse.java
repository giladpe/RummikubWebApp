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
public abstract class JsonResponse {

    private boolean isException;

    public JsonResponse() {
        this.isException = false;
    }
        
    public void setIsException(boolean isException) {
        this.isException = isException;
    }

    public boolean isIsException() {
        return this.isException;
    }

}
