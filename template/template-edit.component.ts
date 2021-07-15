import { Component } from '@angular/core';
import { switchMap } from 'rxjs/operators';

import { TemplatePageComponent } from './template-page/template-page.component';

@Component({
  selector: 'v-template-edit',
  templateUrl: './template-page/template-page.component.html'
})
export class TemplateEditComponent extends TemplatePageComponent {
  back = 'true';

  protected getData(): void {
    this.templateService.api.get(this.id).subscribe((data: any) => {
      this.form.patchValue(data);
    });
  }

  submit(data: any): void {
    Reflect.set(data, 'id', this.id);
    this.templateService.api
      .edit(data)
      .pipe(switchMap((v: any) => this.swal.editAlert(v)))
      .subscribe(status => {
        if (status) {
          this.getData();
        }
      });
  }
}
