import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'spribe-users-header',
  standalone: true,
  templateUrl: './users-header.component.html',
  styleUrl: './users-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersHeaderComponent {
  readonly isInvalid = input.required<boolean>();
  readonly invalidFormsCount = input.required<number>();
  readonly reverseCounter = input.required<string>();

  readonly cancelTimer = output<void>();
  readonly submit = output<void>();

  onCancel(): void {
    this.cancelTimer.emit();
  }

  onSubmit(): void {
    this.submit.emit();
  }
}
