import { ChangeDetectionStrategy, Component, computed, inject, input, output, OutputEmitterRef, Signal, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserForm } from '../entities/user-form.interface';
import { InputComponent } from 'src/app/shared/components/input';
import { debounceTime, switchMap, startWith, map } from 'rxjs';
import { UsersService } from 'src/app/shared/services';
import { Country } from 'src/app/shared/enum/country';
import { ValidationMessageDirective } from 'src/app/shared/directives/validation-message.directive';
import { TooltipDirective } from 'src/app/shared/directives';

@Component({
  selector: 'spribe-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputComponent, ValidationMessageDirective, TooltipDirective],
  providers: [UsersService],
})
export class UserFormComponent {
  /* Inputs */
  readonly userFormGroup = input.required<FormGroup<UserForm>>()

  /* Signals */
  readonly today: WritableSignal<string> = signal<string>('');
  readonly countries: WritableSignal<Country[]> = signal<Country[]>(Object.values(Country));
  readonly countriesToSuggest: WritableSignal<Country[]> = signal<Country[]>([]);

  /* Computed */
  readonly suggestion: Signal<string> = computed(() => this.countriesToSuggest().join(', '));

  /* Outputs */
  readonly remove: OutputEmitterRef<void> = output<void>();

  /* DI */
  private readonly _usersService = inject(UsersService);

  constructor() {
    this._handleToday();
  }

  ngOnInit(): void {
    this._listenUsernameChange();


    this.userFormGroup().get('country').valueChanges.pipe(
      debounceTime(300),  // Wait for 300ms after the user stops typing
      startWith(''),
      map(value => this._filterCountries(value))
    ).subscribe(filtered => {
      this.countriesToSuggest.set(filtered);
    });
  }

  removeUserForm(): void {
    this.remove.emit();
  }

  private _listenUsernameChange(): void {
    const usernameControl: AbstractControl<string, string> = this.userFormGroup().get('username');

    usernameControl.valueChanges.pipe(
      debounceTime(500),
      switchMap(username => this._usersService.checkUser(username)),
    ).subscribe({
      next: result => {
        if (result.isAvailable === false) {
          usernameControl.setErrors({ usernameTaken: true });
          usernameControl.markAsDirty();
          usernameControl.markAsTouched();
        } else {
          usernameControl.setErrors(null);
        }
      }
    });
  }

  private _filterCountries(input: string): Country[] {
    const filterValue = input.toLowerCase();
    return this.countries().filter(country =>
      country.toLowerCase().includes(filterValue)
    );
  }

  private _handleToday(): void {
    const date = new Date();
    this.today.set(date.toISOString().split('T')[0]);
  }
}
