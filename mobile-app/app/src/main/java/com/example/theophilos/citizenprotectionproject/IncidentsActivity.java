
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

    private TextView textviewResult;

    public Retrofit retrofit = new Retrofit.Builder()
            .baseUrl("https://10.0.2.2:9000")
            .addConverterFactory(GsonConverterFactory.create())
            .client( getUnsafeOkHttpClient().build())
            .build();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_incidents);

        textviewResult = findViewById(R.id.textView);

        //Retrieve token wherever necessary
        SharedPreferences preferences = IncidentsActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
        String usrId  = preferences.getString("ID",null);
        String token  = preferences.getString("TOKEN",null);


        JsonApi jsonApi = retrofit.create(JsonApi.class);
        Call<AcceptedIncidents> call = jsonApi.getAcceptedIncidents( "Bearer "+token , usrId );


        call.enqueue(new Callback<AcceptedIncidents>() {
            @Override
            public void onResponse(Call<AcceptedIncidents> call, Response<AcceptedIncidents> response) {
                if(!response.isSuccessful()) {
                    textviewResult.setText("Code: " + response.code());
                    return;
                }

                AcceptedIncidents incidents = response.body();

                if ( incidents == null ){
                    textviewResult.setText("NULL");
                }

                Incident inc = incidents.getAcceptedIncidents();
                textviewResult.setText(inc.getTitle());

                Toast toast = Toast.makeText(getApplicationContext(), "SUCCESS", Toast.LENGTH_SHORT);
                toast.show();

            }

            @Override
            public void onFailure(Call<AcceptedIncidents> call, Throwable t) {
                textviewResult.setText(t.getMessage());
            }
        });

    }
}

