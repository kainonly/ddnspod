import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BitCurdCommonService, BitHttpService } from 'ngx-bit';

@Injectable()
export class PageService {
  private model = 'page';

  constructor(
    private http: BitHttpService,
    private curd: BitCurdCommonService
  ) {
  }

  get(key: any): Observable<any> {
    return this.curd.get(this.model, [
      { field: 'key', op: '=', value: key }
    ]);
  }

  update(data: any): Observable<any> {
    return this.http.req(this.model + '/update', data);
  }
}
