import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BitService } from 'ngx-bit';
import { ColumnService } from '../column.service';
import { SchemaService } from '../schema.service';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Datatype } from './datatype';
import { SchemaType } from '../schema-type';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as packer from './language';

@Component({
  selector: 'v-schema-option',
  templateUrl: './schema-option.component.html',
  styleUrls: ['./schema-option.component.scss']
})
export class SchemaOptionComponent implements OnInit {
  private id!: number;
  data: any;
  type: any = SchemaType;
  columns: any[] = [];
  datatype: any = Datatype;
  datatypes: any[] = Object.values(this.datatype);
  column = false;
  columnForm!: FormGroup;
  changed = false;
  editing = false;
  editingColumn!: string;

  terms: any[] = [];
  assoc: any[] = [];

  @ViewChild('publishTpl') publishTpl!: TemplateRef<any>;
  publishRemark!: string;

  constructor(
    public bit: BitService,
    private schemaService: SchemaService,
    public columnService: ColumnService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.bit.registerLocales(packer);
    this.route.params.subscribe(param => {
      this.id = param.id;
      this.getData();
    });
  }

  getData(): void {
    this.schemaService
      .get(this.id)
      .pipe(
        switchMap((data: any) => {
          this.data = data;
          return this.columnService.originLists(data.table);
        })
      )
      .subscribe(data => {
        this.columns = data.map((v: any) => {
          v.name = JSON.parse(v.name);
          v.description = JSON.parse(v.description);
          v.extra = JSON.parse(v.extra);
          return v;
        });
      });
  }

  getTerms(): void {
    this.schemaService.originLists(2).subscribe(data => {
      this.terms = data;
    });
  }

  sort(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.columns = [...this.columns];
    this.changed = true;
  }

  openColumn(datatype: any, value?: any): void {
    this.column = true;
    this.editing = value !== undefined;
    if (this.editing) {
      this.editingColumn = value.column;
    }
    switch (datatype) {
      case 'string':
        this.columnForm = this.fb.group({
          name: this.fb.group(
            this.bit.i18nGroup({
              validate: {
                zh_cn: [Validators.required]
              }
            })
          ),
          column: [null, [Validators.required, this.existsColumn]],
          description: this.fb.group(this.bit.i18nGroup({})),
          datatype: ['string', [Validators.required]],
          required: [false, [Validators.required]],
          default: [null],
          is_text: [false, [Validators.required]],
          is_hide: [false]
        });
        if (this.editing) {
          this.columnForm.patchValue({
            name: value.name,
            column: value.column,
            description: value.description,
            default: value.extra.default,
            required: value.extra.required,
            is_text: value.extra.is_text,
            is_hide: value.extra.is_hide
          });
        }
        break;
      case 'i18n':
        this.columnForm = this.fb.group({
          name: this.fb.group(
            this.bit.i18nGroup({
              validate: {
                zh_cn: [Validators.required]
              }
            })
          ),
          column: [null, [Validators.required, this.existsColumn]],
          description: this.fb.group(this.bit.i18nGroup({})),
          datatype: ['i18n', [Validators.required]],
          required: [false, [Validators.required]],
          is_text: [false, [Validators.required]],
          is_hide: [false]
        });
        if (this.editing) {
          this.columnForm.patchValue({
            name: value.name,
            column: value.column,
            description: value.description,
            required: value.extra.required,
            is_text: value.extra.is_text,
            is_hide: value.extra.is_hide
          });
        }
        break;
      case 'richtext':
        this.columnForm = this.fb.group({
          name: this.fb.group(
            this.bit.i18nGroup({
              validate: {
                zh_cn: [Validators.required]
              }
            })
          ),
          column: [null, [Validators.required, this.existsColumn]],
          description: this.fb.group(this.bit.i18nGroup({})),
          datatype: ['richtext', [Validators.required]],
          required: [false, [Validators.required]],
          is_hide: [false]
        });
        if (this.editing) {
          this.columnForm.patchValue({
            name: value.name,
            column: value.column,
            description: value.description,
            required: value.extra.required,
            is_hide: value.extra.is_hide
          });
        }
        break;
      case 'number':
        this.columnForm = this.fb.group({
          name: this.fb.group(
            this.bit.i18nGroup({
              validate: {
                zh_cn: [Validators.required]
              }
            })
          ),
          column: [null, [Validators.required, this.existsColumn]],
          description: this.fb.group(this.bit.i18nGroup({})),
          datatype: ['number', [Validators.required]],
          required: [false, [Validators.required]],
          default: [null],
          max: [null],
          min: [null],
          is_hide: [false],
          is_sort: [false]
        });
        if (this.editing) {
          this.columnForm.patchValue({
            name: value.name,
            column: value.column,
            description: value.description,
            required: value.extra.required,
            default: value.extra.default,
            max: value.extra.max,
            min: value.extra.min,
            is_hide: value.extra.is_hide,
            is_sort: value.extra.is_sort
          });
        }
        break;
      case 'status':
        this.columnForm = this.fb.group({
          name: this.fb.group(
            this.bit.i18nGroup({
              validate: {
                zh_cn: [Validators.required]
              }
            })
          ),
          column: [null, [Validators.required, this.existsColumn]],
          description: this.fb.group(this.bit.i18nGroup({})),
          datatype: ['status', [Validators.required]],
          required: [false, [Validators.required]],
          default: [false],
          is_hide: [false]
        });
        if (this.editing) {
          this.columnForm.patchValue({
            name: value.name,
            column: value.column,
            description: value.description,
            required: value.extra.required,
            default: value.extra.default,
            is_hide: value.extra.is_hide
          });
        }
        break;
      case 'date':
        this.columnForm = this.fb.group({
          name: this.fb.group(
            this.bit.i18nGroup({
              validate: {
                zh_cn: [Validators.required]
              }
            })
          ),
          column: [null, [Validators.required, this.existsColumn]],
          description: this.fb.group(this.bit.i18nGroup({})),
          datatype: ['date', [Validators.required]],
          required: [false, [Validators.required]],
          default: [null],
          is_hide: [false]
        });
        if (this.editing) {
          this.columnForm.patchValue({
            name: value.name,
            column: value.column,
            description: value.description,
            required: value.extra.required,
            default: value.extra.default,
            is_hide: value.extra.is_hide
          });
        }
        break;
      case 'datetime':
        this.columnForm = this.fb.group({
          name: this.fb.group(
            this.bit.i18nGroup({
              validate: {
                zh_cn: [Validators.required]
              }
            })
          ),
          column: [null, [Validators.required, this.existsColumn]],
          description: this.fb.group(this.bit.i18nGroup({})),
          datatype: ['datetime', [Validators.required]],
          required: [false, [Validators.required]],
          default: [null],
          is_hide: [false]
        });
        if (this.editing) {
          this.columnForm.patchValue({
            name: value.name,
            column: value.column,
            description: value.description,
            required: value.extra.required,
            default: value.extra.default,
            is_hide: value.extra.is_hide
          });
        }
        break;
      case 'picture':
        this.columnForm = this.fb.group({
          name: this.fb.group(
            this.bit.i18nGroup({
              validate: {
                zh_cn: [Validators.required]
              }
            })
          ),
          column: [null, [Validators.required, this.existsColumn]],
          description: this.fb.group(this.bit.i18nGroup({})),
          datatype: ['picture', [Validators.required]],
          required: [false, [Validators.required]],
          limit: [0],
          allow_sort: [false],
          is_hide: [false]
        });
        if (this.editing) {
          this.columnForm.patchValue({
            name: value.name,
            column: value.column,
            description: value.description,
            required: value.extra.required,
            limit: value.extra.limit,
            allow_sort: value.extra.allow_sort,
            is_hide: value.extra.is_hide
          });
        }
        break;
      case 'video':
        this.columnForm = this.fb.group({
          name: this.fb.group(
            this.bit.i18nGroup({
              validate: {
                zh_cn: [Validators.required]
              }
            })
          ),
          column: [null, [Validators.required, this.existsColumn]],
          description: this.fb.group(this.bit.i18nGroup({})),
          datatype: ['video', [Validators.required]],
          required: [false, [Validators.required]],
          limit: [0],
          allow_sort: [false],
          is_hide: [false]
        });
        if (this.editing) {
          this.columnForm.patchValue({
            name: value.name,
            column: value.column,
            description: value.description,
            required: value.extra.required,
            limit: value.extra.limit,
            allow_sort: value.extra.allow_sort,
            is_hide: value.extra.is_hide
          });
        }
        break;
      case 'enum':
        this.columnForm = this.fb.group({
          name: this.fb.group(
            this.bit.i18nGroup({
              validate: {
                zh_cn: [Validators.required]
              }
            })
          ),
          column: [null, [Validators.required, this.existsColumn]],
          description: this.fb.group(this.bit.i18nGroup({})),
          datatype: ['enum', [Validators.required]],
          required: [false, [Validators.required]],
          default: [null],
          values: this.fb.array([]),
          multiple: [false],
          is_hide: [false]
        });
        if (this.editing) {
          let count = 0;
          while (count < value.extra.values.length) {
            this.addEnum();
            count++;
          }
          this.columnForm.patchValue({
            name: value.name,
            column: value.column,
            description: value.description,
            required: value.extra.required,
            default: value.extra.default,
            values: value.extra.values,
            multiple: value.extra.multiple,
            is_hide: value.extra.is_hide
          });
        }
        break;
      case 'assoc':
        this.getTerms();
        this.columnForm = this.fb.group({
          name: this.fb.group(
            this.bit.i18nGroup({
              validate: {
                zh_cn: [Validators.required]
              }
            })
          ),
          column: [null, [Validators.required, this.existsColumn]],
          description: this.fb.group(this.bit.i18nGroup({})),
          datatype: ['assoc', [Validators.required]],
          required: [false, [Validators.required]],
          assoc: [null, [Validators.required]],
          assoc_key: [null, [Validators.required]],
          assoc_name: [null, [Validators.required]],
          multiple: [false],
          is_hide: [false]
        });
        if (this.editing) {
          this.getAssoc(value.extra.assoc);
          this.columnForm.patchValue({
            name: value.name,
            column: value.column,
            description: value.description,
            required: value.extra.required,
            assoc: value.extra.assoc,
            assoc_key: value.extra.assoc_key,
            assoc_name: value.extra.assoc_name,
            multiple: value.extra.multiple,
            is_hide: value.extra.is_hide
          });
        }
        break;
    }
  }

  get formValues(): FormArray {
    return this.columnForm.get('values') as FormArray;
  }

  existsColumn = (control: AbstractControl) => {
    if (this.editing && this.editingColumn === control.value) {
      return null;
    }
    if (this.columns.some(v => v.column === control.value)) {
      return { error: true, duplicated: true };
    }
    return null;
  };

  addEnum(): void {
    this.formValues.push(
      this.fb.group({
        label: this.fb.group(
          this.bit.i18nGroup({
            validate: {
              zh_cn: [Validators.required]
            }
          })
        ),
        value: [null, [Validators.required]]
      })
    );
  }

  removeEnum(index: number): void {
    this.formValues.removeAt(index);
  }

  getAssoc(schema: string): void {
    this.columnService.originLists(schema).subscribe(data => {
      this.assoc = data;
    });
  }

  closeColumn(): void {
    this.column = false;
    this.columnForm = undefined!;
  }

  submitColumn(data: any): void {
    const dataset: any = {
      column: data.column,
      datatype: data.datatype,
      name: data.name,
      description: data.description,
      status: true
    };
    Reflect.deleteProperty(data, 'column');
    Reflect.deleteProperty(data, 'datatype');
    Reflect.deleteProperty(data, 'name');
    Reflect.deleteProperty(data, 'description');
    Reflect.set(dataset, 'extra', data);
    if (!this.editing) {
      this.columns = [...this.columns, dataset];
    } else {
      const value = this.columns.find(v => v.column === this.editingColumn);
      Reflect.ownKeys(dataset).forEach(key => {
        Reflect.set(value, key, dataset[key]);
      });
    }
    this.changed = true;
    this.closeColumn();
  }

  deleteColumn(column: string): void {
    this.columns = this.columns.filter(v => v.column !== column);
    this.changed = true;
  }

  save(): void {
    this.columns.forEach((value, index) => {
      value.sort = index;
    });
    this.columnService.update(this.data.table, this.columns).subscribe(res => {
      if (!res.error) {
        this.message.success(this.bit.l.updateSuccess);
        this.changed = false;
        this.getData();
      } else {
        this.message.error(this.bit.l.updateError);
      }
    });
  }

  publish(): void {
    this.publishRemark = '';
    this.modal.create({
      nzTitle: this.bit.l['publishConfirm'],
      nzContent: this.publishTpl,
      nzOnOk: () => {
        this.schemaService.publish(this.data.table, this.publishRemark).subscribe(res => {
          if (!res.error) {
            this.message.success(this.bit.l.publishSuccess);
          } else {
            this.message.error(this.bit.l.publishError);
          }
        });
      }
    });
  }
}
