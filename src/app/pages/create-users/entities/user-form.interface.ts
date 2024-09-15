import { FormControl } from "@angular/forms";

export interface UserForm {
  country: FormControl<string>;
  username: FormControl<string>;
  birthday: FormControl<Date>;
}
