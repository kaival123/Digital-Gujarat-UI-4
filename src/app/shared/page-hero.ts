import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-hero',
  imports: [Breadcrumb],
  template: `
    <section class="page-hero">
      <div class="container">
        <p-breadcrumb [model]="items()" [home]="home" />
        <h1>{{ title() }}</h1>
        @if (subtitle()) { <p>{{ subtitle() }}</p> }
      </div>
    </section>
  `,
})
export class PageHero {
  title = input.required<string>();
  subtitle = input('');
  /** Breadcrumb trail below Home, e.g. [{ label: 'Services' }, { label: 'Citizen' }]. */
  trail = input<MenuItem[]>([]);
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  items = computed<MenuItem[]>(() => [...this.trail(), { label: this.title() }]);
}
