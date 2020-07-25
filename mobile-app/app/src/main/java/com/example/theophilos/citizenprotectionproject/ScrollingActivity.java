package com.example.theophilos.citizenprotectionproject;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Bundle;

import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.material.appbar.CollapsingToolbarLayout;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.navigation.NavigationView;
import com.google.android.material.snackbar.Snackbar;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;
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
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.example.theophilos.citizenprotectionproject.MainActivity.getUnsafeOkHttpClient;

public class ScrollingActivity extends AppCompatActivity implements
        NavigationView.OnNavigationItemSelectedListener,
        OnMapReadyCallback {

    private DrawerLayout drawer;
    private MapView mapView;
    private ArrayList<String> Comments = new ArrayList<>();
    private ArrayList<String> Dates = new ArrayList<>();
    private ArrayList<String> Times = new ArrayList<>();

    public Retrofit retrofit = new Retrofit.Builder()
            .baseUrl("https://10.0.2.2:9000")
            .addConverterFactory(GsonConverterFactory.create())
            .client(getUnsafeOkHttpClient().build())
            .build();

    private static final String MAPVIEW_BUNDLE_KEY = "MapViewBundleKey";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scrolling);

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
        SharedPreferences preferences = ScrollingActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
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


                List<Comment> comms = inc.getComments();
                for ( Comment c : comms ){
                    Comments.add(c.getText());
                    String time = new SimpleDateFormat("HH:mm").format(c.getDate());
                    Times.add(time);
                    String date = new SimpleDateFormat("dd-MM-yyyy").format(c.getDate());
                    Dates.add(date);
                }




            }
            @Override
            public void onFailure(Call<Incident> call, Throwable t) {
            }
        });

        initRecyclerView();


    }



    private void initGoogleMap(Bundle savedInstanceState) {
        Bundle mapViewBundle = null;
        if (savedInstanceState != null) {
            mapViewBundle = savedInstanceState.getBundle(MAPVIEW_BUNDLE_KEY);
        }
        mapView = (MapView) findViewById(R.id.mapview);
        mapView.onCreate(mapViewBundle);

        mapView.getMapAsync(this);
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item ){

        switch (item.getItemId()){
            case R.id.nav_logout:
                SharedPreferences preferences = ScrollingActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
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


                Intent intent = new Intent(getApplicationContext(),MainActivity.class);
                startActivity(intent);
                break;

            case R.id.nav_account:
                intent = new Intent(getApplicationContext(), UserInfoActivity.class);
                startActivity(intent);
                break;
            case R.id.nav_accepted:
                intent = new Intent(getApplicationContext(), IncidentsActivity.class);
                startActivity(intent);
                break;
            case R.id.nav_history:
                intent = new Intent(getApplicationContext(), IncidentHistory.class);
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
    public void onMapReady(GoogleMap googleMap) {
        SharedPreferences preferences = ScrollingActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
        String lat = preferences.getString("LAT", null);
        String lon = preferences.getString("LON", null);
        double d1 = Double.parseDouble(lat);


        CameraUpdate center = CameraUpdateFactory.newLatLng(new LatLng(d1,23.7032915));
        CameraUpdate zoom=CameraUpdateFactory.zoomTo(10);
        googleMap.moveCamera(center);
        googleMap.animateCamera(zoom);

        googleMap.addMarker(new MarkerOptions().position(new LatLng(d1,23.7032915)).title("Marker"));
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        googleMap.setMyLocationEnabled(true);
    }


    private void initRecyclerView(){

        RecyclerView recyclerView = findViewById(R.id.commentRecyclerView);
        CommentRecyclerViewAdapter adapter = new CommentRecyclerViewAdapter(Comments,Dates,Times,this);
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
    }

}