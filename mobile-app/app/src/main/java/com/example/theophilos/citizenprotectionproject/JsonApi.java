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
    Call<Incidents> getAcceptedIncidents(@Header("Authorization") String token , @Path("id") String user_id );

    @POST("control-center/api/logout")
    Call<Void> logout(@Header("Authorization") String token);

    @GET("control-center/api/incidents/{id}")
    Call<Incident> getIncident(@Header("Authorization") String token , @Path("id") String inc_id);

}
