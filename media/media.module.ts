import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';

import { ShareModule } from '@vanx/framework';
import { FrameworkComponentModule } from '@vanx/framework/component';

import { MediaTypeService } from './media-type.service';
import { MediaComponent } from './media.component';
import { MediaService } from './media.service';

@NgModule({
  imports: [ShareModule, ScrollingModule, DragDropModule, FrameworkComponentModule],
  declarations: [MediaComponent],
  exports: [MediaComponent],
  providers: [MediaService, MediaTypeService]
})
export class MediaModule {}
