import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Bit, ListByPage, SearchOption } from 'ngx-bit';
import { ColumnService } from '@vanx/cms/schema';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BitSwalService } from 'ngx-bit/swal';
import { TemplateService } from '../template.service';
import * as packer from './language';

@Component({
  selector: 'v-template-index',
  templateUrl: './template-index.component.html'
})
export class TemplateIndexComponent implements OnInit {
  key!: string;
  columns!: any[];
  columnsMap: Map<string, any> = new Map();
  lists!: ListByPage;
  search: any[] = [];

  constructor(
    private swal: BitSwalService,
    public bit: Bit,
    private message: NzMessageService,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private columnService: ColumnService,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    this.bit.registerLocales(packer);
    this.route.params
      .pipe(
        switchMap(params => {
          this.key = params.key;
          this.columns = [];
          this.columnsMap = new Map<string, any>();
          this.lists = undefined!;
          this.search = [];
          return this.storage.get('template:' + this.key);
        }),
        switchMap((search: any) => {
          if (search) {
            this.search = search;
          }
          const table = this.key.replace('-', '_');
          this.templateService.setModel(table);
          return this.columnService.originLists(table);
        })
      )
      .subscribe(data => {
        this.columns = data
          .filter((v: any) => v.datatype !== 'system')
          .map((v: any) => {
            v.name = JSON.parse(v.name);
            v.extra = JSON.parse(v.extra);
            this.columnsMap.set(v.column, v);
            return v;
          });
        this.lists = this.bit.listByPage({
          id: this.key,
          query: this.getQueryFromSearch()
        });
        this.lists.ready.subscribe(() => {
          this.getLists();
        });
      });
  }

  get searchColumns(): any[] {
    return this.columns.filter(v => {
      if (['picture', 'video'].includes(v.datatype)) {
        return false;
      }
      return !v.extra.is_hide;
    });
  }

  searchDetection(): void {
    this.lists = this.bit.listByPage({
      id: this.key,
      query: this.getQueryFromSearch()
    });
    this.lists.ready.pipe(switchMap(() => this.storage.set('template:' + this.key, this.search))).subscribe(() => {
      this.getLists();
    });
  }

  private getQueryFromSearch(): SearchOption[] {
    return this.search.map((v: any) => {
      const column: any = this.columnsMap.get(v);
      switch (column.datatype) {
        case 'string':
          return <SearchOption>{
            field: column.column,
            op: 'like',
            value: ''
          };
        default:
          return <SearchOption>{};
      }
    });
  }

  /**
   * 获取列表数据
   */
  getLists(refresh = false, event?: any): void {
    this.templateService.lists(this.lists, refresh, event !== undefined).subscribe(data => {
      this.lists.setData(data);
    });
  }

  /**
   * 删除单操作
   */
  deleteData(id: any[]): void {
    this.swal.deleteAlert(this.templateService.delete(id)).subscribe(res => {
      if (!res.error) {
        this.message.success(this.bit.l.deleteSuccess);
        this.getLists(true);
      } else {
        this.message.error(this.bit.l.deleteError);
      }
    });
  }

  /**
   * 选中删除
   */
  deleteCheckData(): void {
    const id = this.lists.getChecked().map(v => v.id);
    this.deleteData(id);
  }
}
