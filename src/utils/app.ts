import {Router} from "@angular/router";
import {AppResponse} from "../app/data/models/AppResponse";

export const  delay = async (): Promise<void> => await new Promise(resolve => setTimeout(resolve, 500));

export const logout = (router: Router): Promise<boolean> => router.navigate(['/auth']);

export const appError: AppResponse = {
  status: 500,
  message: 'Internal Server Error',
  body: null
}
