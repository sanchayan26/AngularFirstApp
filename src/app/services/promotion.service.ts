import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';

import { of, Observable } from 'rxjs';
import {catchError, delay} from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';



@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  // constructor() { }
  constructor(private http: HttpClient ,
              private processHTTPMsgService: ProcessHTTPMsgService) { }


  getPromotions(): Observable<Promotion[]> {
    return  this.http.get<Promotion[]>(baseURL +'promotions')
      .pipe(catchError(this.processHTTPMsgService.handleError));
    // return of(PROMOTIONS).pipe(delay(2000));

  }

  getPromotion(id: string):Observable<Promotion> {
    return this.http.get<Promotion>(baseURL + 'promotions/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));

    // return of(PROMOTIONS.filter((promo) => (promo.id === id))[0]).pipe(delay(2000));

  }

  getFeaturedPromotion():Observable<Promotion>{
    // return of(PROMOTIONS.filter((promotion) => promotion.featured)[0]).pipe(delay(2000));
    return this.http.get<Promotion[]>(baseURL + 'promotions?featured=true')
      .pipe(map(promotions => promotions[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));


  }
}
