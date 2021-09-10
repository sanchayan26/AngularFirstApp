import { Injectable, resolveForwardRef } from '@angular/core';

import {Leader} from '../shared/leader';

import { of,Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';


@Injectable({
  providedIn: 'root'
})
export class LeadersService {

  constructor( private processHTTPMsgService: ProcessHTTPMsgService,private http: HttpClient) { }

  getLeaders(): Observable<Leader[]> {
    // return of(LEADERS).pipe(delay(2000));
    return this.http.get<Leader[]>(baseURL + 'leadership')
      .pipe(catchError(this.processHTTPMsgService.handleError));

  }
  getLeader(id: string): Observable<Leader> {
    // return of(LEADERS.filter((leader) => (leader.id === id))[0]).pipe(delay(2000));
    return this.http.get<Leader>(baseURL + 'leadership/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));


  }

  getFeaturedLeader(): Observable<Leader> {
    // return of(LEADERS.filter((Leader) => Leader.featured)[0]).pipe(delay(2000));
    return this.http.get<Leader[]>(baseURL + 'leadership?featured=true').pipe(map(leaders => leaders[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
