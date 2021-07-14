import { Component, OnInit } from '@angular/core';
import { Bit } from 'ngx-bit';
import { NzTimelineItemColor } from 'ng-zorro-antd/timeline';
import { ActivatedRoute } from '@angular/router';
import { SchemaService } from '../schema.service';
import { SchemaType } from '../schema-type';
import * as packer from './language';

@Component({
  selector: 'v-schema-history',
  templateUrl: './schema-history.component.html',
  styleUrls: ['./schema-history.component.scss']
})
export class SchemaHistoryComponent implements OnInit {
  private id!: number;
  data: any;
  lists: any[] = [];
  table: any;
  type: any = SchemaType;
  active = 'main';
  expands = new Set();

  constructor(public bit: Bit, private route: ActivatedRoute, private schemaService: SchemaService) {}

  ngOnInit(): void {
    this.bit.registerLocales(packer);
    this.route.params.subscribe(param => {
      this.id = param.id;
      this.getData();
    });
  }

  getData(): void {
    this.schemaService.get(this.id).subscribe(data => {
      this.data = data;
      this.getTable();
      this.getTableDetail();
    });
  }

  getTable(): void {
    this.schemaService.history(this.data.table).subscribe(data => {
      this.lists = data;
    });
  }

  getTableDetail(): void {
    let table = this.data.table;
    if (this.active !== 'main') {
      table += '_' + this.active;
    }
    this.schemaService.table(table).subscribe(data => {
      this.table = data;
    });
  }

  open(version: string): void {
    this.active = version;
    this.getTableDetail();
  }

  isActived(value: string): NzTimelineItemColor {
    return this.active === value ? 'blue' : 'gray';
  }

  openComment(name: any): void {
    if (this.expands.has(name)) {
      this.expands.delete(name);
    } else {
      this.expands.add(name);
    }
  }
}
