import {Router} from "@angular/router";

export const  delay = async (): Promise<void> => await new Promise(resolve => setTimeout(resolve, 500));

export const logout = (router: Router): Promise<boolean> => router.navigate(['/auth']);
