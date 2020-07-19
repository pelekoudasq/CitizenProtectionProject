
package com.example.theophilos.citizenprotectionproject;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.nfc.Tag;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.MenuInflater;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import static com.example.theophilos.citizenprotectionproject.MainActivity.getUnsafeOkHttpClient;

public class IncidentsActivity extends AppCompatActivity {

    private ArrayList<String> incidentNames = new ArrayList<>();
    private ArrayList<String> incidentPriorities = new ArrayList<>();
    private DrawerLayout drawer;

    public Retrofit retrofit = new Retrofit.Builder()
            .baseUrl("https://10.0.2.2:9000")
            .addConverterFactory(GsonConverterFactory.create())
            .client( getUnsafeOkHttpClient().build())
            .build();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_incidents);

        Toolbar toolbar = findViewById(R.id.toolBar);
        setSupportActionBar(toolbar);


        drawer = findViewById(R.id.drawer_layout);
        drawer.setScrimColor(Color.TRANSPARENT);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this,drawer,toolbar,
                R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.addDrawerListener(toggle);
        toggle.syncState();




        //Retrieve token wherever necessary
        SharedPreferences preferences = IncidentsActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
        String usrName = preferences.getString("USRNAME",null);


        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        View hView =  navigationView.getHeaderView(0);
        TextView nav_user = (TextView)hView.findViewById(R.id.accountName);
        nav_user.setText(usrName);

        showIncidents( this.getCurrentFocus() );


    }

    @Override
    public void onBackPressed(){
        if (drawer.isDrawerOpen(GravityCompat.START)){
            drawer.closeDrawer(GravityCompat.START);
        } else{
            return;
        }

    }


    public void showIncidents(View view){

        SharedPreferences preferences = IncidentsActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
        String usrId  = preferences.getString("ID",null);
        String token  = preferences.getString("TOKEN",null);

        JsonApi jsonApi = retrofit.create(JsonApi.class);
        Call<Incidents> call = jsonApi.getAcceptedIncidents( "Bearer "+token , usrId );


        call.enqueue(new Callback<Incidents>() {
            @Override
            public void onResponse(Call<Incidents> call, Response<Incidents> response) {
                if(!response.isSuccessful()) {
                    return;
                }

                Incidents acceptedIncidents = response.body();
                LinearLayout buttonLayout,recyclerLayout;

                List<Incident> incList = acceptedIncidents.getIncidents();
                if ( incList.size() == 0 ){
                    recyclerLayout = findViewById(R.id.recyclerLayout);
                    recyclerLayout.setVisibility(View.INVISIBLE);

                    buttonLayout = findViewById(R.id.buttonLayout);
                    buttonLayout.setVisibility(View.VISIBLE);

                }
                else{

                    buttonLayout = findViewById(R.id.buttonLayout);
                    buttonLayout.setVisibility(View.INVISIBLE);

                    recyclerLayout = findViewById(R.id.recyclerLayout);
                    recyclerLayout.setVisibility(View.VISIBLE);
                    for ( Incident i : incList ){
                        incidentNames.add(i.getTitle());
                        incidentPriorities.add(i.getPriority());
                    }
                    initRecyclerView();
                }


            }

            @Override
            public void onFailure(Call<Incidents> call, Throwable t) {
            }
        });
    }


    private void initRecyclerView(){
        RecyclerView recyclerView = findViewById(R.id.recyclerView);
        RecyclerViewAdapter adapter = new RecyclerViewAdapter(incidentNames,incidentPriorities,this);
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
    }
}

