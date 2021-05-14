import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BitHttpService } from 'ngx-bit';

@Injectable()
export class PageService {
  private model = 'page';

  constructor(
    private http: BitHttpService
  ) {
  }

  get(key: any): Observable<any> {
    return this.http.get(this.model, [
      { field: 'key', op: '=', value: key }
    ]);
  }

  update(data: any): Observable<any> {
    return this.http.req(this.model + '/update', data);
  }
}
