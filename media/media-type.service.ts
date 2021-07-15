import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Api, BitService } from 'ngx-bit';

@Injectable()
export class MediaTypeService {
  api!: Api;

  constructor(private bit: BitService) {}

  setModel(value: string): void {
    this.api = this.bit.api(`${value}_type`);
  }

  sort(data: any[]): Observable<any> {
    return this.api.send(`sort`, {
      data
    });
  }
}
