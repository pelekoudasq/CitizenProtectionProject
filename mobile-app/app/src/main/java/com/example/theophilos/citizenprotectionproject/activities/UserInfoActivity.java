package com.example.theophilos.citizenprotectionproject.activities;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;

import com.example.theophilos.citizenprotectionproject.JsonApi;
import com.example.theophilos.citizenprotectionproject.R;
import com.example.theophilos.citizenprotectionproject.objects.Department;
import com.example.theophilos.citizenprotectionproject.utilities.CustomMapView;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.material.navigation.NavigationView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

import static com.example.theophilos.citizenprotectionproject.activities.LoginActivity.getUnsafeOkHttpClient;

public class UserInfoActivity extends AppCompatActivity implements
        NavigationView.OnNavigationItemSelectedListener,
        OnMapReadyCallback {

    private DrawerLayout drawer;
    private CustomMapView mapView;

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
        setContentView(R.layout.user_info);


        Toolbar toolbar = findViewById(R.id.toolBar);
        setSupportActionBar(toolbar);

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
        SharedPreferences preferences = UserInfoActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
        String usrName = preferences.getString("USRNAME", null);
        String fname = preferences.getString("FNAME", null);
        String lname = preferences.getString("LNAME", null);


        View hView = navigationView.getHeaderView(0);
        TextView nav_user = (TextView) hView.findViewById(R.id.accountName);
        nav_user.setText(usrName);

        initGoogleMap(savedInstanceState);

        TextView fnameView = findViewById(R.id.fullName);
        TextView unameView = findViewById(R.id.userName);


        fnameView.setText(fname + " " + lname);
        unameView.setText(usrName);

        showDepartment();

    }


    public void showDepartment() {
        final TextView depName = findViewById(R.id.departmentName);
        SharedPreferences preferences = UserInfoActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
        String dId = preferences.getString("DEPID", null);
        String token = preferences.getString("TOKEN", null);

        JsonApi jsonApi = retrofit.create(JsonApi.class);
        Call<Department> call = jsonApi.getDepartment("Bearer " + token, dId);
        call.enqueue(new Callback<Department>() {
            @Override
            public void onResponse(Call<Department> call, Response<Department> response) {
                if (!response.isSuccessful()) {
                    return;
                }
                Department dep = response.body();
                depName.setText(dep.getName());

            }

            @Override
            public void onFailure(Call<Department> call, Throwable t) {
            }
        });


    }


    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {

        switch (item.getItemId()) {
            case R.id.nav_logout:
                SharedPreferences preferences = UserInfoActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
                String token = preferences.getString("TOKEN", null);
                JsonApi jsonApi = retrofit.create(JsonApi.class);
                SharedPreferences.Editor editor = preferences.edit();
                editor.clear();
                editor.apply();
                finish();
                Call<Void> call = jsonApi.logout("Bearer " + token);
                call.enqueue(new Callback<Void>() {
                    @Override
                    public void onResponse(Call<Void> call, Response<Void> response) {
                        if (!response.isSuccessful()) {
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

    private void initGoogleMap(Bundle savedInstanceState) {
        Bundle mapViewBundle = null;
        if (savedInstanceState != null) {
            mapViewBundle = savedInstanceState.getBundle(MAPVIEW_BUNDLE_KEY);
        }
        mapView = (CustomMapView) findViewById(R.id.infoMapView);
        mapView.onCreate(mapViewBundle);

        mapView.getMapAsync(this);
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

        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        Criteria criteria = new Criteria();

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        Location location = locationManager.getLastKnownLocation(locationManager.getBestProvider(criteria, false));
        if (location != null)
        {
            googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(location.getLatitude(), location.getLongitude()), 13));

            CameraPosition cameraPosition = new CameraPosition.Builder()
                    .target(new LatLng(location.getLatitude(), location.getLongitude()))
                    .zoom(14)
                    .bearing(90)
                    .build();
            googleMap.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
        }

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        googleMap.setMyLocationEnabled(true);
    }
}