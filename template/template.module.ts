import { NgModule } from '@angular/core';

import { CmsComponentModule } from '@vanx/cms/component';
import { ShareModule } from '@vanx/framework';
import { NzPipesModule } from 'ng-zorro-antd/pipes';

import { PageService } from './page.service';
import { TemplateAddComponent } from './template-add.component';
import { TemplateEditComponent } from './template-edit.component';
import { TemplateIndexComponent } from './template-index/template-index.component';
import { TemplatePageComponent } from './template-page/template-page.component';
import { TemplateService } from './template.service';

@NgModule({
  imports: [ShareModule, CmsComponentModule, NzPipesModule],
  declarations: [TemplateIndexComponent, TemplatePageComponent, TemplateAddComponent, TemplateEditComponent],
  exports: [TemplateIndexComponent, TemplatePageComponent, TemplateAddComponent, TemplateEditComponent],
  providers: [PageService, TemplateService]
})
export class TemplateModule {}
