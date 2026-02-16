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
  resultMessage = '';
  isSubmitting = false;
  isSuccess = false;

  copyEmail() {
    navigator.clipboard.writeText(this.email).then(() => {
      // Optional: Show a toast or change icon briefly
      console.log('Email copied!');
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    this.isSubmitting = true;
    this.resultMessage = 'Please wait...';
    this.isSuccess = false;

    const formData = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
      .then(async (response) => {
        const json = await response.json();
        if (response.status == 200) {
          this.resultMessage = json.message;
          this.isSuccess = true;
          form.reset();
        } else {
          console.log(response);
          this.resultMessage = json.message;
          this.isSuccess = false;
        }
      })
      .catch(error => {
        console.log(error);
        this.resultMessage = 'Something went wrong!';
        this.isSuccess = false;
      })
      .finally(() => {
        this.isSubmitting = false;
        setTimeout(() => {
          this.resultMessage = '';
          this.isSuccess = false;
        }, 5000);
      });
  }
}
