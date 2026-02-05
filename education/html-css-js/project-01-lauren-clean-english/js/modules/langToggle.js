const content = {
  pl: {
    'header.cta': 'Umów lekcję',
    'hero.eyebrow': 'Nauka, która daje spokój i wynik',
    'hero.title': 'Lauren – Clean English. Klarowny plan, mierzalny progres.',
    'hero.subtitle':
      'Indywidualne lekcje, konwersacje i egzaminacyjny focus. Łączę analityczne podejście z empatią, abyś uczył/a się szybciej i pewniej.',
    'hero.primary': 'Zapisz się na konsultację',
    'hero.secondary': 'Zobacz materiały'
  },
  en: {
    'header.cta': 'Book a lesson',
    'hero.eyebrow': 'Learning that feels calm and measurable',
    'hero.title': 'Lauren – Clean English. Clear plan, measurable progress.',
    'hero.subtitle':
      'Personal tutoring, conversations, and exam preparation. I blend analytical thinking with empathy so you learn faster and with confidence.',
    'hero.primary': 'Schedule a consultation',
    'hero.secondary': 'Explore resources'
  }
};

export const initLangToggle = () => {
  const toggle = document.querySelector('[data-lang-toggle]');
  const label = document.querySelector('[data-lang-label]');
  if (!toggle || !label) return;

  let current = 'pl';

  const apply = () => {
    document.documentElement.lang = current;
    label.textContent = current.toUpperCase();
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.dataset.i18n;
      if (content[current][key]) {
        node.textContent = content[current][key];
      }
    });
  };

  toggle.addEventListener('click', () => {
    current = current === 'pl' ? 'en' : 'pl';
    apply();
  });

  apply();
};
