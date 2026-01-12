import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  email = 'sagarankit000@gmail.com';

  copyEmail() {
    navigator.clipboard.writeText(this.email).then(() => {
        // Optional: Show a toast or change icon briefly
        console.log('Email copied!');
    });
  }
}
