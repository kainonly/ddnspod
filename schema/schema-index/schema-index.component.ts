import { Component, OnInit } from '@angular/core';
import { Bit, ListByPage } from 'ngx-bit';
import { SchemaService } from '../schema.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SchemaType } from '../schema-type';
import * as packer from './language';
import { BitSwalService } from 'ngx-bit/swal';

@Component({
  selector: 'v-schema-index',
  templateUrl: './schema-index.component.html'
})
export class SchemaIndexComponent implements OnInit {
  lists!: ListByPage;
  type: any[] = Object.values(SchemaType);

  constructor(
    public bit: Bit,
    private swal: BitSwalService,
    private message: NzMessageService,
    public schemaService: SchemaService
  ) {}

  ngOnInit(): void {
    this.bit.registerLocales(packer);
    this.lists = this.bit.listByPage({
      id: 'schema-index',
      query: [
        { field: 'name->zh_cn', op: 'like', value: '' },
        { field: 'name->en_us', op: 'like', value: '' },
        { field: 'type', op: '=', value: 0, exclude: [null, ''] }
      ]
    });
    this.lists.ready.subscribe(() => {
      this.getLists(true);
    });
  }

  /**
   * 获取列表数据
   */
  getLists(refresh = false, event?: any): void {
    this.schemaService.lists(this.lists, refresh, event !== undefined).subscribe(data => {
      this.lists.setData(data);
    });
  }

  /**
   * 删除单操作
   */
  deleteData(id: any[]): void {
    this.swal.deleteAlert(this.schemaService.delete(id)).subscribe(res => {
      if (!res.error) {
        this.message.success(this.bit.l.deleteSuccess);
        this.getLists(true);
      } else {
        this.message.error(this.bit.l.deleteError);
      }
    });
  }
}
