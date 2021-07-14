import {
  Component,
  forwardRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Bit } from 'ngx-bit';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MediaComponent } from '@vanx/cms/media';
import { Subscription } from 'rxjs';
import * as packer from './language';

@Component({
  selector: 'v-richtext',
  templateUrl: './richtext.component.html',
  styleUrls: ['./richtext.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichtextComponent),
      multi: true
    }
  ]
})
export class RichtextComponent implements ControlValueAccessor, OnInit, OnDestroy {
  /**
   * tinymce 配置
   * https://www.tiny.cloud/docs/configure/integration-and-setup/
   */
  @Input() config: any = {};
  /**
   * 重新渲染
   */
  refresh = false;

  value!: string;
  protected onChange!: (value: any) => void;
  protected onTouched!: () => void;

  @ViewChild('mediaTitle') mediaTitle!: TemplateRef<any>;
  mediaType!: string;
  mediaModal!: NzModalRef<MediaComponent, any>;

  private localeChanged!: Subscription;

  constructor(
    public bit: Bit,
    private zone: NgZone,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    this.bit.registerLocales(packer);
    this.setTinymceLang(this.bit.locale);
    /**
     * 自定义图片素材与视频素材组件
     */
    this.config.setup = (editor: any) => {
      editor.ui.registry.addButton('NgPicture', {
        icon: 'image',
        tooltip: 'Insert Image',
        onAction: () => {
          this.zone.run(() => {
            this.openMedia(editor, 'picture');
          });
        }
      });
      editor.ui.registry.addButton('NgVideo', {
        icon: 'embed',
        tooltip: 'Insert Video',
        onAction: () => {
          this.zone.run(() => {
            this.openMedia(editor, 'video');
          });
        }
      });
    };
    this.localeChanged = this.bit.localeChanged.subscribe(() => {
      this.refresh = true;
      this.setTinymceLang(this.bit.locale);
      setTimeout(() => {
        this.refresh = false;
      });
    });
  }

  ngOnDestroy(): void {
    this.localeChanged.unsubscribe();
  }

  updateValue(): void {
    this.onChange(this.value);
  }

  /**
   * Tinymce 语言包更新
   */
  private setTinymceLang(locale: any): void {
    switch (locale) {
      case 'en_us':
        this.config.language = undefined;
        break;
      case 'zh_cn':
        this.config.language = 'zh_CN';
        break;
    }
  }

  /**
   * 显示媒体库
   */
  private openMedia(editor: any, type: string): void {
    this.mediaType = type;
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
          label: this.bit.l.insert,
          type: 'primary',
          onClick: componentInstance => {
            if (!componentInstance) {
              return;
            }
            for (const item of componentInstance.ds.lists.getChecked()) {
              switch (type) {
                case 'picture':
                  editor.insertContent(`
                    <img src="${this.bit.static + item.url}" alt="${item.name}">
                  `);
                  break;
                case 'video':
                  editor.insertContent(`
                    <video class="editor-video" src="${this.bit.static + item.url}" controls="controls"></video>
                  `);
                  break;
              }
            }
            this.mediaModal.close();
          }
        }
      ]
    });
  }
}
