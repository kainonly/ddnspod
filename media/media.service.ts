import { Injectable } from '@angular/core';
import { BitConfigService, BitHttpService, BitService } from 'ngx-bit';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MediaService {
  protected model: string;

  constructor(
    protected http: BitHttpService,
    protected bit: BitService,
    protected config: BitConfigService
  ) {
  }

  setModel(value: string): void {
    this.model = value;
  }

  lists(search: any, refresh: boolean, persistence: boolean): Observable<any> {
    return this.http.lists(this.model, search, {
      refresh,
      persistence
    });
  }

  bulkAdd(data: any): Observable<any> {
    return this.http.req(this.model + '/bulkAdd', data);
  }

  edit(data: any): Observable<any> {
    return this.http.edit(this.model, data);
  }

  bulkEdit(data: any): Observable<any> {
    return this.http.req(this.model + '/bulkEdit', data);
  }

  delete(id: any[]): Observable<any> {
    return this.http.delete(this.model, id);
  }

  count(): Observable<any> {
    return this.http.req(this.model + '/count').pipe(
      map(res => !res.error ? res.data : null)
    );
  }

  thumb(path: string, withStatic = true): string {
    let thumbOption = '';
    switch (this.config.api.uploadStorage) {
      case 'oss':
        thumbOption = '?x-oss-process=image/auto-orient,1/resize,m_lfit,w_200,limit_0/quality,q_80/format,webp';
        break;
      case 'cos':
        thumbOption = '?imageMogr2/thumbnail/200x/format/webp/interlace/1/quality/80';
        break;
    }
    let url = path + thumbOption;
    if (withStatic) {
      url = this.bit.static + url;
    }
    return url;
  }

  getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
}
