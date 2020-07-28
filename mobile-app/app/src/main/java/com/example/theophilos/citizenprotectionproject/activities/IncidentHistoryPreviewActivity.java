package com.example.theophilos.citizenprotectionproject.activities;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Bundle;

import com.example.theophilos.citizenprotectionproject.JsonApi;
import com.example.theophilos.citizenprotectionproject.R;
import com.example.theophilos.citizenprotectionproject.objects.Comment;
import com.example.theophilos.citizenprotectionproject.objects.Incident;
import com.example.theophilos.citizenprotectionproject.utilities.CommentRecyclerViewAdapter;
import com.example.theophilos.citizenprotectionproject.utilities.CustomMapView;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.material.navigation.NavigationView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import static com.example.theophilos.citizenprotectionproject.activities.LoginActivity.getUnsafeOkHttpClient;

public class IncidentHistoryPreviewActivity extends AppCompatActivity implements
        NavigationView.OnNavigationItemSelectedListener,
        OnMapReadyCallback {

    private DrawerLayout drawer;
    private CustomMapView mapView;
    private ArrayList<String> Comments = new ArrayList<>();
    private ArrayList<String> Dates = new ArrayList<>();
    private ArrayList<String> Times = new ArrayList<>();
    private List<Comment> comms;
    private static final String TAG = "IncidentPreviewScrolling";

    public Retrofit retrofit = new Retrofit.Builder()
            .baseUrl("https://10.0.2.2:9000")
//            .baseUrl("https://83.212.76.248:9000")
            .addConverterFactory(GsonConverterFactory.create())
            .client(getUnsafeOkHttpClient().build())
            .build();

    private static final String MAPVIEW_BUNDLE_KEY = "MapViewBundleKey";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.incident_history_preview);

        Toolbar toolbar = findViewById(R.id.toolBar);
        setSupportActionBar(toolbar);
        initGoogleMap(savedInstanceState);

        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("Πλατφόρμα Προστασίας Πολίτη");

        drawer = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);


        drawer.setScrimColor(Color.TRANSPARENT);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawer, toolbar,
                R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.addDrawerListener(toggle);
        toggle.syncState();

        //Retrieve token wherever necessary
        SharedPreferences preferences = IncidentHistoryPreviewActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
        String usrName = preferences.getString("USRNAME", null);


        View hView = navigationView.getHeaderView(0);
        TextView nav_user = (TextView) hView.findViewById(R.id.accountName);
        nav_user.setText(usrName);

        Intent myIntent = getIntent();
        String title = myIntent.getStringExtra("title");
        final TextView nameView;
        nameView = findViewById(R.id.incidentName);
        final TextView addressView = findViewById(R.id.incidentAdress);
        final TextView descView = findViewById(R.id.incidentDesc);
        nameView.setText(title);

        String token  = preferences.getString("TOKEN",null);
        JsonApi jsonApi = retrofit.create(JsonApi.class);
        Call<Incident> call = jsonApi.getIncident("Bearer "+token,myIntent.getStringExtra("id"));
        call.enqueue(new Callback<Incident>() {
            @Override
            public void onResponse(Call<Incident> call, Response<Incident> response) {
                if(!response.isSuccessful()) {
                    return;
                }
                Incident inc = response.body();
                Incident.Location loc = inc.getLocation();
                String adr;

                if ( loc != null ){
                    adr = loc.getAddress();
                    addressView.setText(adr);
                }

                if ( inc.getPriority().equals("Υψηλή")){
                    nameView.setCompoundDrawablesWithIntrinsicBounds(R.drawable.high, 0, 0, 0);
                }
                else if ( inc.getPriority().equals("Μέτρια")){
                    nameView.setCompoundDrawablesWithIntrinsicBounds(R.drawable.medium, 0, 0, 0);
                }
                else if ( inc.getPriority().equals("Χαμηλή")){
                    nameView.setCompoundDrawablesWithIntrinsicBounds(R.drawable.low, 0, 0, 0);
                }

                String desc = inc.getDescription();
                if(desc == null ){
                    descView.setText("Δεν έχει δοθεί ακόμα περιγραφή");
                }
                else{
                    descView.setText(desc);
                }


                comms = inc.getComments();
                showComments(getCurrentFocus());


            }
            @Override
            public void onFailure(Call<Incident> call, Throwable t) {
            }
        });


    }




    public void showComments(View view){
        Comments.clear();
        Times.clear();
        Dates.clear();
        SharedPreferences preferences = IncidentHistoryPreviewActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
        final String token  = preferences.getString("TOKEN",null);
        String usrId;
        for ( Comment c : comms ) {
            Comments.add(c.getText());
            String time = new SimpleDateFormat("HH:mm").format(c.getDate());
            Times.add(time);
            String date = new SimpleDateFormat("dd-MM-yyyy").format(c.getDate());
            Dates.add(date);

        }

        initRecyclerView();


    }



    private void initGoogleMap(Bundle savedInstanceState) {
        Bundle mapViewBundle = null;
        if (savedInstanceState != null) {
            mapViewBundle = savedInstanceState.getBundle(MAPVIEW_BUNDLE_KEY);
        }
        mapView = (CustomMapView) findViewById(R.id.mapview);
        mapView.onCreate(mapViewBundle);

        mapView.getMapAsync(this);
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item ){

        switch (item.getItemId()){
            case R.id.nav_logout:
                SharedPreferences preferences = IncidentHistoryPreviewActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
                String token  = preferences.getString("TOKEN",null);
                JsonApi jsonApi = retrofit.create(JsonApi.class);
                SharedPreferences.Editor editor = preferences.edit();
                editor.clear();
                editor.apply();
                finish();
                Call<Void> call = jsonApi.logout("Bearer " + token );
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
                intent = new Intent(getApplicationContext(), AcceptedIncidentsActivity.class);
                startActivity(intent);
                break;
            case R.id.nav_history:
                drawer.closeDrawer(GravityCompat.START);
                intent = new Intent(getApplicationContext(), IncidentHistoryActivity.class);
                startActivity(intent);
                break;
        }

        return true;
    }


    @Override
    public void onResume() {
        mapView.onResume();
        super.onResume();
    }


    @Override
    public void onPause() {
        super.onPause();
        mapView.onPause();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mapView.onDestroy();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        mapView.onLowMemory();
    }

    @Override
    public void onMapReady(final GoogleMap googleMap) {

        SharedPreferences preferences = IncidentHistoryPreviewActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
        String token = preferences.getString("TOKEN", null);


        JsonApi jsonApi = retrofit.create(JsonApi.class);
        Call<Incident> call = jsonApi.getIncident("Bearer "+token,getIntent().getStringExtra("id"));
        call.enqueue(new Callback<Incident>() {
            @Override
            public void onResponse(Call<Incident> call, Response<Incident> response) {
                if (!response.isSuccessful()) {
                    return;
                }
                Incident inc = response.body();
                double lat = inc.getLocation().getLatitude();
                double lon = inc.getLocation().getLongtitude();

                googleMap.addMarker(new MarkerOptions().position(new LatLng(lat,lon)).title("Marker"));
                if (ActivityCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    return;
                }

                //googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(location.getLatitude(), location.getLongitude()), 13));
                CameraPosition cameraPosition = new CameraPosition.Builder()
                        .target(new LatLng(lat,lon))
                        .zoom(14)
                        .bearing(90)
                        .build();
                googleMap.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));



            }
            @Override
            public void onFailure(Call<Incident> call, Throwable t) {
            }
        });



    }


    private void initRecyclerView(){

        RecyclerView recyclerView = findViewById(R.id.commentRecyclerView);
        CommentRecyclerViewAdapter adapter = new CommentRecyclerViewAdapter(Comments,Dates,Times,this);
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

    }

}