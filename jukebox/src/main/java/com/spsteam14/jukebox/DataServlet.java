package com.spsteam14.jukebox;

import com.google.appengine.api.utils.SystemProperty;

import java.io.IOException;
import java.util.Properties;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.cloud.firestore.FirestoreException;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.cloud.firestore.WriteResult;
import com.google.api.core.ApiFuture;
import com.google.gson.Gson;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.CollectionReference;
import java.lang.Math;
import java.util.*;
import com.google.cloud.firestore.EventListener;
import javax.annotation.Nullable;

/** Ignore this servlet for now; backend will change from Java to another language eventually*/
@WebServlet(value = "/data")
public class DataServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws IOException {
          
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    }
}
