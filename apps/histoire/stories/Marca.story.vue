<script setup lang="ts">
import { TxBrandLockup } from "@textone-com/vue";
import faviconUrl from "../public/favicon.svg?url";
import logoSvg from "../public/logo.svg?raw";

/*
 * The brand as the manual describes it (Manual de Marca v2.1, 2026): who Text One is, how the
 * mark was thought out and the rules that keep it recognisable. Slide numbers cite the manual.
 */

// The T's own paths, so the construction drawing is the real logo, not a copy of it.
const tPaths = logoSvg.slice(logoSvg.indexOf("<path"), logoSvg.lastIndexOf("</g>"));
const mark = `<g transform="translate(-29.710842,1091.962179) scale(0.1,-0.1)" fill="#431581" stroke="#431581" stroke-width="50">${tPaths}</g>`;

const values = [
  {
    name: "Pedagogical rigour",
    text: "Every series follows a clear, curriculum-aligned teaching approach — not generic content with our cover on it.",
  },
  {
    name: "Closeness",
    text: "Clear, warm language for teachers, families and students. Never corporate, never cold.",
  },
  {
    name: "Support",
    text: "We don't sell a book: we support its implementation with teacher guides, platforms and direct advice.",
  },
  {
    name: "Growth",
    text: "“Hacen crecer”: learning as a long-term process, not an immediate result.",
  },
];

const audiences = [
  {
    tag: "Primary",
    name: "Schools and teachers",
    text: "They evaluate and adopt complete series. A consultative decision: the hook is downloadable content and the advisor's support.",
  },
  {
    tag: "Secondary",
    name: "Families",
    text: "They support learning at home and want clarity on which materials their child needs and how to use them — no jargon.",
  },
  {
    tag: "Secondary",
    name: "Students",
    text: "The books' end users. A series must feel clear, engaging and easy to follow, even if they don't choose it.",
  },
];

const traits = [
  { name: "Cálida", en: "Warm", lead: true },
  { name: "Confiable", en: "Reliable", lead: false },
  { name: "Clara", en: "Clear", lead: false },
  { name: "Cercana", en: "Close", lead: true },
  { name: "Comprometida", en: "Committed", lead: false },
];
// Where the manual's sliders sit (slide 8), from the left word to the right one.
const scales = [
  { from: "Formal", to: "Close", at: 78 },
  { from: "Serious", to: "Playful", at: 40 },
  { from: "Technical", to: "Simple", at: 81 },
];

const voice = [
  {
    yes: "Cuéntanos sobre tu institución y te presentaremos las series que mejor se adapten.",
    no: "¡Compra ahora y obtén un descuento especial!",
    why: "An invitation, never a hard sell.",
  },
  {
    yes: "Resolver problemas es entender el mundo.",
    no: "La serie de matemáticas más innovadora del mercado.",
    why: "Show, don't claim: no empty adjectives.",
  },
  {
    yes: "Serie alineada al currículo nacional, con evaluación formativa por unidad.",
    no: "Contenido de calidad premium para tu hijo.",
    why: "Clarity over grandiloquence.",
  },
];

const misuse = [
  { label: "Don't distort the proportions", style: { transform: "scaleX(1.45)" } },
  { label: "Don't recolour outside the palette", style: { "--accent": "#d9582b", "--brand-700": "#d9582b", "--brand-300": "#d9582b" } },
  { label: "Don't rotate or slant it", style: { transform: "rotate(-12deg)" } },
  { label: "Don't use it on low contrast", style: { "--accent": "#5e377e", "--brand-700": "#5e377e", "--brand-300": "#5e377e" }, bg: "#4a2668" },
];
</script>

<template>
  <Story title="Brand" group="fundamentos" :layout="{ type: 'single', iframe: true }">
    <div class="brand">
      <!-- 1. Who we are -->
      <section class="hero">
        <p class="tx-eyebrow">Brand manual v2.1 · 2026</p>
        <TxBrandLockup :size="30" />
        <p class="lead">
          Text One is a school textbook publisher in Bogotá, Colombia, for preschool, primary and
          secondary. We design complete series — student book, workbook, teacher guide and digital
          platform — to support schools as they put the curriculum into practice.
        </p>
      </section>

      <section class="trio">
        <article>
          <h3>Mission</h3>
          <p>
            “A good textbook doesn't just teach: it accompanies. We create series that put
            understanding and critical thinking ahead of memorisation.”
          </p>
        </article>
        <article>
          <h3>Vision</h3>
          <p>
            “To be the reference publisher for Colombian schools looking for curriculum-aligned
            series with real pedagogical support.”
          </p>
        </article>
        <article class="dark">
          <h3>Positioning</h3>
          <p>
            “We treat schools as partners, not customers: series with a clear teaching approach,
            complete teacher guides and advisors who support the decision.”
          </p>
        </article>
      </section>

      <!-- 2. How the mark was thought out -->
      <section>
        <h2 class="tx-title tx-title--2">The mark</h2>
        <p class="intro">
          It came out of a brand exploration (based on its third alternative): one serif letter
          that says the name twice and the trade once.
        </p>
        <div class="construction">
          <svg viewBox="-900 -60 2800 1160" role="img" aria-label="The T of the logo, annotated">
            <g class="mark" v-html="mark" />
            <g class="call">
              <circle cx="640" cy="150" r="16" />
              <path d="M656 150 H 1000" />
              <text x="1030" y="130">Pages of an open book</text>
              <text x="1030" y="205" class="sub">The T drawn as a quill or a leaf</text>

              <circle cx="250" cy="470" r="16" />
              <path d="M234 470 H -80" />
              <text x="-110" y="450" text-anchor="end">A “1” in the stem</text>
              <text x="-110" y="525" text-anchor="end" class="sub">T + 1: Text One</text>

              <circle cx="60" cy="300" r="16" />
              <path d="M44 300 H -80" />
              <text x="-110" y="280" text-anchor="end">A serif T</text>
              <text x="-110" y="355" text-anchor="end" class="sub">Editorial, in #431581</text>

              <circle cx="560" cy="960" r="16" />
              <path d="M576 960 H 1000" />
              <text x="1030" y="940">Optical weight</text>
              <text x="1030" y="1015" class="sub">Thicker at favicon size</text>
            </g>
          </svg>
          <ul class="facts">
            <li>
              <b>Icon</b> — a “T” drawn as a quill or leaf, in institutional purple. It works alone
              as an app mark or favicon.
            </li>
            <li>
              <b>Wordmark</b> — “TEXT ONE” in Plus Jakarta Sans ExtraBold, then a thin rule and
              “.com” in Medium weight.
            </li>
            <li>
              <b>Optical weight</b> — the icon's line reads thinner at small sizes, so it is
              thickened a little for the favicon and avatar: today a white outline around the T.
            </li>
          </ul>
        </div>
      </section>

      <!-- 3. Versions -->
      <section>
        <h2 class="tx-title tx-title--2">Versions</h2>
        <div class="versions">
          <figure>
            <div class="stage"><TxBrandLockup :size="20" /></div>
            <figcaption><b>Horizontal lockup</b> — the main use: headers, letterheads, email signatures.</figcaption>
          </figure>
          <figure>
            <div class="stage"><TxBrandLockup :size="30" icon-only /></div>
            <figcaption><b>Icon alone</b> — avatars, social media, small or square spaces.</figcaption>
          </figure>
          <figure>
            <div class="stage split">
              <span class="light"><img :src="faviconUrl" alt="" width="40" height="40" /></span>
              <span class="night"><img :src="faviconUrl" alt="" width="40" height="40" /></span>
            </div>
            <figcaption><b>Favicon</b> — the purple T with a white outline, so it reads on light and dark tabs alike.</figcaption>
          </figure>
        </div>
        <p class="note">
          The logo works on white, cream or purple, with no boxes or leftover white backgrounds.
          Never recolour it outside the institutional palette.
        </p>
      </section>

      <!-- 4. Clear space and minimum size -->
      <section>
        <h2 class="tx-title tx-title--2">Clear space and minimum size</h2>
        <div class="space">
          <div class="safe"><TxBrandLockup :size="20" /></div>
          <div>
            <p>
              The breathing room around the logo equals the height of the icon's T: no text, border
              or graphic enters it. In digital, the horizontal lockup never goes below
              <b>120 px</b> wide, and the icon alone never below <b>24 px</b>.
            </p>
            <div class="sizes">
              <span v-for="s in [24, 40, 64]" :key="s">
                <TxBrandLockup :size="s / 2.2" icon-only />
                <small>{{ s }} px{{ s === 24 ? " minimum" : s === 40 ? " favicon" : " header" }}</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Misuse -->
      <section>
        <h2 class="tx-title tx-title--2">Don't</h2>
        <div class="misuse">
          <figure v-for="m in misuse" :key="m.label">
            <div class="stage" :style="{ background: m.bg }">
              <TxBrandLockup :size="16" :style="m.style" />
            </div>
            <figcaption><span aria-hidden="true">✕</span> {{ m.label }}</figcaption>
          </figure>
        </div>
      </section>

      <!-- 6. Colour and type, in short -->
      <section class="pair">
        <article>
          <h2 class="tx-title tx-title--3">Colour</h2>
          <p>
            Institutional purple (<code>brand-700</code> #431581, the T itself) and cream for
            paper and backgrounds. Approved pairs:
          </p>
          <div class="pairs">
            <span style="background: #fff; color: #431581">Purple / white</span>
            <span style="background: #faf7ef; color: #431581">Purple / cream</span>
            <span style="background: #431581; color: #fff">White / purple</span>
          </div>
          <p class="small">
            Don't use <code>brand-300</code> (#876ba2) for body text on anything but pure white:
            it drops below AA. The full ramp is in <b>Colors</b>.
          </p>
        </article>
        <article>
          <h2 class="tx-title tx-title--3">Type</h2>
          <p class="fraunces">Textos escolares que hacen crecer</p>
          <p class="small">
            <b>Fraunces</b> for titles and brand moments — a serif with editorial character.
            <b>Plus Jakarta Sans</b> for body text and UI — geometric, clear, functional. More in
            <b>Typography</b>.
          </p>
        </article>
      </section>

      <!-- 7. Values and audiences -->
      <section>
        <h2 class="tx-title tx-title--2">What guides us</h2>
        <div class="cards">
          <article v-for="(v, i) in values" :key="v.name" :class="{ dark: i === 0 || i === 3 }">
            <span class="num">0{{ i + 1 }}</span>
            <h3>{{ v.name }}</h3>
            <p>{{ v.text }}</p>
          </article>
        </div>
      </section>

      <section>
        <h2 class="tx-title tx-title--2">Who we speak to</h2>
        <p class="intro">Every piece has to work for three audiences, with one tone underneath.</p>
        <div class="cards three">
          <article v-for="(a, i) in audiences" :key="a.name" :class="{ dark: i === 0 }">
            <span class="tag">{{ a.tag }}</span>
            <h3>{{ a.name }}</h3>
            <p>{{ a.text }}</p>
          </article>
        </div>
      </section>

      <!-- 8. Personality and voice -->
      <section class="pair">
        <article>
          <h2 class="tx-title tx-title--3">Personality</h2>
          <div class="traits">
            <span v-for="t in traits" :key="t.name" :class="{ lead: t.lead }" :title="t.en">{{ t.name }}</span>
          </div>
          <div v-for="s in scales" :key="s.from" class="scale">
            <div class="ends"><span>{{ s.from }}</span><span>{{ s.to }}</span></div>
            <div class="track"><i :style="{ left: `${s.at}%` }" /></div>
          </div>
        </article>
        <article>
          <h2 class="tx-title tx-title--3">Voice</h2>
          <ol class="rules">
            <li>We speak to people, not to abstract institutions.</li>
            <li>Clarity over grandiloquence.</li>
            <li>A call to action is an invitation, never a hard sell.</li>
            <li>We show rather than claim: no empty adjectives.</li>
          </ol>
        </article>
      </section>

      <section>
        <div class="voice">
          <div v-for="v in voice" :key="v.yes" class="row">
            <p class="yes"><span aria-label="Yes">✓</span> “{{ v.yes }}”</p>
            <p class="no"><span aria-label="No">✕</span> “{{ v.no }}”</p>
            <p class="why">{{ v.why }}</p>
          </div>
        </div>
      </section>

      <!-- 9. Imagery -->
      <section class="pair">
        <article>
          <h2 class="tx-title tx-title--3">Iconography</h2>
          <p class="small">
            No set of our own yet. The direction: simple line, 2 px stroke, rounded corners, no fill
            — in step with the logo's line. Avoid illustrative sets, emoji or multicoloured icons.
          </p>
        </article>
        <article>
          <h2 class="tx-title tx-title--3">Photography</h2>
          <p class="small">
            Real classroom photography: teachers, students and families in a Colombian setting,
            natural light, warm tones. Stock placeholders are to be replaced with real photos or
            real cover art.
          </p>
        </article>
      </section>
    </div>
  </Story>
</template>

<style scoped>
.brand {
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 1040px;
  padding: 8px 4px 32px;
  color: var(--ink);
}
section > .tx-title {
  margin: 0 0 10px;
}
.intro,
.note,
.small {
  color: var(--ink-secondary);
  font-size: 14px;
  line-height: 1.6;
  max-width: 70ch;
}
.note {
  margin-top: 12px;
}
.hero {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.hero .lead {
  font-size: 16px;
  line-height: 1.6;
  max-width: 68ch;
  color: var(--ink);
  margin: 0;
}

/* Mission, vision, positioning; values; audiences — cards, a few on purple */
.trio,
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}
.trio,
.cards.three {
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
}
.trio article,
.cards article {
  border: 1px solid var(--rule);
  border-radius: var(--radius-md, 14px);
  background: var(--surface);
  padding: 18px 18px 16px;
}
.trio h3,
.cards h3 {
  margin: 4px 0 6px;
  font-size: 15px;
  font-weight: 700;
}
.trio p,
.cards p {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--ink-secondary);
}
.trio article.dark,
.cards article.dark {
  background: #431581;
  border-color: #431581;
}
.trio article.dark *,
.cards article.dark * {
  color: #fff;
}
.trio article.dark p,
.cards article.dark p {
  color: #e3d7f1;
}
.num {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 600;
  color: var(--accent);
  opacity: 0.35;
}
.tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--accent);
}

/* The annotated T */
.construction {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: center;
  /* Always the manual's cream, in either theme: the drawing is the purple T itself. */
  background: #faf7ef;
  border: 1px solid #e3d7f1;
  border-radius: var(--radius-md, 14px);
  padding: 20px;
}
@media (max-width: 720px) {
  .construction {
    grid-template-columns: 1fr;
  }
}
.construction svg {
  width: 100%;
  height: auto;
}
.call circle {
  fill: none;
  stroke: #5e377e;
  stroke-width: 6;
}
.call path {
  stroke: #5e377e;
  stroke-width: 4;
  stroke-dasharray: 10 8;
}
.call text {
  font-family: "Plus Jakarta Sans", sans-serif;
  font-size: 64px;
  font-weight: 700;
  fill: #2c0e56;
}
.call text.sub {
  font-size: 50px;
  font-weight: 500;
  fill: #5e377e;
}
.facts {
  margin: 0;
  padding-left: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 10px 28px;
  font-size: 13.5px;
  line-height: 1.55;
  color: #5e377e;
}
.facts b {
  color: #2c0e56;
}

/* Versions and misuse: one stage per example */
.versions,
.misuse {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
figure {
  margin: 0;
  border: 1px solid var(--rule);
  border-radius: var(--radius-md, 14px);
  overflow: hidden;
  background: var(--surface);
}
.stage {
  height: 120px;
  display: grid;
  place-items: center;
  background: var(--canvas);
}
.stage.split {
  grid-template-columns: 1fr 1fr;
  padding: 0;
}
.stage.split span {
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
}
.stage.split .light {
  background: #f1f3f4;
}
.stage.split .night {
  background: #202124;
}
figcaption {
  padding: 10px 12px;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--ink-secondary);
  border-top: 1px solid var(--rule);
}
figcaption b {
  color: var(--ink);
}
.misuse figcaption span {
  color: var(--danger-700, #b42318);
  font-weight: 800;
  margin-right: 4px;
}

/* Clear space */
.space {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 28px;
  align-items: center;
}
@media (max-width: 720px) {
  .space {
    grid-template-columns: 1fr;
  }
}
.safe {
  padding: 40px;
  outline: 2px dashed var(--accent);
  outline-offset: -2px;
  border-radius: 8px;
  background: var(--canvas);
}
.space p {
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-secondary);
}
.space b {
  color: var(--ink);
}
.sizes {
  display: flex;
  gap: 28px;
  align-items: flex-end;
}
.sizes span {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.sizes small {
  font-size: 11px;
  color: var(--ink-secondary);
}

/* Colour, type, personality, voice, imagery: two columns */
.pair {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
}
.pair article > p {
  margin: 0 0 10px;
  font-size: 14px;
  line-height: 1.6;
}
.pairs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}
.pairs span {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--rule);
  font-weight: 700;
  font-size: 13px;
}
.pair article > p.fraunces {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 600;
  line-height: 1.15;
  color: var(--accent);
}
.traits {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 18px;
}
.traits span {
  padding: 10px;
  text-align: center;
  border-radius: 8px;
  font-family: var(--font-display);
  font-weight: 600;
  background: var(--surface-sunken);
  color: var(--accent);
}
.traits span:last-child {
  grid-column: 1 / -1;
}
.traits span.lead {
  background: #431581;
  color: #fff;
}
.scale {
  margin-bottom: 14px;
}
.ends {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-secondary);
  margin-bottom: 6px;
}
.track {
  position: relative;
  height: 6px;
  border-radius: 3px;
  background: var(--surface-sunken);
}
.track i {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  transform: translate(-50%, -50%);
}
.rules {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  line-height: 1.5;
}
.voice {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.voice .row {
  display: grid;
  grid-template-columns: 1fr 1fr minmax(160px, 0.6fr);
  gap: 8px;
}
@media (max-width: 720px) {
  .voice .row {
    grid-template-columns: 1fr;
  }
}
.voice p {
  margin: 0;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.5;
}
.voice .yes {
  background: var(--success-50, #ecf7f1);
  color: var(--success-700, #1f6b4f);
}
.voice .no {
  background: var(--danger-50, #fdeeee);
  color: var(--danger-700, #b42318);
}
.voice .why {
  color: var(--ink-secondary);
  font-style: italic;
}
.voice span {
  font-weight: 800;
  margin-right: 4px;
}
code {
  font-size: 12px;
}
</style>

<docs lang="md">
# Brand

The brand as the **Manual de Marca v2.1 (2026)** describes it: who Text One is, how the mark
was thought out, and the rules that keep it recognisable. Everything in the design system
follows from here.

## The mark

- **Icon** — a serif **T** drawn as a quill or leaf, in institutional purple (`#431581`).
  Pages of an open book rise from its crossbar, and a **“1”** sits in its stem: **T + 1, Text
  One**. It came out of a brand exploration (its third alternative) and works alone as an app
  mark or favicon.
- **Wordmark** — **TEXT ONE** in Plus Jakarta Sans ExtraBold, a thin rule, and **.com** in
  Medium. `TxBrandLockup` draws it.
- **Optical weight** — the icon reads thinner when small, so the favicon and avatar get a little
  more weight: a white outline around the T, which also lets it read on dark tabs.

## Rules

| | |
|---|---|
| Clear space | The height of the icon's T, all around |
| Minimum size | Lockup 120 px wide · icon 24 px (40 px favicon, 64 px header) |
| Backgrounds | White, cream or purple — no boxes, no leftover white |
| Never | Distort, recolour outside the palette, rotate or slant, use on low contrast |

## Voice

We speak to people, not institutions; clarity over grandiloquence; a call to action is an
invitation, never a hard sell; we show rather than claim. The site's copy is in Spanish — the
examples on this page are kept in the original.

**Sources:** the brand manual (slides 4–18) and the brand exploration, in the team's *Brand
reference* folder.
</docs>
