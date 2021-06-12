import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BitCurdCommonService, ListByPage } from 'ngx-bit';

@Injectable()
export class TemplateService {
  private model: string;

  constructor(
    private curd: BitCurdCommonService
  ) {
  }

  setModel(value: string): void {
    this.model = value;
  }

  originLists(): Observable<any> {
    return this.curd.originLists(this.model);
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

  assoc(model: string): Observable<any> {
    return this.curd.originLists(model);
  }
}
