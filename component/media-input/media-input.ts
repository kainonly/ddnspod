/* tslint:disable:directive-class-suffix */
import { Directive, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { MediaService, MediaComponent } from '@vanx/cms/media';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BitService } from 'ngx-bit';
import { v4 as uuidv4 } from 'uuid';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ControlValueAccessor } from '@angular/forms';
import * as packer from './language';

@Directive()
export class MediaInput implements ControlValueAccessor, OnInit {
  @Input() limit = 0;
  @Input() allowSort = false;

  fileList: NzUploadFile[] = [];

  @ViewChild('mediaTitle') mediaTitle!: TemplateRef<any>;
  mediaModal!: NzModalRef<MediaComponent, any>;

  @ViewChild('sortRef') sortRef!: TemplateRef<any>;

  protected onChange!: (value: any[]) => void;
  protected onTouched!: () => void;

  constructor(
    public bit: BitService,
    protected notification: NzNotificationService,
    protected modal: NzModalService,
    protected message: NzMessageService,
    protected viewContainerRef: ViewContainerRef,
    protected drawer: NzDrawerService,
    protected mediaService: MediaService
  ) {}

  writeValue(files: any[]): void {
    if (!files) {
      return;
    }
    this.fileList = files.map(v => {
      return {
        uid: uuidv4(),
        status: 'done',
        filename: v,
        thumbUrl: this.mediaService.thumb(v),
        url: this.bit.static + v
      } as NzUploadFile;
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    this.bit.registerLocales(packer);
  }

  updateValue(): void {
    this.onChange(this.fileList.map(v => v.filename));
  }

  /**
   * 上传监听
   */
  upload(info: NzUploadChangeParam): void {
    if (info.type === 'success') {
      Reflect.set(
        this.fileList.find(v => v.uid === info.file.uid)!,
        'filename',
        Reflect.get(info.file.originFileObj!, 'key')
      );
      this.updateValue();
      this.notification.success(this.bit.l.success, this.bit.l.uploadSuccess);
    }
    if (info.type === 'error') {
      this.notification.error(this.bit.l.notice, this.bit.l.uploadError);
    }
  }

  url = (file: NzUploadFile): string => {
    const key = Reflect.get(file.originFileObj!, 'key');
    return file.originFileObj ? this.bit.static + key : file.url!;
  };

  /**
   * 上传按钮禁用
   */
  uploadDisabled(): boolean {
    return this.limit !== 0 && this.fileList.length >= this.limit;
  }

  openMedia(type: string): void {
    this.mediaModal = this.modal.create({
      nzTitle: this.mediaTitle,
      nzWidth: 1366,
      nzCentered: true,
      nzContent: MediaComponent,
      nzComponentParams: {
        key: type
      },
      nzViewContainerRef: this.viewContainerRef,
      nzFooter: [
        {
          label: this.bit.l.selectSubmit,
          type: 'primary',
          disabled: contentComponentInstance => {
            if (!contentComponentInstance) {
              return false;
            }
            if (!contentComponentInstance.ds) {
              return true;
            }
            if (!contentComponentInstance.ds.lists) {
              return true;
            }
            return contentComponentInstance.ds.lists.getChecked().length === 0;
          },
          onClick: componentInstance => {
            if (!componentInstance) {
              return;
            }
            const files = componentInstance.ds.lists.getChecked().map(v => {
              return {
                uid: uuidv4(),
                status: 'done',
                filename: v.url,
                thumbUrl: this.mediaService.thumb(v.url),
                url: this.bit.static + v.url
              } as NzUploadFile;
            });
            const limit = this.limit;
            if (limit !== 0 && this.fileList.length + files.length > limit) {
              this.message.warning(this.bit.l.selectLimit);
              return;
            }
            this.fileList = [
              ...this.fileList,
              ...componentInstance.ds.lists.getChecked().map(v => {
                return {
                  uid: uuidv4(),
                  status: 'done',
                  filename: v.url,
                  thumbUrl: this.mediaService.thumb(v.url),
                  url: this.bit.static + v.url
                } as NzUploadFile;
              })
            ];
            this.updateValue();
            this.mediaModal.close();
          }
        }
      ]
    });
  }

  openSort(type: string): void {
    this.drawer.create({
      nzWidth: 500,
      nzTitle: this.bit.l.sort,
      nzContent: this.sortRef,
      nzMask: true
    });
  }

  /**
   * 资源排序
   */
  sort(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.fileList, event.previousIndex, event.currentIndex);
    this.fileList = [...this.fileList];
    this.updateValue();
  }
}
