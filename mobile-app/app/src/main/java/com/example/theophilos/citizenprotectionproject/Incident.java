package com.example.theophilos.citizenprotectionproject;

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
}
