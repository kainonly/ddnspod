import { Component } from '@angular/core';
import { switchMap } from 'rxjs/operators';

import { TemplatePageComponent } from './template-page/template-page.component';

@Component({
  selector: 'v-template-add',
  templateUrl: './template-page/template-page.component.html'
})
export class TemplateAddComponent extends TemplatePageComponent {
  back = 'true';

  protected getData(): void {
    // do nothing
  }

  submit(data: any): void {
    this.templateService.api
      .add(data)
      .pipe(
        switchMap((v: any) =>
          this.swal.addAlert(v, this.form, {
            status: true
          })
        )
      )
      .subscribe(() => {});
  }
}
