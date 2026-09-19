import { Component } from '@angular/core';
import { Contact } from '../../components/contact/contact';

@Component({
    selector: 'app-contact-page',
    standalone: true,
    imports: [Contact],
    template: `<app-contact></app-contact>`
})
export class ContactPage { }
