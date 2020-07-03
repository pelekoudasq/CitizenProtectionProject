
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
        Call<Incidents> call = jsonApi.getAcceptedIncidents( "Bearer "+token , usrId );


        call.enqueue(new Callback<Incidents>() {
            @Override
            public void onResponse(Call<Incidents> call, Response<Incidents> response) {
                if(!response.isSuccessful()) {
                    textviewResult.setText("Code: " + response.code());
                    return;
                }

                Incidents acceptedIncidents = response.body();

                if ( acceptedIncidents == null ){
                    textviewResult.setText("NULL");
                }

                String content = "";
                for (Incident inc : acceptedIncidents.getIncidents()){
                    content += inc.getTitle() + " \n";
                }
                textviewResult.setText(content);

            }

            @Override
            public void onFailure(Call<Incidents> call, Throwable t) {
                textviewResult.setText(t.getMessage());
            }
        });

    }
}

