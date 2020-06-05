package com.example.theophilos.citizenprotectionproject;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;

/**
 * Created by theophilos on 4/6/20.
 */

public interface JsonApi {

    @GET("control-center/api/health-check")
    Call<HealthCheck> getHealthCheck();

    @POST("control-center/api/login")
    Call<UserInfo> login(@Body UserInfo userinfo);

}
