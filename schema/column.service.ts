import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BitHttpService } from 'ngx-bit';

@Injectable()
export class ColumnService {
  protected model = 'column';

  constructor(
    protected http: BitHttpService
  ) {
  }

  get(schema: any, column: any): Observable<any> {
    return this.http.get(this.model, [
      { field: 'schema', op: '=', value: schema },
      { field: 'column', op: '=', value: column }
    ]);
  }

  originLists(schema: any): Observable<any> {
    return this.http.originLists(this.model, [{ field: 'schema', op: '=', value: schema }]);
  }

  status(data: any): Observable<any> {
    return this.http.status(this.model, data);
  }

  update(schema: any, columns: any[]): Observable<any> {
    return this.http.req(this.model + '/update', {
      schema,
      columns
    });
  }
}
