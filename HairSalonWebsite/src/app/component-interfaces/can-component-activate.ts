import { Observable } from "rxjs/internal/Observable";
export interface CanComponentActivate {
    canActivate: () => Observable<boolean> | Promise<boolean> | boolean;
    }