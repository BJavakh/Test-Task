import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-input',
  standalone: true,
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi:  true
    }
  ],
  imports: [FormsModule]
})
export class InputComponent<T> implements ControlValueAccessor {
  readonly placeholder = input<string>();

  value = signal<T | null>(null);
  control = signal<AbstractControl | null>(null);

  onTouch: () => void;
  onChange: (value: T | null) => void;

  writeValue(value: T): void {
      this.value.set(value);
  }

  registerOnChange(fn: (value: T | null) => void): void {
      this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
      this.onTouch = fn;
  }
}
