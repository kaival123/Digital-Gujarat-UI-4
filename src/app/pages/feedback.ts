import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { SelectButton } from 'primeng/selectbutton';
import { Textarea } from 'primeng/textarea';
import { Reveal } from '../shared/motion';
import { PageHero } from '../shared/page-hero';

const Q = (q: string, options: string[]) => ({ q, options, value: null as string | null });

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-feedback',
  imports: [FormsModule, ButtonDirective, InputText, Message, SelectButton, Textarea, PageHero, Reveal],
  template: `
    <app-page-hero title="Feedback" subtitle="Tell us how we can make Digital Gujarat better." />
    <section class="section" data-main tabindex="-1">
      <div class="container fbk">
        @if (sent()) {
          <p-message severity="success" icon="pi pi-check-circle">Thank you for your feedback. Your response has been recorded in this demo.</p-message>
          <button pButton type="button" class="mt" (click)="sent.set(false)">Send another response</button>
        } @else {
          <aside class="fbk-side">
            <p class="fbk-kicker">Your voice</p>
            <h2>Help us make Digital Gujarat better</h2>
            <p>Tell us how easy it was to find, apply for and track a service. It takes about two minutes and every response is read by the programme team.</p>
            <ul><li><i class="pi pi-check-circle"></i> Rate five quick questions</li><li><i class="pi pi-check-circle"></i> Add your contact details</li><li><i class="pi pi-check-circle"></i> Share anything else in your own words</li></ul>
          </aside>
          <form class="feedback-form" appReveal="up" (ngSubmit)="submit(f.valid)" novalidate #f="ngForm">
            <div class="form-grid">
              <label>Name <input pInputText name="name" [(ngModel)]="form.name" #name="ngModel" required [attr.aria-invalid]="name.invalid && (name.touched || f.submitted)" aria-describedby="e-name">
                <small id="e-name" class="field-error" role="alert">@if (name.invalid && (name.touched || f.submitted)) { Please enter your name. }</small></label>
              <label>Email <input pInputText type="email" name="email" [(ngModel)]="form.email" #email="ngModel" required email [attr.aria-invalid]="email.invalid && (email.touched || f.submitted)" aria-describedby="e-email">
                <small id="e-email" class="field-error" role="alert">@if (email.invalid && (email.touched || f.submitted)) { Please enter a valid email address. }</small></label>
              <label>Mobile <input pInputText name="mobile" [(ngModel)]="form.mobile" #mobile="ngModel" pattern="[0-9]{10}" maxlength="10" inputmode="numeric" required [attr.aria-invalid]="mobile.invalid && (mobile.touched || f.submitted)" aria-describedby="e-mobile">
                <small id="e-mobile" class="field-error" role="alert">@if (mobile.invalid && (mobile.touched || f.submitted)) { Enter a 10-digit mobile number. }</small></label>
              <label>Subject <input pInputText name="subject" [(ngModel)]="form.subject"><small class="field-error" aria-hidden="true"></small></label>
            </div>
            @for (q of questions; track q.q; let i = $index) {
              <fieldset>
                <legend>{{ q.q }}</legend>
                <p-selectbutton [options]="q.options" [(ngModel)]="q.value" [name]="'q' + i" [allowEmpty]="false" size="small" [ariaLabel]="q.q" />
              </fieldset>
            }
            <label>Message <textarea pTextarea name="message" rows="4" [(ngModel)]="form.message"></textarea></label>
            <button pButton type="submit"><i class="pi pi-send"></i> Submit feedback</button>
          </form>
        }
      </div>
    </section>
  `,
})
export class FeedbackPage {
  sent = signal(false);
  form = { name: '', email: '', mobile: '', subject: '', message: '' };
  questions = [
    Q('How easy was it to access the service online?', ['Very Difficult', 'Difficult', 'Neutral', 'Easy', 'Very Easy']),
    Q('How clear and understandable were the instructions for completing the process?', ['Very Unclear', 'Unclear', 'Neutral', 'Clear', 'Very Clear']),
    Q('How satisfied are you with the timeliness of the service?', ['Very Slow', 'Slow', 'Average', 'Fast', 'Very Fast']),
    Q('How satisfied are you with the user interface?', ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']),
    Q('Overall, how satisfied are you with the overall online service experience?', ['Very Unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very Satisfied']),
  ];
  submit(valid: boolean) { if (valid) this.sent.set(true); }
}
