package com.example.theophilos.citizenprotectionproject;

import java.util.Date;

public class Comment {

    Date date;
    String text;
    String user;

    public Comment ( Date d , String t ,String u){
        this.text = t;
        this.date = d;
        this.user = u;
    }

    public Date getDate() {
        return date;
    }

    public String getText() {
        return text;
    }

    public String getUser() {
        return user;
    }
}
