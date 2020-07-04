
package com.example.theophilos.citizenprotectionproject;

import android.content.Context;
import android.content.SharedPreferences;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.view.MenuInflater;
import android.widget.Button;
import android.widget.LinearLayout;
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

                List<Incident> incList = acceptedIncidents.getIncidents();
                if ( incList.size() == 0 ){

                    //Create text view
                    LinearLayout.LayoutParams textViewParams = new LinearLayout.LayoutParams(Toolbar.LayoutParams.WRAP_CONTENT, Toolbar.LayoutParams.WRAP_CONTENT);
                    TextView tv=new TextView(getApplicationContext());
                    tv.setLayoutParams(textViewParams);
                    tv.setText("Κανένα Τρέχων Συμβάν");
                    //Create Reload Button
                    LinearLayout mainLayout = (LinearLayout)findViewById(R.id.buttonlayout);
                    LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                    Button addButton =new Button(getApplicationContext());
                    addButton.setText("Επαναφόρτωση");
                    //add textview and compnent to layout
                    mainLayout.addView(tv, textViewParams);
                    mainLayout.addView(addButton, lp);

                }
                else{
                    String content = "";
                    for (Incident inc : acceptedIncidents.getIncidents()){
                        content += inc.getTitle() + " \n";
                    }
                    textviewResult.setText(content);
                }


            }

            @Override
            public void onFailure(Call<Incidents> call, Throwable t) {
                textviewResult.setText(t.getMessage());
            }
        });

    }
}

