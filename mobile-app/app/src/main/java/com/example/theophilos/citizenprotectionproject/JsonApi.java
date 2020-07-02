package com.example.theophilos.citizenprotectionproject;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Path;

/**
 * Created by theophilos on 4/6/20.
 */

public interface JsonApi {

    @GET("control-center/api/health-check")
    Call<HealthCheck> getHealthCheck();

    @POST("control-center/api/login")
    Call<SessionInfo> login(@Body UserInfo userinfo);

    @GET("control-center/api/admin/users/accepted/{id}")
    Call<Incident> getAcceptedIncidents(@Header("Authorization") String token , @Path("id") String user_id );

    @GET("control-center/api/incidents/")
    Call<List<Incident>> getAllIncidents(@Header("Authorization") String token );

}
