package com.example.theophilos.citizenprotectionproject;

/**
 * Created by theophilos on 2/7/20.
 */

public class SessionInfo {

    String _id;
    String token;
    String username;
    UserDetails details;
    int userType;

    public String get_id() {
        return _id;
    }

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public UserDetails getDetails() {
        return details;
    }

    public int getUserType() {
        return userType;
    }
}


