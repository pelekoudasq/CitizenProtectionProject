package com.example.theophilos.citizenprotectionproject;

import android.util.Log;
import android.widget.Toast;

import java.sql.Array;
import java.util.Date;
import java.util.List;

/**
 * Created by theophilos on 2/7/20.
 */

public class Incident {
    String title;
    String priority;
    String _id;
    boolean active;
    Location location;
    String description;
    List<Comment> comments;
    Date date;


    public List<Comment>  getComments() {
        return comments;
    }

    public String getTitle() {
        return title;
    }

    public String getPriority() {
        return priority;
    }

    public String getId() {
        return _id;
    }

    public boolean isActive() {
        return active;
    }

    public String getDescription() {
        return description;
    }

    public Location getLocation() {
        return location;
    }

    public class Location {
        String address;
        double latitude;
        double longtitude;

        public double getLatitude() {
            return latitude;
        }

        public double getLongtitude() {
            return longtitude;
        }

        public String getAddress() {
            return address;
        }

    }

    public Date getDate() {
        return date;
    }
}
