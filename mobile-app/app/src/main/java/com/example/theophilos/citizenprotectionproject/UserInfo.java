
package com.example.theophilos.citizenprotectionproject;

/**
 * Created by theophilos on 5/6/20.
 */

public class UserInfo {
    String username;
    String password;
    String token;


    public UserInfo(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getToken() {
        return token;
    }

}

