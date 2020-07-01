package com.example.theophilos.citizenprotectionproject;

import android.content.Context;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

public class IncidentsActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_incidents);


        //Retrieve token wherever necessary
        SharedPreferences preferences = IncidentsActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
        String retrivedToken  = preferences.getString("TOKEN",null);//second parameter default value.

        Toast.makeText(this, retrivedToken , Toast.LENGTH_SHORT).show();

        TextView myAwesomeTextView = (TextView)findViewById(R.id.textView);

//in your OnCreate() method
        myAwesomeTextView.setText(retrivedToken);

    }
}
