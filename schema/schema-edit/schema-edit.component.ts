import { Component, OnInit } from '@angular/core';
import { Bit } from 'ngx-bit';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AsyncSubject } from 'rxjs';
import { asyncValidator } from 'ngx-bit/operates';
import { SchemaType } from '../schema-type';
import { SchemaService } from '../schema.service';
import * as packer from './language';
import { BitSwalService } from 'ngx-bit/swal';

@Component({
  selector: 'v-schema-edit',
  templateUrl: './schema-edit.component.html'
})
export class SchemaEditComponent implements OnInit {
  private id!: number;
  private tableAsync: AsyncSubject<string> = new AsyncSubject();
  form!: FormGroup;
  type: any[] = Object.values(SchemaType);

  constructor(
    public bit: Bit,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private swal: BitSwalService,
    private schemaService: SchemaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.bit.registerLocales(packer);
    this.form = this.fb.group({
      name: this.fb.group(
        this.bit.i18nGroup({
          validate: {
            zh_cn: [Validators.required]
          }
        })
      ),
      table: [null, [Validators.required], [this.existsTable]],
      type: [null, [Validators.required]],
      description: [null],
      status: [true, [Validators.required]]
    });
    this.route.params.subscribe(param => {
      this.id = param.id;
      this.getData();
    });
  }

  existsTable = (control: AbstractControl) => {
    return asyncValidator(this.schemaService.validedTable(control.value, this.tableAsync));
  };

  getData(): void {
    this.schemaService.get(this.id).subscribe(data => {
      const name = this.bit.i18nParse(data.name);
      this.tableAsync.next(data.table);
      this.tableAsync.complete();
      this.form.patchValue({
        name,
        table: data.table,
        type: data.type,
        description: data.description,
        status: data.status
      });
    });
  }

  /**
   * 提交
   */
  submit(data: any): void {
    Reflect.set(data, 'id', this.id);
    this.schemaService
      .edit(data)
      .pipe(switchMap(res => this.swal.editAlert(res)))
      .subscribe(status => {
        if (status) {
          this.getData();
        }
      });
  }
}
