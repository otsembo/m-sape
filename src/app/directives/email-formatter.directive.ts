import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[formatEmail]'
})
export class EmailFormatterDirective {

  constructor(private e1: ElementRef) {
    this.e1.nativeElement.value = this.formatEmail()
  }

  private formatEmail(): string {
    let email =  this.e1.nativeElement.value;
    console.log("mail: ", email);
    if(email?.length > 15) {
      return email.substring(0, 15) + "...";
    }
    return email;
  }

}
