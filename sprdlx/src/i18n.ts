import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "about": "About",
        "contact": "Contact"
      },
      "hero": {
        "line1": "Digital experiences",
        "line2": "Est. 2026"
      },
      "ui": {
        "sound_on": "SOUND: ON",
        "sound_off": "SOUND: OFF",
        "particles": "PARTICLES",
        "solid": "SOLID"
      },
      "about": {
        "hero_kicker": "Studio",
        "hero_title": "We shape digital experiences with intent.",
        "hero_lead": "SPRDLX is a creative web studio. We partner with designers and founders to turn bold concepts into fast, tactile interfaces — from first sketch to shipped product.",
        "story_title": "How we work",
        "story_p1": "Every project starts with clarity: who it is for, what it must feel like, and how it should behave under real use. We sit between design and engineering so neither vision nor execution gets lost in translation.",
        "story_p2": "Our stack favors the open web — React, WebGL where it earns its place, and motion that supports the story instead of distracting from it. The result is work that feels considered, not decorative.",
        "services_title": "Capabilities",
        "services_items": [
          { "title": "Creative direction", "desc": "Narrative, art direction, and interaction design for flagship sites and product launches." },
          { "title": "Immersive web", "desc": "Three.js / WebGL scenes, particle systems, and scroll-driven storytelling." },
          { "title": "Design systems", "desc": "Tokens, components, and patterns your team can extend with confidence." },
          { "title": "Build & handoff", "desc": "Production-ready front ends, performance budgets, and documentation." }
        ],
        "principles_title": "Principles",
        "principles_items": [
          { "title": "Clarity first", "desc": "Reduce noise. Make hierarchy obvious. Respect attention." },
          { "title": "Motion with purpose", "desc": "Animation guides, delights, and never blocks." },
          { "title": "Craft in the details", "desc": "Typography, spacing, and micro-interactions carry the brand." }
        ],
        "cta_title": "Have a project in mind?",
        "cta_body": "Tell us about the experience you want to build — we’ll help you get there.",
        "cta_contact": "Start a conversation",
        "back": "Back to home"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
