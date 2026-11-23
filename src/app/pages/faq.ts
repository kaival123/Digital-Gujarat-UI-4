import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { ButtonDirective } from 'primeng/button';
import { Reveal } from '../shared/motion';
import { PageHero } from '../shared/page-hero';
import faq from '../data/faq.json';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-faq',
  imports: [RouterLink, Accordion, AccordionPanel, AccordionHeader, AccordionContent, ButtonDirective, PageHero, Reveal],
  template: `
    <app-page-hero title="Frequently Asked Questions" subtitle="Quick answers about Digital Gujarat." />
    <section class="section" data-main tabindex="-1">
      <div class="container narrow">
        <p class="lead-in">Digital Gujarat is an online portal launched by the Government of Gujarat to provide various digital services to its citizens — scholarships, income certificates, caste certificates, residence certificates and other essential documents.</p>
        <p-accordion [value]="0" appReveal="up">
          @for (f of items; track $index) {
            <p-accordion-panel [value]="$index">
              <p-accordion-header>{{ f.q }}</p-accordion-header>
              <p-accordion-content>
                @for (a of f.a; track $index) { <p>{{ a }}</p> }
              </p-accordion-content>
            </p-accordion-panel>
          }
        </p-accordion>
        <div class="cta-box" appReveal="up">
          <h3>Do you have any queries?</h3>
          <a pButton routerLink="/help-desk"><i class="pi pi-headphones"></i> Contact helpdesk</a>
        </div>
      </div>
    </section>
  `,
})
export class FaqPage { items = faq; }
