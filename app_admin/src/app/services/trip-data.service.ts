import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/authresponse';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root'
})

export class TripDataService {

  constructor(private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage) { }

  url = 'http://localhost:3000/api/trips';
  apiBaseUrl = 'http://localhost:3000/api';

  getTrips() : Observable<Trip[]> {
    // console.log('Inside TripDataService::getTrips');
    return this.http.get<Trip[]>(this.url);
  }

  addTrip(formData: Trip) : Observable<Trip> {
    // console.log('Inside TripDataService::addTrip');
    const token = this.storage.getItem('travlr-token');
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.post<Trip>(this.url, formData, { headers });
  }

  getTrip(tripCode: string) : Observable<Trip[]> {
    // console.log('Inside TripDataService::getTrip');
    return this.http.get<Trip[]>(this.url + '/' + tripCode);
  }

  updateTrip(formData: Trip) : Observable<Trip> {
    // console.log('Inside TripDataService::updateTrip');
    const token = this.storage.getItem('travlr-token');
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.put<Trip>(`${this.url}/${formData.code}`, formData, { headers });
  }

// added delete button to complete CRUD
public deleteTrip(tripCode: string): Observable<any> {
    // console.log('Inside TripDataService::deleteTrip');
    const token = this.storage.getItem('travlr-token');
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.delete(`${this.url}/${tripCode}`, { headers });
  }

  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }

  public login(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user);
  }
   
  public register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user);
  }
    
  private makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return firstValueFrom(
      this.http.post<AuthResponse>(url, user)
    ).catch(this.handleError);
  }
}
