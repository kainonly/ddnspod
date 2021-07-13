import { NgModule } from '@angular/core';
import { ShareModule } from '@vanx/framework';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxTinymceModule } from 'ngx-tinymce';
import { PictureComponent } from './media-input/picture.component';
import { VideoComponent } from './media-input/video.component';
import { RichtextComponent } from './richtext/richtext.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { FrameworkComponentModule } from '@vanx/framework/component';

@NgModule({
  imports: [ShareModule, DragDropModule, ScrollingModule, FrameworkComponentModule, NgxTinymceModule, NzAvatarModule],
  declarations: [PictureComponent, VideoComponent, RichtextComponent],
  exports: [PictureComponent, VideoComponent, RichtextComponent]
})
export class CmsComponentModule {}
