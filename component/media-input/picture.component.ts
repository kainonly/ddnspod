import { Component, forwardRef, TemplateRef, ViewChild } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { MediaInput } from './media-input';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'van-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['media-input.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PictureComponent),
      multi: true
    }
  ]
})
export class PictureComponent extends MediaInput {
  @ViewChild('previewRef') previewRef: TemplateRef<any>;
  previewUrl: string;

  picturePreview = async (file: NzUploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await this.mediaService.getBase64(file.originFileObj);
    }
    this.previewUrl = file.url || file.preview;
    this.modal.create({
      nzContent: this.previewRef,
      nzFooter: null
    });
  };

  /**
   * 缩略图加载
   */
  thumb(path: string): string {
    return this.mediaService.thumb(path, false);
  }
}
