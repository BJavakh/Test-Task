import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CheckUserResponseData } from "../interface/responses";

@Injectable()
export class UsersService {
  private readonly _http = inject(HttpClient);

  checkUser(username: string): Observable<CheckUserResponseData> {
    return this._http.post<CheckUserResponseData>('/api/checkUsername', { username });
  }
}
