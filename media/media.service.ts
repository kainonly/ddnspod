import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Api, BitConfig, BitService, UploadOption } from 'ngx-bit';

@Injectable()
export class MediaService {
  api!: Api;

  constructor(private bit: BitService, private config: BitConfig) {}

  setModel(value: string): void {
    this.api = this.bit.api(value);
  }

  bulkAdd(data: any): Observable<any> {
    return this.api.send(`bulkAdd`, data);
  }

  bulkEdit(data: any): Observable<any> {
    return this.api.send(`bulkEdit`, data);
  }

  count(): Observable<any> {
    return this.api.send(`count`).pipe(map((v: any) => (!v.error ? v.data : null)));
  }

  thumb(path: string, withStatic = true): string {
    let thumbOption = '';
    const option = this.config.upload as UploadOption;
    switch (option.storage) {
      case 'oss':
        thumbOption = '?x-oss-process=image/auto-orient,1/resize,m_lfit,w_200,limit_0/quality,q_80/format,webp';
        break;
      case 'cos':
        thumbOption = '?imageMogr2/thumbnail/200x/format/webp/interlace/1/quality/80';
        break;
    }
    let url = path + thumbOption;
    if (withStatic) {
      url = this.bit.assets + url;
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
