package com.example.theophilos.citizenprotectionproject.activities;

import android.Manifest;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;

import com.example.theophilos.citizenprotectionproject.utilities.CommentRecyclerViewAdapter;
import com.example.theophilos.citizenprotectionproject.utilities.CustomMapView;
import com.example.theophilos.citizenprotectionproject.objects.Incident;
import com.example.theophilos.citizenprotectionproject.JsonApi;
import com.example.theophilos.citizenprotectionproject.objects.NewComment;
import com.example.theophilos.citizenprotectionproject.utilities.PolylineData;
import com.example.theophilos.citizenprotectionproject.R;
import com.example.theophilos.citizenprotectionproject.objects.Comment;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;
import com.google.android.material.navigation.NavigationView;
import com.google.maps.DirectionsApiRequest;
import com.google.maps.GeoApiContext;
import com.google.maps.PendingResult;
import com.google.maps.internal.PolylineEncoding;
import com.google.maps.model.DirectionsResult;
import com.google.maps.model.DirectionsRoute;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import android.os.Handler;
import android.os.Looper;
import android.text.InputType;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.example.theophilos.citizenprotectionproject.activities.LoginActivity.getUnsafeOkHttpClient;

public class AcceptedIncidentPreviewActivity extends AppCompatActivity implements
        NavigationView.OnNavigationItemSelectedListener,
        OnMapReadyCallback,
        GoogleMap.OnPolylineClickListener {

    private DrawerLayout drawer;
    private CustomMapView mapView;
    private ArrayList<String> Comments = new ArrayList<>();
    private ArrayList<String> Dates = new ArrayList<>();
    private ArrayList<String> Times = new ArrayList<>();
    private List<Comment> comms;
    private static final String TAG = "IncidentPreviewScrolling";
    private GeoApiContext mGeoApiContext = null;
    private ArrayList<PolylineData> mPolylineData = new ArrayList<>();
    GoogleMap map;

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
        setContentView(R.layout.accepted_incident_preview);

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
        SharedPreferences preferences = AcceptedIncidentPreviewActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
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
        final TextView dateView = findViewById(R.id.incidentDate);
        nameView.setText(title);

        String token = preferences.getString("TOKEN", null);
        JsonApi jsonApi = retrofit.create(JsonApi.class);
        Call<Incident> call = jsonApi.getIncident("Bearer " + token, myIntent.getStringExtra("id"));
        call.enqueue(new Callback<Incident>() {
            @Override
            public void onResponse(Call<Incident> call, Response<Incident> response) {
                if (!response.isSuccessful()) {
                    return;
                }
                Incident inc = response.body();
                Incident.Location loc = inc.getLocation();
                String adr;

                if (loc != null) {
                    adr = loc.getAddress();
                    addressView.setText(adr);
                }

                if (inc.getPriority().equals("Υψηλή")) {
                    nameView.setCompoundDrawablesWithIntrinsicBounds(R.drawable.high, 0, 0, 0);
                } else if (inc.getPriority().equals("Μέτρια")) {
                    nameView.setCompoundDrawablesWithIntrinsicBounds(R.drawable.medium, 0, 0, 0);
                } else if (inc.getPriority().equals("Χαμηλή")) {
                    nameView.setCompoundDrawablesWithIntrinsicBounds(R.drawable.low, 0, 0, 0);
                }

                Date date = inc.getDate();
                DateFormat dateFormat =  new SimpleDateFormat(" hh:mm:ss     dd-mm-yy");
                String dateString = dateFormat.format(date);
                dateView.setText(dateString);

                String desc = inc.getDescription();
                if (desc == null) {
                    descView.setText("Δεν έχει δοθεί ακόμα περιγραφή");
                } else {
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


    @Override
    public void onBackPressed(){
        if (drawer.isDrawerOpen(GravityCompat.START)){
            drawer.closeDrawer(GravityCompat.START);
        } else{
            Intent myIntent = getIntent();
            String flag = myIntent.getStringExtra("flag2");
            if ( flag != null && flag.equals("true") ){
                final Intent intent = new Intent(getApplicationContext(), RequestedIncidentsActivity.class);
                startActivity(intent);
            }
            else{
                this.finish();
            }
        }

    }


    public void showComments(View view) {
        SharedPreferences preferences = AcceptedIncidentPreviewActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
        Comments.clear();
        Times.clear();
        Dates.clear();
        String token = preferences.getString("TOKEN", null);
        JsonApi jsonApi = retrofit.create(JsonApi.class);
        Call<Incident> call = jsonApi.getIncident("Bearer " + token, getIntent().getStringExtra("id"));
        call.enqueue(new Callback<Incident>() {
            @Override
            public void onResponse(Call<Incident> call, Response<Incident> response) {
                if (!response.isSuccessful()) {
                    return;
                }
                Incident inc = response.body();
                List<Comment> comms = inc.getComments();
                for (Comment c : comms) {
                    Comments.add(c.getText());
                    String time = new SimpleDateFormat("HH:mm").format(c.getDate());
                    Times.add(time);
                    String date = new SimpleDateFormat("dd-MM-yyyy").format(c.getDate());
                    Dates.add(date);

                }

                reverseArrayList(Comments);
                initRecyclerView();
            }

            @Override
            public void onFailure(Call<Incident> call, Throwable t) {
            }
        });
    }


    private void initGoogleMap(Bundle savedInstanceState) {
        Bundle mapViewBundle = null;
        if (savedInstanceState != null) {
            mapViewBundle = savedInstanceState.getBundle(MAPVIEW_BUNDLE_KEY);
        }
        mapView = (CustomMapView) findViewById(R.id.mapview);
        mapView.onCreate(mapViewBundle);

        mapView.getMapAsync(this);

        if (mGeoApiContext == null) {
            mGeoApiContext = new GeoApiContext.Builder().apiKey("AIzaSyAYKnVPsLIZ95ycf9yrqUczcPNVfXFxXyY").build();
        }
    }


    @Override
    public void onPolylineClick(Polyline polyline) {
        for (PolylineData polylineData : mPolylineData) {
            if (polyline.getId().equals(polylineData.getPolyline().getId())) {
                polylineData.getPolyline().setColor(ContextCompat.getColor(this, R.color.blue));
                polylineData.getPolyline().setZIndex(1);
            } else {
                polylineData.getPolyline().setColor(ContextCompat.getColor(this, R.color.darkGrey));
                polylineData.getPolyline().setZIndex(0);
            }
        }
    }

    private void addPolylinesToMap(final DirectionsResult result) {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                mPolylineData.clear();

                for (DirectionsRoute route : result.routes) {
                    Log.d(TAG, "run: leg: " + route.legs[0].toString());
                    List<com.google.maps.model.LatLng> decodedPath = PolylineEncoding.decode(route.overviewPolyline.getEncodedPath());

                    List<LatLng> newDecodedPath = new ArrayList<>();

                    // This loops through all the LatLng coordinates of ONE polyline.
                    for (com.google.maps.model.LatLng latLng : decodedPath) {

//                        Log.d(TAG, "run: latlng: " + latLng.toString());

                        newDecodedPath.add(new LatLng(
                                latLng.lat,
                                latLng.lng
                        ));
                    }
                    Polyline polyline = map.addPolyline(new PolylineOptions().addAll(newDecodedPath));
                    polyline.setColor(ContextCompat.getColor(AcceptedIncidentPreviewActivity.this, R.color.darkGrey));
                    polyline.setClickable(true);
                    mPolylineData.add(new PolylineData(polyline, route.legs[0]));

                }
            }
        });
    }

    private void calculateDirections(Marker marker) {
        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        Criteria criteria = new Criteria();
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        Location location = locationManager.getLastKnownLocation(locationManager.getBestProvider(criteria, false));

        com.google.maps.model.LatLng destination = new com.google.maps.model.LatLng(
                marker.getPosition().latitude,
                marker.getPosition().longitude
        );
        DirectionsApiRequest directions = new DirectionsApiRequest(mGeoApiContext);

        directions.alternatives(true);
        directions.origin(
                new com.google.maps.model.LatLng(
                        location.getLatitude(),
                        location.getLongitude()
                )
        );
        Log.d(TAG, "calculateDirections: destination: " + destination.toString());
        directions.destination(destination).setCallback(new PendingResult.Callback<DirectionsResult>() {
            @Override
            public void onResult(DirectionsResult result) {
                Log.d(TAG, "calculateDirections: routes: " + result.routes[0].toString());
                Log.d(TAG, "calculateDirections: duration: " + result.routes[0].legs[0].duration);
                Log.d(TAG, "calculateDirections: distance: " + result.routes[0].legs[0].distance);
                Log.d(TAG, "calculateDirections: geocodedWayPoints: " + result.geocodedWaypoints[0].toString());

                addPolylinesToMap(result);
            }

            @Override
            public void onFailure(Throwable e) {
                Log.e(TAG, "calculateDirections: Failed to get directions: " + e.getMessage());

            }
        });
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {

        switch (item.getItemId()) {
            case R.id.nav_logout:
                SharedPreferences preferences = AcceptedIncidentPreviewActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
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
                intent = new Intent(getApplicationContext(), UserInfoActivity.class);
                startActivity(intent);
                break;
            case R.id.nav_accepted:
                drawer.closeDrawer(GravityCompat.START);
                intent = new Intent(getApplicationContext(), AcceptedIncidentsActivity.class);
                startActivity(intent);
                break;
            case R.id.nav_requested:
                drawer.closeDrawer(GravityCompat.START);
                intent = new Intent(getApplicationContext(), RequestedIncidentsActivity.class);
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

        SharedPreferences preferences = AcceptedIncidentPreviewActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);

        String token = preferences.getString("TOKEN", null);

        map = googleMap;


        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        map.setMyLocationEnabled(true);
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


                LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
                Criteria criteria = new Criteria();

                if (ActivityCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    return;
                }
                Location location = locationManager.getLastKnownLocation(locationManager.getBestProvider(criteria, false));


                CameraPosition cameraPosition = new CameraPosition.Builder()
                        .target(new LatLng(location.getLatitude(), location.getLongitude()))
                        .zoom(18)
                        .tilt(50)
                        .bearing(90)
                        .build();
                map.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));

                MarkerOptions markerOpt = new MarkerOptions().position(new LatLng(lat,lon)).title("Marker");
                Marker marker = map.addMarker(new MarkerOptions().position(new LatLng(lat,lon)).title("Hello World"));

                calculateDirections( marker );

                map.addMarker(markerOpt);
                if (ActivityCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    return;
                }

            }
            @Override
            public void onFailure(Call<Incident> call, Throwable t) {
            }
        });


        map.setOnPolylineClickListener(this);

    }


    private void initRecyclerView(){

        RecyclerView recyclerView = findViewById(R.id.commentRecyclerView);
        CommentRecyclerViewAdapter adapter = new CommentRecyclerViewAdapter(Comments,Dates,Times,this);
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

    }

    private String m_Text = "";

    public void newComment ( final View view ){

        SharedPreferences preferences = AcceptedIncidentPreviewActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
        final String token = preferences.getString("TOKEN", null);
        final String usrId = preferences.getString("ID", null);
        Intent myIntent = getIntent();
        final String incId = myIntent.getStringExtra("id");


        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Νέο Σχόλιο");
        final EditText input = new EditText(this);
        input.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_AUTO_COMPLETE);
        builder.setView(input);
        builder.setPositiveButton("Αποστολή", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                m_Text = input.getText().toString();
                NewComment comment = new NewComment( incId , m_Text , usrId );

                JsonApi jsonApi = retrofit.create(JsonApi.class);
                Call<Void> call = jsonApi.newComment("Bearer "+token,comment);
                call.enqueue(new Callback<Void>() {
                    @Override
                    public void onResponse(Call<Void> call, Response<Void> response) {
                        if (!response.isSuccessful()) {
                            return;
                        }
                        showComments(view);
                    }

                    @Override
                    public void onFailure(Call<Void> call, Throwable t) {
                    }
                });
            }
        });
        builder.setNegativeButton("Ακύρωση", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });
        builder.show();
    }


    public ArrayList<String> reverseArrayList(ArrayList<String> list)
    {
        for (int i = 0; i < list.size() / 2; i++) {
            String temp = list.get(i);
            list.set(i, list.get(list.size() - i - 1));
            list.set(list.size() - i - 1, temp);
        }
        return list;
    }


}