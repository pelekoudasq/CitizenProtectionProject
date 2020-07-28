
package com.example.theophilos.citizenprotectionproject.activities;

import android.app.DatePickerDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;

import androidx.annotation.NonNull;

import com.example.theophilos.citizenprotectionproject.objects.Incidents;
import com.example.theophilos.citizenprotectionproject.JsonApi;
import com.example.theophilos.citizenprotectionproject.R;
import com.example.theophilos.citizenprotectionproject.objects.Incident;
import com.example.theophilos.citizenprotectionproject.utilities.HistoryRecyclerViewAdapter;
import com.google.android.material.navigation.NavigationView;

import androidx.annotation.RequiresApi;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;

import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.appcompat.widget.Toolbar;

import android.view.MenuItem;
import android.view.View;
import android.widget.DatePicker;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import static com.example.theophilos.citizenprotectionproject.activities.LoginActivity.getUnsafeOkHttpClient;

public class IncidentHistoryActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private ArrayList<String> incidentNames = new ArrayList<>();
    private ArrayList<String> incidentPriorities = new ArrayList<>();
    private ArrayList<String> incidentIds = new ArrayList<>();
    private DrawerLayout drawer;
    private DatePickerDialog.OnDateSetListener mDateSetListenerFrom;
    private DatePickerDialog.OnDateSetListener mDateSetListenerTill;

    public Retrofit retrofit = new Retrofit.Builder()
            .baseUrl("https://10.0.2.2:9000")
//            .baseUrl("https://83.212.76.248:9000")
            .addConverterFactory(GsonConverterFactory.create())
            .client( getUnsafeOkHttpClient().build())
            .build();

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.incident_history);

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
        SharedPreferences preferences = IncidentHistoryActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
        String usrName = preferences.getString("USRNAME",null);


        View hView =  navigationView.getHeaderView(0);
        TextView nav_user = (TextView)hView.findViewById(R.id.accountName);
        nav_user.setText(usrName);


        TextView mDispDate1 = findViewById(R.id.date1);
        TextView mDispDate2 = findViewById(R.id.date2);

        mDispDate1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Calendar cal = Calendar.getInstance();
                int year1 = cal.get(Calendar.YEAR);
                int month1 = cal.get(Calendar.MONTH);
                int day1 = cal.get(Calendar.DAY_OF_MONTH);

                DatePickerDialog dialog = new DatePickerDialog(
                        IncidentHistoryActivity.this,
                        android.R.style.Theme_Holo_Light_Dialog_MinWidth,
                        mDateSetListenerFrom,
                        year1,month1,day1);
                dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                dialog.show();
            }
        });

        mDispDate2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Calendar cal = Calendar.getInstance();
                int year2 = cal.get(Calendar.YEAR);
                int month2 = cal.get(Calendar.MONTH);
                int day2 = cal.get(Calendar.DAY_OF_MONTH);

                DatePickerDialog dialog = new DatePickerDialog(
                        IncidentHistoryActivity.this,
                        android.R.style.Theme_Holo_Light_Dialog_MinWidth,
                        mDateSetListenerTill,
                        year2,month2,day2);
                dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                dialog.show();
            }
        });

        mDateSetListenerFrom = new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker datePicker, int year1, int month1, int day1) {
                month1++;
                String date = day1+ "/" + month1 + "/" + year1;
                TextView date1 = findViewById(R.id.date1);
                date1.setText(date);
            }
        };

        mDateSetListenerTill = new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker datePicker, int year2, int month2, int day2) {
                month2++;
                String date = day2 + "/" + month2 + "/" + year2;
                TextView date2 = findViewById(R.id.date2);
                date2.setText(date);
            }
        };


        try {
            showIncidents( this.getCurrentFocus() );
        } catch (ParseException e) {
            e.printStackTrace();
        }


    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item ){

        switch (item.getItemId()){
            case R.id.nav_logout:
                SharedPreferences preferences = IncidentHistoryActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
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


    @RequiresApi(api = Build.VERSION_CODES.O)
    public void showIncidents(View view) throws ParseException {
        incidentNames.clear();
        incidentIds.clear();
        incidentPriorities.clear();


        LinearLayout buttonLayout, recyclerLayout;

        TextView dateTV1 = findViewById(R.id.date1);
        String date1String = dateTV1.getText().toString();

        TextView dateTV2 = findViewById(R.id.date2);
        String date2String = dateTV2.getText().toString();



        if ( date1String.equals("--/--/--") || date2String.equals("--/--/--") ){
            buttonLayout = findViewById(R.id.buttonLayout);
            buttonLayout.setVisibility(View.INVISIBLE);

            recyclerLayout = findViewById(R.id.recyclerLayout);
            recyclerLayout.setVisibility(View.VISIBLE);

            Toast.makeText(this, "Εισάγετε ημερομηνίες και πατήστε Αναζήτηση", Toast.LENGTH_LONG).show();
        }
        else {

            final Date Date1 =new SimpleDateFormat("dd/MM/yyyy").parse(date1String);
            final Date Date2 =new SimpleDateFormat("dd/MM/yyyy").parse(date2String);


            SharedPreferences preferences = IncidentHistoryActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
            String usrId = preferences.getString("ID", null);
            String token = preferences.getString("TOKEN", null);

            JsonApi jsonApi = retrofit.create(JsonApi.class);
            Call<Incidents> call = jsonApi.getAcceptedIncidents("Bearer " + token, usrId);


            call.enqueue(new Callback<Incidents>() {
                @Override
                public void onResponse(Call<Incidents> call, Response<Incidents> response) {
                    if (!response.isSuccessful()) {
                        return;
                    }

                    Incidents acceptedIncidents = response.body();
                    LinearLayout buttonLayout, recyclerLayout;

                    List<Incident> incList = acceptedIncidents.getIncidents();

                        buttonLayout = findViewById(R.id.buttonLayout);
                        buttonLayout.setVisibility(View.INVISIBLE);

                        recyclerLayout = findViewById(R.id.recyclerLayout);
                        recyclerLayout.setVisibility(View.VISIBLE);
                        Date incDate;
                        int c1;
                        int c2;
                        for (Incident i : incList) {
                            incDate = i.getDate();
                            final TimeZone timeZone = (TimeZone.getTimeZone("UTC"));
                            Comparator<Date> comparator = new Comparator<Date>() {
                                @Override
                                public int compare(Date date1, Date date2) {
                                    return truncateToDay(date1).compareTo(truncateToDay(date2));
                                }

                                private Date truncateToDay(Date date) {
                                    Calendar calendar = Calendar.getInstance(timeZone);
                                    calendar.setTime(date);
                                    calendar.set(Calendar.HOUR_OF_DAY, 0);
                                    calendar.set(Calendar.MINUTE, 0);
                                    calendar.set(Calendar.SECOND, 0);
                                    calendar.set(Calendar.MILLISECOND, 0);
                                    return calendar.getTime();
                                }
                            };
                            c1 = comparator.compare(incDate,Date1);
                            c2 = comparator.compare(incDate,Date2);


                            if ( i.isActive() == false && (c1 >= 0) && (c2 <= 0 ) ) {
                                incidentNames.add(i.getTitle());
                                incidentPriorities.add(i.getPriority());
                                incidentIds.add(i.getId());
                            }
                        }
                        initRecyclerView();
                    }


//                }

                @Override
                public void onFailure(Call<Incidents> call, Throwable t) {
                }
            });
        }
    }


    private void initRecyclerView(){
        RecyclerView recyclerView = findViewById(R.id.recyclerView);
        HistoryRecyclerViewAdapter adapter = new HistoryRecyclerViewAdapter(incidentNames,incidentPriorities,incidentIds,this);
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
    }


}

