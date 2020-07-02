
package com.example.theophilos.citizenprotectionproject;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;

import java.security.cert.CertificateException;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import okhttp3.OkHttpClient;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MainActivity extends AppCompatActivity {

    private TextView textViewResult;

    public GsonConverterFactory gsonFactory = GsonConverterFactory.create();

    public OkHttpClient client = getUnsafeOkHttpClient().build();

    public Retrofit retrofit = new Retrofit.Builder()
            .baseUrl("https://10.0.2.2:9000")
            .addConverterFactory(gsonFactory)
            .client(client)
            .build();



    public void login( View view ){
        final Intent intent = new Intent(getApplicationContext(),IncidentsActivity.class);

        EditText userText = (EditText) findViewById(R.id.userNameTextField);
        EditText passText = (EditText) findViewById(R.id.passwordTextField);
        UserInfo userInfo = new UserInfo(userText.getText().toString(),passText.getText().toString());

        Toast.makeText(this, userText.getText().toString(), Toast.LENGTH_SHORT).show();



        JsonApi jsonApi = retrofit.create(JsonApi.class);
        Call<UserInfo> call = jsonApi.login(userInfo);

        call.enqueue(new Callback<UserInfo>() {
            @Override
            public void onResponse(Call<UserInfo> call, Response<UserInfo> response) {
                if(!response.isSuccessful()) {
                    textViewResult.setText("Code: " + response.code());
                    return;
                }

                //Save token here
                UserInfo uInfo = response.body();
                SharedPreferences preferences = MainActivity.this.getSharedPreferences("MY_APP", Context.MODE_PRIVATE);
                preferences.edit().putString("TOKEN",uInfo.getToken()).apply();


                startActivity(intent);

            }

            @Override
            public void onFailure(Call<UserInfo> call, Throwable t) {
                textViewResult.setText(t.getMessage());
            }
        });
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        textViewResult = findViewById(R.id.text_view_result);

        JsonApi jsonApi = retrofit.create(JsonApi.class);

        Call<HealthCheck> call = jsonApi.getHealthCheck();

        call.enqueue(new Callback<HealthCheck>() {
            @Override
            public void onResponse(Call<HealthCheck> call, Response<HealthCheck> response) {
                if(!response.isSuccessful()) {
                    textViewResult.setText("Code: "+ response.code());
                    return;
                }

                HealthCheck check = response.body();

//                textViewResult.setText(check.getStatus());


            }

            @Override
            public void onFailure(Call<HealthCheck> call, Throwable t) {
                textViewResult.setText(t.getMessage());
            }
        });
    }


    public static OkHttpClient.Builder getUnsafeOkHttpClient() {

        try {
            // Create a trust manager that does not validate certificate chains
            final TrustManager[] trustAllCerts;
            trustAllCerts = new TrustManager[]{
                    new X509TrustManager() {
                        @Override
                        public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType) throws CertificateException {
                        }

                        @Override
                        public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType) throws CertificateException {
                        }

                        @Override
                        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                            return new java.security.cert.X509Certificate[]{};
                        }
                    }
            };

            // Install the all-trusting trust manager
            final SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

            // Create an ssl socket factory with our all-trusting manager
            final SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();

            OkHttpClient.Builder builder = new OkHttpClient.Builder();
            builder.sslSocketFactory(sslSocketFactory, (X509TrustManager) trustAllCerts[0]);
            builder.hostnameVerifier(new HostnameVerifier() {
                private String hostname;
                private SSLSession session;

                @Override
                public boolean verify(String hostname, SSLSession session) {
                    this.hostname = hostname;
                    this.session = session;
                    return true;
                }
            });
            return builder;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}


