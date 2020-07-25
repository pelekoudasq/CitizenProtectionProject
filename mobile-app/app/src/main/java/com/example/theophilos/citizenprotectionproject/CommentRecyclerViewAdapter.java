package com.example.theophilos.citizenprotectionproject;

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

import java.util.ArrayList;


public class CommentRecyclerViewAdapter extends RecyclerView.Adapter<CommentRecyclerViewAdapter.ViewHolder> {
    private static final String TAG = "CommentRecyclerViewAdapter";

    private ArrayList<String> Comments = new ArrayList<>();
    private ArrayList<String> Dates = new ArrayList<>();
    private ArrayList<String> Times = new ArrayList<>();
    private Context context;


    public CommentRecyclerViewAdapter(ArrayList<String> comments , ArrayList<String> dates, ArrayList<String> times , Context cont ){
        Comments = comments;
        Dates = dates;
        Times = times;
        context = cont;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.comment_listitem_layout,parent,false);
        CommentRecyclerViewAdapter.ViewHolder holder = new CommentRecyclerViewAdapter.ViewHolder(view);
        return holder;
    }


    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        holder.commentView.setText(Comments.get(position));
        holder.timeView.setText(Times.get(position));
        holder.dateView.setText(Dates.get(position));
    }


    @Override
    public int getItemCount() {
        return Comments.size();
    }


    public class ViewHolder extends RecyclerView.ViewHolder{

        TextView commentView;
        TextView timeView;
        TextView dateView;
        RelativeLayout parentLayout;

        public ViewHolder(View itemView) {
            super(itemView);
            commentView  = itemView.findViewById(R.id.commentText);
            timeView  = itemView.findViewById(R.id.time);
            dateView  = itemView.findViewById(R.id.date);
            parentLayout = itemView.findViewById(R.id.comment_parent_layout);
        }
    }

}
