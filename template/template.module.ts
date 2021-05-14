import { NgModule } from '@angular/core';
import { ShareModule } from '@vanx/framework';
import { TemplateIndexComponent } from './template-index/template-index.component';
import { TemplatePageComponent } from './template-page/template-page.component';
import { TemplateAddComponent } from './template-add.component';
import { TemplateEditComponent } from './template-edit.component';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { CmsComponentModule } from '@vanx/cms/component';
import { TemplateService } from './template.service';
import { PageService } from './page.service';

@NgModule({
  imports: [
    ShareModule,
    CmsComponentModule,
    NzPipesModule
  ],
  declarations: [
    TemplateIndexComponent,
    TemplatePageComponent,
    TemplateAddComponent,
    TemplateEditComponent
  ],
  exports: [
    TemplateIndexComponent,
    TemplatePageComponent,
    TemplateAddComponent,
    TemplateEditComponent
  ],
  providers: [
    PageService,
    TemplateService
  ]
})
export class TemplateModule {
}
