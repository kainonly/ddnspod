import { Component } from '@angular/core';
import { TemplatePageComponent } from './template-page/template-page.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'van-template-add',
  templateUrl: './template-page/template-page.component.html'
})
export class TemplateAddComponent extends TemplatePageComponent {
  back = true;

  protected getData(): void {
    // do nothing
  }

  submit(data): void {
    this.templateService.add(data).pipe(
      switchMap(res => this.swal.addAlert(res, this.form, {
        status: true
      }))
    ).subscribe(() => {
    });
  }
}
