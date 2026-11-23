import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, effect, inject, input, output, signal, viewChild, viewChildren } from '@angular/core';

export interface GlimpseItem { title: string; img: string; }

/**
 * "Timed cards" slider: a strip of upcoming cards sits bottom-right of a full-bleed stage; when the slide changes the next
 * card grows from its own slot to fill the stage while the previous picture zooms out behind it.
 * Autoplay is driven by the progress line (its animation end advances the slide), so the line and the timer can never drift.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-glimpse-slider',
  host: { '[class.is-paused]': 'paused() || hover()', '[class.no-auto]': '!autoplay()' },
  template: `
    <div class="gs" #stage role="region" aria-roledescription="carousel" aria-label="Glimpses of Gujarat" tabindex="0"
      (keydown.arrowleft)="step(-1)" (keydown.arrowright)="step(1)"
      (mouseenter)="hover.set(true)" (mouseleave)="hover.set(false)" (focusin)="hover.set(true)" (focusout)="hover.set(false)"
      (pointerdown)="down($event)" (pointerup)="up($event)" (pointercancel)="startX = null">
      <div class="gs-layers">
        @for (g of items(); track g.title; let i = $index) {
          <figure class="gs-layer is-hidden" #layer [attr.aria-hidden]="i !== active()">
            <img class="gs-bg" [src]="g.img" alt="" aria-hidden="true" draggable="false">
            <img class="gs-photo" [src]="g.img" [alt]="g.title" [attr.loading]="i === 0 ? 'eager' : 'lazy'" draggable="false">
            <figcaption class="gs-caption">
              <span class="gs-kicker">Glimpses of Gujarat</span>
              <h3 class="gs-title">{{ g.title }}</h3>
              <button type="button" class="gs-view" [attr.aria-label]="'View ' + g.title + ' full size'" [tabIndex]="i === active() ? 0 : -1" (click)="view.emit(g)"><i class="pi pi-expand" aria-hidden="true"></i><span>View photo</span></button>
            </figcaption>
          </figure>
        }
      </div>

      <div class="gs-strip" aria-label="Choose a photo">
        @for (g of items(); track g.title; let i = $index) {
          <button type="button" class="gs-card" #card [class.snap]="i === snapped()" [style.--slot]="slot(i)" [attr.data-slot]="slot(i)" [attr.aria-label]="'Show ' + g.title" [attr.aria-current]="i === active()" [tabIndex]="slot(i) === 0 ? -1 : 0" (click)="go(i)">
            <img [src]="g.img" alt="" loading="lazy" draggable="false">
            <span class="gs-card-title">{{ g.title }}</span>
          </button>
        }
      </div>

      <div class="gs-nav">
        <div class="gs-arrows">
          <button type="button" class="gs-arrow" aria-label="Previous photo" (click)="step(-1)"><i class="pi pi-arrow-left" aria-hidden="true"></i></button>
          <button type="button" class="gs-arrow" aria-label="Next photo" (click)="step(1)"><i class="pi pi-arrow-right" aria-hidden="true"></i></button>
        </div>
        <div class="gs-progress" aria-hidden="true">
          <span class="gs-track"></span>
          <span class="gs-line" #line (animationend)="onLineEnd()"></span>
        </div>
        <p class="gs-count" aria-live="off"><b>{{ active() + 1 }}</b> / {{ items().length }}</p>
      </div>
    </div>
  `,
})
export class GlimpseSlider {
  items = input.required<GlimpseItem[]>();
  /** true while something else (e.g. the lightbox) wants the slider to hold still */
  paused = input(false);
  /** false for reduced-motion / "pause animation" users: no timer, no growing animation */
  autoplay = input(true);
  view = output<GlimpseItem>();

  active = signal(0);
  snapped = signal(-1);
  hover = signal(false);
  startX: number | null = null;

  private layers = viewChildren<ElementRef<HTMLElement>>('layer');
  private cards = viewChildren<ElementRef<HTMLElement>>('card');
  private line = viewChild<ElementRef<HTMLElement>>('line');
  private top = -1;
  private bottom = -1;
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
    // first picture appears as soon as the view exists; afterwards restart the progress line whenever autoplay is toggled
    effect(() => {
      const ls = this.layers();
      if (ls.length && this.top < 0) { this.top = 0; ls[0].nativeElement.classList.replace('is-hidden', 'is-top'); ls[0].nativeElement.classList.add('is-text'); this.restartLine(); }
    });
    effect(() => { this.autoplay(); this.restartLine(); });
  }

  /** position in the strip relative to the active card: 0 = active (hidden), 1 = next up … */
  slot(i: number) { const n = this.items().length; return (i - this.active() + n) % n; }

  step(d: number) { const n = this.items().length; this.go((this.active() + d + n) % n); }

  go(target: number) {
    const n = this.items().length;
    if (target === this.active() || n < 2) return;
    const layers = this.layers().map((l) => l.nativeElement);
    const next = layers[target];
    const cardEl = this.cards()[target]?.nativeElement;
    const stage = next.parentElement!.getBoundingClientRect();
    const from = cardEl?.getBoundingClientRect();

    clearTimeout(this.timer);
    layers.forEach((l, i) => { if (i !== this.top && i !== target) { l.classList.remove('is-top', 'is-bottom', 'is-growing', 'is-text'); l.classList.add('is-hidden'); } });
    const prevTop = layers[this.top];
    if (prevTop) { prevTop.classList.remove('is-top', 'is-text', 'is-growing'); prevTop.classList.add('is-bottom'); }

    const animate = this.autoplay() && !!from && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    next.classList.remove('is-hidden', 'is-bottom', 'is-text');
    if (animate) {
      // start exactly on top of the card the user clicked / is about to see, then let CSS transition to full size
      next.style.transition = 'none';
      Object.assign(next.style, { left: from.left - stage.left + 'px', top: from.top - stage.top + 'px', width: from.width + 'px', height: from.height + 'px', borderRadius: '18px' });
      next.classList.add('is-top', 'is-growing');
      void next.offsetWidth;
      next.style.transition = '';
      Object.assign(next.style, { left: '', top: '', width: '', height: '', borderRadius: '' });
      this.timer = setTimeout(() => this.finishGrow(next), 1000);
    } else {
      next.classList.add('is-top', 'is-text');
    }

    // the card that was active jumps (invisibly) to the end of the strip instead of sliding across it
    this.snapped.set(this.active());
    this.top = target;
    this.active.set(target);
    this.restartLine();
  }

  private finishGrow(el: HTMLElement) { el.classList.remove('is-growing'); el.classList.add('is-text'); }

  private restartLine() {
    const el = this.line()?.nativeElement;
    if (!el) return;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  }

  onLineEnd() { if (this.autoplay() && !this.paused()) this.step(1); }

  down(e: PointerEvent) { this.startX = e.pointerType === 'mouse' ? null : e.clientX; }
  up(e: PointerEvent) {
    if (this.startX === null) return;
    const dx = e.clientX - this.startX;
    this.startX = null;
    if (Math.abs(dx) > 40) this.step(dx < 0 ? 1 : -1);
  }
}
