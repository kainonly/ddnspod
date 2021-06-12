import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BitCurdCommonService, BitHttpService } from 'ngx-bit';

@Injectable()
export class ColumnService {
  private model = 'column';

  constructor(
    private http: BitHttpService,
    private curd: BitCurdCommonService
  ) {
  }

  get(schema: any, column: any): Observable<any> {
    return this.curd.get(this.model, [
      { field: 'schema', op: '=', value: schema },
      { field: 'column', op: '=', value: column }
    ]);
  }

  originLists(schema: any): Observable<any> {
    return this.curd.originLists(this.model, [{ field: 'schema', op: '=', value: schema }]);
  }

  status(data: any): Observable<any> {
    return this.curd.status(this.model, data);
  }

  update(schema: any, columns: any[]): Observable<any> {
    return this.http.req(this.model + '/update', {
      schema,
      columns
    });
  }
}
