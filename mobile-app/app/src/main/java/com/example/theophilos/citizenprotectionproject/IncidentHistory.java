
package com.example.theophilos.citizenprotectionproject;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;

import androidx.annotation.NonNull;
import com.google.android.material.navigation.NavigationView;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.appcompat.widget.Toolbar;

import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import static com.example.theophilos.citizenprotectionproject.LoginActivity.getUnsafeOkHttpClient;

public class IncidentHistory extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private ArrayList<String> incidentNames = new ArrayList<>();
    private ArrayList<String> incidentPriorities = new ArrayList<>();
    private ArrayList<String> incidentIds = new ArrayList<>();
    private DrawerLayout drawer;

    public Retrofit retrofit = new Retrofit.Builder()
            .baseUrl("https://10.0.2.2:9000")
            .addConverterFactory(GsonConverterFactory.create())
            .client( getUnsafeOkHttpClient().build())
            .build();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_incident_history);

        Toolbar toolbar = findViewById(R.id.toolBar);
        setSupportActionBar(toolbar);


        drawer = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);


        drawer.setScrimColor(Color.TRANSPARENT);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this,drawer,toolbar,
                R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.addDrawerListener(toggle);
        toggle.syncState();




        //Retrieve token wherever necessary
        SharedPreferences preferences = IncidentHistory.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
        String usrName = preferences.getString("USRNAME",null);


        View hView =  navigationView.getHeaderView(0);
        TextView nav_user = (TextView)hView.findViewById(R.id.accountName);
        nav_user.setText(usrName);

        showIncidents( this.getCurrentFocus() );


    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item ){

        switch (item.getItemId()){
            case R.id.nav_logout:
                SharedPreferences preferences = IncidentHistory.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
                String token  = preferences.getString("TOKEN",null);
                JsonApi jsonApi = retrofit.create(JsonApi.class);
                SharedPreferences.Editor editor = preferences.edit();
                editor.clear();
                editor.apply();
                finish();
                Call<Void> call = jsonApi.logout("Bearer "+token);
                call.enqueue(new Callback<Void>() {
                    @Override
                    public void onResponse(Call<Void> call, Response<Void> response) {
                        if(!response.isSuccessful()) {
                            return;
                        }
                    }
                    @Override
                    public void onFailure(Call<Void> call, Throwable t) {
                    }
                });


                Intent intent = new Intent(getApplicationContext(), LoginActivity.class);
                startActivity(intent);
                break;

            case R.id.nav_account:
                drawer.closeDrawer(GravityCompat.START);
                intent = new Intent(getApplicationContext(), UserInfoActivity.class);
                startActivity(intent);
                break;
            case R.id.nav_accepted:
                drawer.closeDrawer(GravityCompat.START);
                intent = new Intent(getApplicationContext(), IncidentsActivity.class);
                startActivity(intent);
                break;
            case R.id.nav_history:
                drawer.closeDrawer(GravityCompat.START);
                break;
        }

        return true;
    }

    @Override
    public void onBackPressed(){
        if (drawer.isDrawerOpen(GravityCompat.START)){
            drawer.closeDrawer(GravityCompat.START);
        } else{
            this.finish();
        }

    }


    public void showIncidents(View view){

        SharedPreferences preferences = IncidentHistory.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
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
                        if ( i.isActive() == false ) {
                            incidentNames.add(i.getTitle());
                            incidentPriorities.add(i.getPriority());
                            incidentIds.add(i.getId());
                        }
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
        RecyclerViewAdapter adapter = new RecyclerViewAdapter(incidentNames,incidentPriorities,incidentIds,this);
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
    }
}

