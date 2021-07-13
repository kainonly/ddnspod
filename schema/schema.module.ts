import { NgModule } from '@angular/core';
import { ShareModule } from '@vanx/framework';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SchemaService } from './schema.service';
import { ColumnService } from './column.service';
import { SchemaIndexComponent } from './schema-index/schema-index.component';
import { SchemaAddComponent } from './schema-add/schema-add.component';
import { SchemaEditComponent } from './schema-edit/schema-edit.component';
import { SchemaOptionComponent } from './schema-option/schema-option.component';
import { SchemaHistoryComponent } from './schema-history/schema-history.component';

@NgModule({
  imports: [ShareModule, DragDropModule],
  declarations: [
    SchemaIndexComponent,
    SchemaAddComponent,
    SchemaEditComponent,
    SchemaOptionComponent,
    SchemaHistoryComponent
  ],
  exports: [
    SchemaIndexComponent,
    SchemaAddComponent,
    SchemaEditComponent,
    SchemaOptionComponent,
    SchemaHistoryComponent
  ],
  providers: [SchemaService, ColumnService]
})
export class SchemaModule {}
