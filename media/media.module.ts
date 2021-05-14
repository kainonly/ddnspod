import { NgModule } from '@angular/core';
import { ShareModule } from '@vanx/framework';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MediaComponent } from './media.component';
import { MediaService } from './media.service';
import { MediaTypeService } from './media-type.service';

@NgModule({
  imports: [
    ShareModule,
    ScrollingModule,
    DragDropModule
  ],
  declarations: [
    MediaComponent
  ],
  exports: [
    MediaComponent
  ],
  providers: [
    MediaService,
    MediaTypeService
  ]
})
export class MediaModule {
}
