package com.example.theophilos.citizenprotectionproject;

import java.util.Date;

public class NewComment {

    String text;
    String user_id;
    String incident_id;
    int final_comment;

    public NewComment ( String i , String t ,String u){
        this.text = t;
        this.incident_id = i;
        this.user_id = u;
        final_comment = 0;
    }

    public String getIncidentId() {
        return incident_id;
    }

    public String getText() {
        return text;
    }

    public String getUserId() {
        return user_id;
    }
}
