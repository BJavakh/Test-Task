import { Directive, ElementRef, inject, input, Input, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[spValidationMessage]',
  standalone: true,
})
export class ValidationMessageDirective {
  readonly spValidationMessage = input<string>();

  private readonly _el = inject(ElementRef);
  private readonly _control = inject(NgControl);
  private readonly _renderer = inject(Renderer2);

  ngOnInit(): void {
    this._control.control.statusChanges.subscribe(status => {
      if (status === 'INVALID' && this._control.touched) {
        this.showErrorMessage();
      } else {
        this.removeErrorMessage();
      }
    });
  }

  private showErrorMessage(): void {
    const errorMessage = this._renderer.createElement('div');

    /* I would add here Record for validation message keys */
    const errorText = this._renderer.createText(`Please provide a correct ${this.spValidationMessage()}`);

    this._renderer.addClass(errorMessage, 'validation-error');
    this._renderer.setStyle(errorMessage, 'color', 'red');
    this._renderer.setStyle(errorMessage, 'font-size', '0.875em');

    this._renderer.appendChild(errorMessage, errorText);
    this._renderer.appendChild(this._el.nativeElement.parentNode, errorMessage);
  }

  private removeErrorMessage(): void {
    const parent = this._el.nativeElement.parentNode;
    const errorMessage = parent.querySelector('.validation-error');
    if (errorMessage) {
      this._renderer.removeChild(parent, errorMessage);
    }
  }
}
