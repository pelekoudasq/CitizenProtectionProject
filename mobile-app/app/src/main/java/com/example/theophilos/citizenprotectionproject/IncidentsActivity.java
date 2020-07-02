
package com.example.theophilos.citizenprotectionproject;

import android.content.Context;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import static com.example.theophilos.citizenprotectionproject.MainActivity.getUnsafeOkHttpClient;

public class IncidentsActivity extends AppCompatActivity {

    public Retrofit retrofit = new Retrofit.Builder()
            .baseUrl("https://10.0.2.2:9000")
            .addConverterFactory(GsonConverterFactory.create())
            .client( getUnsafeOkHttpClient().build())
            .build();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_incidents);


        //Retrieve token wherever necessary
        SharedPreferences preferences = IncidentsActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
        String usrId  = preferences.getString("ID",null);
        String token  = preferences.getString("TOKEN",null);

        Toast toast = Toast.makeText(getApplicationContext(), usrId, Toast.LENGTH_SHORT);
        toast.show();

        JsonApi jsonApi = retrofit.create(JsonApi.class);
        Call<Incident> call = jsonApi.getAcceptedIncidents( "Bearer "+token , usrId );


        call.enqueue(new Callback<Incident>() {
            @Override
            public void onResponse(Call<Incident> call, Response<Incident> response) {
                if(!response.isSuccessful()) {
                    Toast toast = Toast.makeText(getApplicationContext(), "FAILURE1", Toast.LENGTH_SHORT);
                    toast.show();
                    return;
                }

                Toast toast = Toast.makeText(getApplicationContext(), "SUCCESS", Toast.LENGTH_SHORT);
                toast.show();

            }

            @Override
            public void onFailure(Call<Incident> call, Throwable t) {
                Toast toast = Toast.makeText(getApplicationContext(), t.getMessage() , Toast.LENGTH_SHORT);
                toast.show();
                toast = Toast.makeText(getApplicationContext(), "fail2", Toast.LENGTH_SHORT);
                toast.show();
            }
        });

//        Call<List<Incident>> call = jsonApi.getAllIncidents( "Bearer "+token  );
//
//        call.enqueue(new Callback<List<Incident>>() {
//            @Override
//            public void onResponse(Call<List<Incident>> call, Response<List<Incident>> response) {
//                if(!response.isSuccessful()) {
//                    Toast toast = Toast.makeText(getApplicationContext(), "FAILURE1", Toast.LENGTH_SHORT);
//                    toast.show();
//                    return;
//                }
//
//                Toast toast = Toast.makeText(getApplicationContext(), "SUCCESS", Toast.LENGTH_SHORT);
//                toast.show();
//
//            }
//
//            @Override
//            public void onFailure(Call<List<Incident>> call, Throwable t) {
//                Toast toast = Toast.makeText(getApplicationContext(), t.getMessage() , Toast.LENGTH_SHORT);
//                toast.show();
//                toast = Toast.makeText(getApplicationContext(), "fail2", Toast.LENGTH_SHORT);
//                toast.show();
//            }
//        });

    }
}

