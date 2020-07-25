package com.example.theophilos.citizenprotectionproject;

import java.util.Date;

public class Comment {

    Date date;
    String text;

    public Comment ( Date d , String t ){
        this.text = t;
        this.date = d;
    }

    public Date getDate() {
        return date;
    }

    public String getText() {
        return text;
    }

}
