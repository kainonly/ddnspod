import { NgModule } from '@angular/core';
import { ShareModule } from '@vanx/framework';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxTinymceModule } from 'ngx-tinymce';
import { PictureComponent } from './media-input/picture.component';
import { VideoComponent } from './media-input/video.component';
import { RichtextComponent } from './richtext/richtext.component';

@NgModule({
  imports: [
    ShareModule,
    DragDropModule,
    NgxTinymceModule
  ],
  declarations: [
    PictureComponent,
    VideoComponent,
    RichtextComponent
  ],
  exports: [
    PictureComponent,
    VideoComponent,
    RichtextComponent
  ]
})
export class CmsComponentModule {
}
