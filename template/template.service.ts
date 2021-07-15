import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Api, BitService } from 'ngx-bit';

@Injectable()
export class TemplateService {
  api!: Api;

  constructor(private bit: BitService) {}

  setModel(name: string): void {
    this.api = this.bit.api(name);
  }

  assoc(): Observable<any> {
    return this.api.originLists();
  }
}
