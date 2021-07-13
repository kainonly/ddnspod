import { Component } from '@angular/core';
import { TemplatePageComponent } from './template-page/template-page.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'v-template-edit',
  templateUrl: './template-page/template-page.component.html'
})
export class TemplateEditComponent extends TemplatePageComponent {
  back = true;

  protected getData(): void {
    this.templateService.get(this.id).subscribe(data => {
      this.form.patchValue(data);
    });
  }

  submit(data: any): void {
    Reflect.set(data, 'id', this.id);
    this.templateService
      .edit(data)
      .pipe(switchMap(res => this.swal.editAlert(res)))
      .subscribe(status => {
        if (status) {
          this.getData();
        }
      });
  }
}
