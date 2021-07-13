import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BitService } from 'ngx-bit';
import { ColumnService } from '@vanx/cms/schema';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { BitSwalService } from 'ngx-bit/swal';
import { TemplateService } from '../template.service';
import { PageService } from '../page.service';
import * as packer from './language';

@Component({
  selector: 'v-template-page',
  templateUrl: './template-page.component.html'
})
export class TemplatePageComponent implements OnInit {
  protected key!: string;
  protected id!: string;
  back!: boolean;

  columns!: any[];
  protected columnMap = new Map();
  form!: FormGroup;

  assoc: {
    [column: string]: any;
  } = {};

  constructor(
    public bit: BitService,
    protected swal: BitSwalService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService,
    private drawer: NzDrawerService,
    private notification: NzNotificationService,
    private route: ActivatedRoute,
    private columnService: ColumnService,
    private pageService: PageService,
    protected templateService: TemplateService
  ) {}

  ngOnInit(): void {
    this.bit.registerLocales(packer);
    this.route.params
      .pipe(
        switchMap(params => {
          this.key = params.key;
          if (params.hasOwnProperty('id')) {
            this.id = params.id;
          }
          const table = this.key.replace('-', '_');
          this.templateService.setModel(table);
          return this.columnService.originLists(table);
        })
      )
      .subscribe(data => {
        const controls: any = {};
        this.columns = data
          .filter((v: any) => v.datatype !== 'system')
          .map((v: any) => {
            v.name = JSON.parse(v.name);
            v.extra = JSON.parse(v.extra);
            switch (v.datatype) {
              case 'i18n':
                controls[v.column] = this.addI18nGroup(v);
                break;
              case 'richtext':
                controls[v.column] = this.addI18nGroup(v);
                break;
              default:
                if (v.datatype === 'assoc') {
                  this.getAssoc(v.schema, v.column, v.extra.assoc);
                }
                controls[v.column] = [v.extra.default];
                if (v.extra.required) {
                  controls[v.column][1] = [Validators.required];
                }
            }
            this.columnMap.set(v.column, v);
            return v;
          });
        this.form = this.fb.group(controls);
        this.getData();
      });
  }

  /**
   * 获取数据
   */
  protected getData(): void {
    this.pageService.get(this.key).subscribe(data => {
      if (data) {
        let values = {
          title: JSON.parse(data.title),
          content: JSON.parse(data.content)
        };
        const extra = JSON.parse(data.extra);
        this.columns.forEach(v => {
          if (['date', 'datetime'].includes(v.datatype)) {
            extra[v.column] = new Date(extra[v.column] * 1000);
          }
        });
        values = Object.assign(values, extra);
        this.form.patchValue(values);
      }
    });
  }

  /**
   * 新增多语言输入
   */
  private addI18nGroup(data: any): FormGroup {
    const options: any = {
      value: {},
      validate: {}
    };
    options.value[this.bit.i18n] = data.extra.default;
    if (data.extra.required) {
      options.validate[this.bit.i18n] = [Validators.required];
    }
    return this.fb.group(this.bit.i18nGroup(options));
  }

  /**
   * 设置关联
   */
  private getAssoc(schema: string, column: string, assoc: string): void {
    const value: Record<string, any> = {};
    this.templateService
      .assoc(assoc)
      .pipe(
        switchMap(data => {
          value['items'] = data;
          return this.columnService.get(schema, column);
        })
      )
      .subscribe(data => {
        value['datatype'] = data.datatype;
        this.assoc[column] = value;
      });
  }

  /**
   * 提交
   */
  submit(data: any): void {
    Reflect.set(data, 'key', this.key);
    if (!data.hasOwnProperty('title')) {
      data.title = {};
    }
    if (!data.hasOwnProperty('content')) {
      data.content = {};
    }
    this.pageService.update(data).subscribe(res => {
      if (!res.error) {
        this.message.success(this.bit.l.updateSuccess);
        this.getData();
      } else {
        this.message.error(this.bit.l.updateError);
      }
    });
  }
}
