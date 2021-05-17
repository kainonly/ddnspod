import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BitHttpService, ListByPage } from 'ngx-bit';

@Injectable()
export class TemplateService {
  protected model: string;

  constructor(
    protected http: BitHttpService
  ) {
  }

  setModel(value: string): void {
    this.model = value;
  }

  originLists(): Observable<any> {
    return this.http.originLists(this.model);
  }

  lists(factory: ListByPage, refresh: boolean, persistence: boolean): Observable<any> {
    return this.http.lists(this.model, factory, {
      refresh,
      persistence
    });
  }

  add(data: any): Observable<any> {
    return this.http.add(this.model, data);
  }

  get(id: any): Observable<any> {
    return this.http.get(this.model, id);
  }

  edit(data: any): Observable<any> {
    return this.http.edit(this.model, data);
  }

  delete(id: any[]): Observable<any> {
    return this.http.delete(this.model, id);
  }

  status(data: any): Observable<any> {
    return this.http.status(this.model, data);
  }

  assoc(model: string): Observable<any> {
    return this.http.originLists(model);
  }
}
