import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyDVpIhMOSI47JaWqQNgAsgiBjBr_dxygEI",
  authDomain: "angulardemo-eab71.firebaseapp.com",
  projectId: "angulardemo-eab71",
  storageBucket: "angulardemo-eab71.firebasestorage.app",
  messagingSenderId: "633789000957",
  appId: "1:633789000957:web:0bcb39284f0cd478a6a294",
  measurementId: "G-7ZCXKS5M27"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
  ],
};
