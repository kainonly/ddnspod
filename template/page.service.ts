import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Api, BitService } from 'ngx-bit';

@Injectable()
export class PageService {
  api: Api;
  private model = 'page';

  constructor(private bit: BitService) {
    this.api = bit.api('page');
  }

  get(key: any): Observable<any> {
    return this.api.get([{ field: 'key', op: '=', value: key }]);
  }

  update(data: any): Observable<any> {
    return this.api.send(`update`, data);
  }
}
