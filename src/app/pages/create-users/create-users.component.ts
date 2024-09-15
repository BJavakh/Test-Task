import { ChangeDetectionStrategy, Component, Signal, signal, WritableSignal } from '@angular/core';
import { UserFormComponent } from "./user-form/user-form.component";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserForm } from './entities/user-form.interface';
import { USERS_FORMS_LIMIT } from './entities/users-forms-limit';
import { UsersHeaderComponent } from './components/users-header/users-header.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, Observable, startWith, Subject, switchMap, takeWhile, timer } from 'rxjs';
import { TimerExecutor } from './entities/timer-executor.enum';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';

@Component({
  selector: 'spribe-create-users',
  standalone: true,
  templateUrl: './create-users.component.html',
  styleUrl: './create-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserFormComponent, ReactiveFormsModule, UsersHeaderComponent, IconComponent]
})
export class CreateUsersComponent {
  /* Form */
  public readonly form = new FormGroup({
    users: new FormArray<FormGroup<UserForm>>([
      new FormGroup<UserForm>({
        country: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
        username: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
        birthday: new FormControl<Date>(this._yestarday(), { nonNullable: true, validators: Validators.required })
      }),
    ]),
  });

  /* Subjects */
  private readonly indicateTimer$: Subject<TimerExecutor> = new Subject<TimerExecutor>();

  /* Signals */
  readonly usersLimit: WritableSignal<number> = signal<number>(USERS_FORMS_LIMIT);
  readonly reverseCounter: Signal<string> = toSignal(this.timer$(), { manualCleanup: true });

  /*
  * Getters
  * P.S - Computation in the getters are expensive so i'm avoiding using them, it's only for quick implementation
  */
  get invalidFormsCount(): number {
    const { controls } = this.form.controls.users;
    let invalidCount = 0;

    controls.forEach(({ invalid }) => {
      if (invalid) {
        invalidCount += 1;
      }
    });

    return invalidCount;
  }

  addUserForm(): void {
    const userForm: FormGroup<UserForm> = new FormGroup<UserForm>({
      country: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      username: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      birthday: new FormControl<Date>(this._yestarday(), { nonNullable: true, validators: Validators.required })
    });

    this.form.controls.users.push(userForm);
  }

  onRemoveUserForm(index: number): void {
    if (this.form.controls.users.length === 1) return;

    this.form.controls.users.removeAt(index);
  }

  onSubmit(): void {
    this.form.disable({ emitEvent: false });
    this.indicateTimer$.next(TimerExecutor.start);
  }

  onCancelTimer(): void {
    this.indicateTimer$.next(TimerExecutor.stop);
  }

  private _yestarday(): Date {
    const date = new Date();

    date.setDate(date.getDate() - 1);

    return date;
  }

  private timer$(): Observable<string> {
    return this.indicateTimer$.asObservable().pipe(
      switchMap((executor: TimerExecutor) =>
        timer(0, 1000).pipe(
          startWith(5),
          map(n => 5 - n),
          takeWhile(n => n >= 0),
          map(n => this.formatTime(n)),
          map((time: string) => {
            if (executor === TimerExecutor.stop) {
              return null;
            } else if (time === '0:00') {
              this.form.enable({ emitEvent: false });

              return null;
            } else {
              return time;
            }
          }),
        )
      )
    )
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const padZero = secs < 10 ? `0${secs}` : secs.toString();

    return `${mins}:${padZero}`;
  }
}
