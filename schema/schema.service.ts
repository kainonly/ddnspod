import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BitCurdCommonService, BitHttpService, ListByPage } from 'ngx-bit';

@Injectable()
export class SchemaService {
  protected model = 'schema';

  constructor(
    private http: BitHttpService,
    private curd: BitCurdCommonService
  ) {
  }

  originLists(type: any): Observable<any> {
    return this.curd.originLists(this.model, [{ field: 'type', op: '=', value: type }]);
  }

  lists(factory: ListByPage, refresh: boolean, persistence: boolean): Observable<any> {
    return this.curd.lists(this.model, factory, {
      refresh,
      persistence
    });
  }

  add(data: any): Observable<any> {
    return this.curd.add(this.model, data);
  }

  get(id: any): Observable<any> {
    return this.curd.get(this.model, id);
  }

  edit(data: any): Observable<any> {
    return this.curd.edit(this.model, data);
  }

  delete(id: any[]): Observable<any> {
    return this.curd.delete(this.model, id);
  }

  status(data: any): Observable<any> {
    return this.curd.status(this.model, data);
  }

  publish(table: any, remark: string): Observable<any> {
    return this.http.req(this.model + '/publish', {
      table,
      remark
    });
  }

  history(table: any): Observable<any> {
    return this.http.req(this.model + '/history', { table }).pipe(
      map(res => !res.error ? res.data : null)
    );
  }

  table(table: any): Observable<any> {
    return this.http.req(this.model + '/table', { table }).pipe(
      map(res => !res.error ? res.data : null)
    );
  }

  validedTable(table: string, edit: Observable<string> = of(null)): Observable<any> {
    return edit.pipe(
      switchMap(editKey => {
        if (table !== editKey) {
          return this.http.req(this.model + '/validedTable', {
            table
          });
        }
        return of({
          error: 0,
          data: {
            exists: false
          }
        });
      }),
      map(res => {
        if (res.error === 1) {
          return false;
        }
        return !res.data.exists;
      })
    );
  }
}
