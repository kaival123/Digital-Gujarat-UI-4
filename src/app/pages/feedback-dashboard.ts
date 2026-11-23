import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Reveal } from '../shared/motion';
import { PageHero } from '../shared/page-hero';
import { SITE } from '../shared/site';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-feedback-dashboard',
  imports: [RouterLink, ButtonDirective, Card, Message, PageHero, Reveal],
  template: `
    <app-page-hero title="Citizen Feedback Dashboard" subtitle="Feedback analytics & service satisfaction overview" />
    <section class="section" data-main tabindex="-1">
      <div class="container">
        <p-message severity="info" icon="pi pi-info-circle">Live ratings come from the Digital Gujarat feedback database and are not bundled with this demo.</p-message>
        <div class="dash-grid" appReveal="up">
          <p-card header="Overall Satisfaction"><p class="muted">Average of all five feedback questions.</p></p-card>
          <p-card header="Question Rating Ranking">
            <ul class="link-list">
              @for (q of questions; track q) { <li><i class="pi pi-star"></i> {{ q }}</li> }
            </ul>
          </p-card>
        </div>
        <div class="hero-actions">
          <a pButton routerLink="/feedback"><i class="pi pi-comment"></i> Share your feedback</a>
          <a pButton [outlined]="true" [href]="site + 'LinkPages/FeedbackDashboard.aspx'" target="_blank" rel="noopener">Open live dashboard <i class="pi pi-external-link"></i></a>
        </div>
      </div>
    </section>
  `,
})
export class FeedbackDashboardPage {
  site = SITE;
  questions = ['Service Access', 'Instructions', 'Timeliness', 'User Interface', 'Overall Experience'];
}
