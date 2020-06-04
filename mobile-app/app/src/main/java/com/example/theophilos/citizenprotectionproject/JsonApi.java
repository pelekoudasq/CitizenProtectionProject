package com.example.theophilos.citizenprotectionproject;

import retrofit2.Call;
import retrofit2.http.GET;

/**
 * Created by theophilos on 4/6/20.
 */

public interface JsonApi {

    @GET("control-center/api/health-check")
    Call<HealthCheck> getHealthCheck();
}
