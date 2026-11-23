import { afterNextRender, Component, computed, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Counter, Reveal } from '../shared/motion';
import { GlimpseSlider } from '../shared/glimpse-slider';
import faqData from '../data/faq.json';
import { SearchService } from '../shared/search.service';
import citizenData from '../data/citizen.json';
import sugamData from '../data/sugam.json';
import dssData from '../data/dss.json';
import jansevaData from '../data/janseva.json';
import linkedData from '../data/linked.json';
import videoData from '../data/videos.json';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Carousel } from 'primeng/carousel';
import { DatePicker } from 'primeng/datepicker';
import { Image } from 'primeng/image';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { A, SITE } from '../shared/site';
import { A11yService } from '../shared/a11y.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  imports: [FormsModule, RouterLink, ButtonDirective, Carousel, DatePicker, Image, Tag, Tooltip, Reveal, Counter, GlimpseSlider, Accordion, AccordionPanel, AccordionHeader, AccordionContent],
  templateUrl: './home.html',
})
export class HomePage {
  readonly site = SITE;
  searchSvc = inject(SearchService);

  private pick = (items: { title: string; img: string }[], n = 8) => items.slice(0, n).map((i) => ({ title: i.title, img: A + 'site/' + encodeURI(i.img) }));

  explorer = [
    { key: 'citizen', label: 'Citizen', icon: 'pi pi-users', route: '/services/citizen', total: citizenData.length, items: this.pick(citizenData), blurb: 'Certificates, passes and everyday documents.' },
    { key: 'sugam', label: 'Sugam', icon: 'pi pi-bolt', route: '/sugam-digital-gujarat', total: sugamData.length, items: this.pick(sugamData), blurb: 'Caste, income and ration card services — fully online.' },
    { key: 'dss', label: 'Digital SevaSetu', icon: 'pi pi-briefcase', route: '/services/digital-sevasetu', total: dssData.length, items: this.pick(dssData), blurb: 'Department schemes and subsidies.' },
    { key: 'janseva', label: 'Janseva', icon: 'pi pi-building', route: '/services/janseva', total: jansevaData.length, items: this.pick(jansevaData), blurb: 'Affidavits and services from Janseva Kendras.' },
  ];

  faqs = faqData.slice(0, 4);
  cat = signal('citizen');
  catData = computed(() => this.explorer.find((c) => c.key === this.cat()) ?? this.explorer[0]);

  facts = [
    { value: citizenData.length + sugamData.length + dssData.length + jansevaData.length + '+', label: 'Services online' },
    { value: linkedData.rows.length + '', label: 'Linked dept. services' },
    { value: '10–6', label: 'Helpdesk, 7 days' },
  ];

  quick = [
    { icon: 'pi pi-users', label: 'Citizen', sub: 'Certificates and passes', route: '/services/citizen' },
    { icon: 'pi pi-bolt', label: 'Sugam', sub: 'Online in minutes', route: '/sugam-digital-gujarat' },
    { icon: 'pi pi-building', label: 'Janseva', sub: 'Kendra services', route: '/services/janseva' },
    { icon: 'pi pi-file-pdf', label: 'Manuals', sub: 'Step-by-step PDFs', route: '/user-manual' },
    { icon: 'pi pi-headphones', label: 'Help', sub: '10 AM to 6 PM daily', route: '/help-desk' },
  ];

  ticker = [
    'Post-Matric Scholarship 2026-27: SC students re-open 01/10/2026 – 31/10/2026',
    'ST students: applications for 2026-27 open 01/09/2026 – 30/11/2026',
    'Scholarship services also available at gssp.gujarat.gov.in',
    'Use the SANDES app to get Digital Gujarat login OTPs instantly',
  ];

  stats = [
    { icon: 'pi pi-th-large', value: citizenData.length + sugamData.length + dssData.length + jansevaData.length, suffix: '+', label: 'Services online' },
    { icon: 'pi pi-link', value: linkedData.rows.length, suffix: '', label: 'Linked department services' },
    { icon: 'pi pi-video', value: videoData.length, suffix: '', label: 'Video tutorials' },
    { icon: 'pi pi-users', value: 486718029, suffix: '', label: 'Portal visitors' },
  ];

  steps = [
    { icon: 'pi pi-user-plus', title: 'Register', text: "Click Login / Register and choose Citizen Login. You'll be taken to the Citizen SSO portal." },
    { icon: 'pi pi-search', title: 'Choose a service', text: 'Search or browse certificates, schemes and scholarships — for example Income Certificate.' },
    { icon: 'pi pi-upload', title: 'Upload documents', text: 'Add proof such as salary slips or bank statements and submit your application.' },
    { icon: 'pi pi-check-circle', title: 'Track status', text: "Follow progress anytime under 'My Applications' after you log in." },
  ];

  openSearch(q = '') { this.searchSvc.show(q); }
  query = '';
  calendarDate: Date = new Date();
  today = (() => {
    const d = new Date();
    return { day: d.getDate(), weekday: d.toLocaleDateString('en-IN', { weekday: 'long' }), month: d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) };
  })();

  slides = [
    {
      title: 'Discover', accent: 'Government Schemes', rest: 'made for you',
      sub: 'Find personalised schemes based on your eligibility — in a few taps.',
      img: A + 'img/slider/hero-farmer-clean.png', shape: 'rounded',
      tab: 'Schemes for you', chip: { icon: 'pi pi-verified', text: 'Eligibility-based matching' }, fit: 'cover',
    },
    {
      title: 'One Stop', accent: 'Platform', rest: 'for every service',
      sub: 'Access, apply and track government schemes and application status effortlessly.',
      img: A + 'img/slider/hero-team-clean.png', shape: 'circle',
      tab: 'One platform', chip: { icon: 'pi pi-shield', text: 'Single secure SSO login' }, fit: 'cover',
    },
    {
      title: 'Skip the queue,', accent: 'apply from home', rest: '',
      sub: 'Income, caste and ration card services — fully online, tracked end to end.',
      img: A + 'img/standeebuspanel/standeedesign.jpeg', shape: 'rounded',
      tab: 'Apply online', chip: { icon: 'pi pi-clock', text: 'Track every application' }, fit: 'top',
    },
  ];

  services = [
    { title: 'Citizen Services', icon: A + 'img/icon/citizenservice.svg', route: '/services/citizen' },
    { title: 'Digital SevaSetu Services', icon: A + 'img/icon/digitalsevasetu.svg', route: '/services/digital-sevasetu' },
    { title: 'Janseva Services', icon: A + 'img/icon/jansevaservice.svg', route: '/services/janseva' },
    { title: 'Scholarship Services', icon: A + 'img/icon/scholarship.svg', url: 'https://gssp.gujarat.gov.in/' },
    { title: 'Linked Services', icon: A + 'img/icon/eolservice.svg', route: '/services/linked' },
  ];

  trending = [
    { rank: '01', title: 'Income Certificate', img: A + 'citizen/Income.png' },
    { rank: '02', title: 'Addition of Name in Ration Card', img: A + 'citizen/AddName_RC.png' },
    { rank: '03', title: 'Widow Certificate', img: A + 'citizen/Widow.png' },
    { rank: '04', title: 'Domicile Certificate (By Birth)', img: A + 'citizen/Domicile.png' },
    { rank: '05', title: 'Senior Citizen Certificate', img: A + 'citizen/SeniorCitizen.png' },
  ];

  perks = [
    { icon: 'pi pi-home', text: 'Apply from home — skip the office queue' },
    { icon: 'pi pi-file-check', text: 'Income, caste and domicile certificates' },
    { icon: 'pi pi-id-card', text: 'Ration card services and 20+ essential services online' },
    { icon: 'pi pi-mobile', text: 'Track your application status anytime' },
  ];



  a11y = inject(A11yService);
  /* ---- hero: 3D glass-slab slider. The slides are doubled into a ring of 4 so the wrap-around always happens
     off-stage; copies are aria-hidden + inert, so assistive tech and Tab only ever see the real slides. ---- */
  readonly heroMs = 7000;
  heroRing = [...this.slides, ...this.slides];
  heroIdx = signal(0);
  heroPaused = signal(false);
  heroAuto = computed(() => this.heroReady() && !this.a11y.motionOff() && !this.heroPaused());
  private heroTimer = effect((onCleanup) => {
    this.heroIdx();
    if (!this.heroAuto()) return;
    const t = setTimeout(() => this.heroGo(1), this.heroMs);
    onCleanup(() => clearTimeout(t));
  });
  private heroX = 0;
  heroOffset(i: number) {
    const m = this.heroRing.length;
    let o = (((i - this.heroIdx()) % m) + m) % m;
    if (o > m / 2) o -= m;
    return o;
  }
  heroGo(d: number) { const m = this.heroRing.length; this.heroIdx.update((v) => (((v + d) % m) + m) % m); }
  heroDot(n: number) { const cur = this.heroIdx() % this.slides.length; this.heroGo(n - cur); }
  /* slabs must not glide into place on first paint: enable their transitions only once the page loader has gone */
  heroReady = signal(false);
  private heroReadyInit = afterNextRender(() => {
    const el = document.documentElement;
    const go = () => { if (!el.classList.contains('al-loading')) { obs.disconnect(); requestAnimationFrame(() => requestAnimationFrame(() => this.heroReady.set(true))); } };
    const obs = new MutationObserver(go);
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    go();
  });
  heroDown(e: PointerEvent) { this.heroX = e.clientX; }
  heroUp(e: PointerEvent) { const dx = e.clientX - this.heroX; if (Math.abs(dx) > 50) this.heroGo(dx < 0 ? 1 : -1); }
  heroKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') { this.heroGo(1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { this.heroGo(-1); e.preventDefault(); }
  }
  private lastFocus: HTMLElement | null = null;

  viewer = signal<{ title: string; img: string } | null>(null);
  zoom = signal(1);
  rot = signal(0);
  openViewer(g: { title: string; img: string }) {
    this.lastFocus = document.activeElement as HTMLElement | null;
    this.zoom.set(1); this.rot.set(0); this.viewer.set(g);
    setTimeout(() => document.querySelector<HTMLElement>(".lightbox-tools button:last-child")?.focus(), 30);
  }
  closeViewer() { this.viewer.set(null); this.lastFocus?.focus(); }
  zoomBy(d: number) { this.zoom.update((z) => Math.min(4, Math.max(0.3, +(z + d).toFixed(2)))); }
  rotateBy(d: number) { this.rot.update((r) => r + d); }

  glimpses = [
    { title: 'Great Ran Of Kutch', img: A + 'img/GlimpsesSlider/runnofkutch.png' },
    { title: 'Statue Of Unity', img: A + 'img/GlimpsesSlider/statueofunity.png' },
    { title: 'Kite Festival', img: A + 'img/GlimpsesSlider/kitefestival.png' },
    { title: 'Vibrant Gujarat', img: A + 'img/GlimpsesSlider/vibrant.png' },
  ];

  partners = [
    { name: 'ITU WTSA New Delhi 2024', img: A + 'img/partner/img1.png', url: 'https://www.delhiwtsa24.in/' },
    { name: 'Gujarat India', img: A + 'img/partner/img2.png', url: 'https://gujaratindia.gov.in/index' },
    { name: 'India.gov.in', img: A + 'img/partner/img3.png', url: 'https://india.gov.in/' },
    { name: 'Gujarat Tourism', img: A + 'img/partner/img4.png', url: 'https://www.gujarattourism.com/' },
    { name: 'Statue of Unity Tickets', img: A + 'img/partner/img5.png', url: 'https://www.soutickets.in/#/dashboard' },
    { name: 'Swachh Bharat Mission', img: A + 'img/partner/img6.png', url: 'https://swachhbharatmission.ddws.gov.in/' },
    { name: 'SWAGAT', img: A + 'img/partner/img7.png', url: 'https://swagat.gujarat.gov.in/' },
    { name: 'GIGW 3.0', img: A + 'img/partner/img8.png', url: 'https://guidelines.india.gov.in/new-features-of-gigw-3-0/' },
    { name: 'GIGW 3.0 Guidelines', img: A + 'img/partner/img9.png', url: 'https://guidelines.india.gov.in/new-features-of-gigw-3-0/' },
  ];

  partnersRev = this.partners.slice().reverse();

  scrollTo(e: Event) {
    e.preventDefault();
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  }

  search() {
    const q = this.query.trim();
    window.open(SITE + 'AdvanceSearch.aspx' + (q ? '?q=' + encodeURIComponent(q) : ''), '_blank', 'noopener');
  }
}
