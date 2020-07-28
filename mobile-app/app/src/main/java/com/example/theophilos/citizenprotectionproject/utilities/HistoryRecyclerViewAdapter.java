package com.example.theophilos.citizenprotectionproject.utilities;

import android.content.Context;
import android.content.Intent;

import androidx.recyclerview.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.example.theophilos.citizenprotectionproject.activities.IncidentHistoryPreviewActivity;
import com.example.theophilos.citizenprotectionproject.R;

import java.util.ArrayList;

/**
 * Created by theophilos on 17/7/20.
 */

public class HistoryRecyclerViewAdapter extends RecyclerView.Adapter<HistoryRecyclerViewAdapter.ViewHolder>{
    private static final String TAG = "RecyclerViewAdapter";

    private ArrayList<String> incidentNames = new ArrayList<>();
    private ArrayList<String> incidentPriorities = new ArrayList<>();
    private ArrayList<String> incidentIds = new ArrayList<>();
    private Context context;


    public HistoryRecyclerViewAdapter(ArrayList<String> iNames , ArrayList<String> iPriorities, ArrayList<String> iIds , Context cont ){
        incidentNames = iNames;
        incidentPriorities = iPriorities;
        incidentIds = iIds;
        context = cont;
    }



    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent , int viewType ){
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.listitem_layout,parent,false);
        ViewHolder holder = new ViewHolder(view);
        return holder;
    }

    @Override
    public void onBindViewHolder( ViewHolder holder, final int position ) {
        Log.d(TAG,"onBindViewGolder : called.");
        holder.incidentName.setText(incidentNames.get(position));
        String p = incidentPriorities.get(position);

        if ( p .equals("Υψηλή") ){
            holder.image.setImageResource(R.drawable.high);
        }
        else if ( p.equals("Μέτρια") ){
            holder.image.setImageResource(R.drawable.medium);
        }
        else if (p.equals("Χαμηλή") ){
            holder.image.setImageResource(R.drawable.low);
        }
        holder.parentLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                final Intent intent = new Intent(context, IncidentHistoryPreviewActivity.class);
                intent.putExtra("id",incidentIds.get(position));
                intent.putExtra("title",incidentNames.get(position));
                context.startActivity(intent);
            }
        });
    }

    @Override
    public int getItemCount() {
        return incidentNames.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{

        ImageView image;
        TextView incidentName;
        RelativeLayout parentLayout;

        public ViewHolder(View itemView) {
            super(itemView);
            image = itemView.findViewById(R.id.image);
            incidentName = itemView.findViewById(R.id.incidentName);
            parentLayout = itemView.findViewById(R.id.parent_layout);
        }
    }
}
