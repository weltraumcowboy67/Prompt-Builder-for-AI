const baseFields = [
  { key: 'goal', label: 'Ziel', hint: 'Was soll die KI konkret tun?', required: true },
  { key: 'topic', label: 'Thema', hint: 'Worum geht es genau?', required: true },
  { key: 'context', label: 'Kontext', hint: 'Welche Zusatzinfos muss die KI kennen?' },
  { key: 'audience', label: 'Zielgruppe', hint: 'Für wen ist das Ergebnis gedacht?', required: true },
  { key: 'style', label: 'Stil / Ton', hint: 'Wie soll es klingen?' },
  { key: 'format', label: 'Format', hint: 'Liste, Tabelle, JSON, Markdown …', required: true },
  { key: 'length', label: 'Länge / Umfang', hint: 'Kurz, mittel, detailliert, feste Wortzahl …' },
  { key: 'constraints', label: 'Einschränkungen', hint: 'Was soll vermieden werden?' },
  { key: 'extras', label: 'Zusatzwünsche', hint: 'Sonstige Anforderungen oder Must-Haves' }
];

const typeSpecificFields = {
  text: [
    { key: 'textType', label: 'Textart', hint: 'z. B. Blog, E-Mail, Produkttext' },
    { key: 'coreMessage', label: 'Kernbotschaft', hint: 'Welche Hauptaussage soll bleiben?' },
    { key: 'cta', label: 'Call to Action', hint: 'Welche Handlung soll folgen?' }
  ],
  code: [
    { key: 'language', label: 'Programmiersprache', hint: 'z. B. JavaScript, Python, TypeScript' },
    { key: 'framework', label: 'Framework', hint: 'z. B. React, Vue, Flask' },
    { key: 'scope', label: 'Umfang', hint: 'Nur Frontend oder auch Backend?' },
    { key: 'deps', label: 'Dependencies', hint: 'Welche Libraries sind erlaubt / verboten?' }
  ],
  image: [
    { key: 'motif', label: 'Motiv', hint: 'Was soll zu sehen sein?' },
    { key: 'look', label: 'Bildstil', hint: 'fotorealistisch, Anime, 3D, …' },
    { key: 'perspective', label: 'Perspektive & Licht', hint: 'Kamerawinkel, Lichtstimmung' },
    { key: 'negative', label: 'Negativ-Prompt', hint: 'Was darf NICHT vorkommen?' }
  ],
  learning: [
    { key: 'level', label: 'Niveau', hint: 'Anfänger, Fortgeschritten, Experte' },
    { key: 'stepByStep', label: 'Schritt-für-Schritt?', hint: 'Falls ja: wie granular?' },
    { key: 'examples', label: 'Beispiele / Analogien', hint: 'Welche Art Beispiele helfen?' }
  ],
  analysis: [
    { key: 'dataType', label: 'Analyseobjekt', hint: 'Text, KPI-Daten, Konzept, Strategie …' },
    { key: 'criteria', label: 'Bewertungskriterien', hint: 'Wonach soll bewertet werden?' },
    { key: 'outputStyle', label: 'Feedback-Typ', hint: 'Kurzfazit, Tabelle, SWOT, Prioritätenliste …' }
  ]
};

const promptTypes = [
  { value: 'text', label: 'Text schreiben' },
  { value: 'image', label: 'Bild generieren' },
  { value: 'code', label: 'Code erstellen' },
  { value: 'learning', label: 'Lernen / Erklären' },
  { value: 'analysis', label: 'Analyse / Feedback' }
];

const examples = {
  text: {
    goal: 'Schreibe eine professionelle Begrüßungs-E-Mail für neue Kundinnen und Kunden.',
    topic: 'Onboarding für ein SaaS-Produkt',
    context: 'Das Produkt hilft Teams beim Projektmanagement.',
    audience: 'Neue Geschäftskunden ohne technisches Vorwissen',
    style: 'Freundlich, klar, professionell',
    format: 'Markdown mit Überschrift + 3 Abschnitte',
    length: '120-160 Wörter',
    constraints: 'Keine Emojis, keine Floskeln',
    textType: 'E-Mail',
    coreMessage: 'Schneller Start und echter Nutzen im Alltag',
    cta: 'Link zum ersten Setup-Schritt ankündigen'
  },
  code: {
    goal: 'Erstelle eine responsive Landingpage mit Hero, Features und CTA.',
    topic: 'Produktseite für eine Fitness-App',
    context: 'Nur lokales Projekt ohne Build-Tool.',
    audience: 'Mobile-first Nutzerinnen und Nutzer',
    style: 'Modern und minimalistisch',
    format: 'HTML + CSS + JavaScript getrennt',
    length: 'Kompakter, gut kommentierter Code',
    constraints: 'Kein Bootstrap, keine externen JS-Libraries',
    language: 'JavaScript',
    framework: 'Kein Framework',
    scope: 'Nur Frontend',
    deps: 'Nur Vanilla JS'
  },
  image: {
    goal: 'Generiere ein Key Visual für eine Kampagne.',
    topic: 'Nachhaltige Stadtmobilität',
    context: 'Bild wird als Header in einer Website genutzt.',
    audience: 'Junge Erwachsene in urbanen Regionen',
    style: 'Dynamisch, clean, futuristisch',
    format: 'Bildprompt mit klaren Abschnitten',
    length: 'Detailliert',
    constraints: 'Keine düsteren Farben',
    motif: 'Elektrofahrrad auf moderner Stadtstraße',
    look: 'Halb-fotorealistisch mit leichter Illustrationsnote',
    perspective: 'Golden Hour, leichte Froschperspektive',
    negative: 'Keine Autos im Vordergrund, kein Regen'
  }
};

const promptTypeSelect = document.querySelector('#promptType');
const fieldsWrapper = document.querySelector('#formFields');
const template = document.querySelector('#fieldTemplate');
const preview = document.querySelector('#promptPreview');
const copyButton = document.querySelector('#copyPrompt');
const resetButton = document.querySelector('#resetForm');
const exampleButton = document.querySelector('#loadExample');
const improveButton = document.querySelector('#improvePrompt');
const quality = document.querySelector('#qualityFeedback');

const STORAGE_KEY = 'promptwerk-state';

function initTypeOptions() {
  promptTypes.forEach((type) => {
    const option = document.createElement('option');
    option.value = type.value;
    option.textContent = type.label;
    promptTypeSelect.append(option);
  });
}

function currentFields() {
  return [...baseFields, ...(typeSpecificFields[promptTypeSelect.value] || [])];
}

function renderFields(values = {}) {
  fieldsWrapper.innerHTML = '';
  currentFields().forEach((field) => {
    const node = template.content.cloneNode(true);
    const label = node.querySelector('.field-label');
    const textarea = node.querySelector('textarea');
    const hint = node.querySelector('.hint');

    label.textContent = field.label;
    textarea.name = field.key;
    textarea.placeholder = field.required ? 'Pflichtfeld' : 'Optional';
    textarea.value = values[field.key] || '';
    hint.textContent = field.hint;

    textarea.addEventListener('input', onFormChange);
    fieldsWrapper.appendChild(node);
  });
}

function getFormData() {
  const data = { type: promptTypeSelect.value };
  fieldsWrapper.querySelectorAll('textarea').forEach((element) => {
    data[element.name] = element.value.trim();
  });
  return data;
}

function buildPrompt(data) {
  const sections = [
    ['Aufgabe', data.goal],
    ['Thema', data.topic],
    ['Kontext', data.context],
    ['Zielgruppe', data.audience],
    ['Stil', data.style],
    ['Format', data.format],
    ['Länge', data.length],
    ['Einschränkungen', data.constraints],
    ['Zusatzwünsche', data.extras]
  ];

  const extraFields = typeSpecificFields[data.type] || [];
  extraFields.forEach((field) => {
    sections.push([field.label, data[field.key]]);
  });

  const body = sections
    .filter(([, value]) => Boolean(value))
    .map(([title, value]) => `${title}:\n${value}`)
    .join('\n\n');

  return `${body}\n\nErgebnis:\nErstelle eine Antwort, die alle obigen Anforderungen vollständig erfüllt.`;
}

function qualityReport(data) {
  const missingRequired = baseFields.filter((field) => field.required && !data[field.key]);
  const hints = [];

  if (missingRequired.length) {
    hints.push(`<span class="warn">Fehlende Pflichtfelder:</span> ${missingRequired.map((f) => f.label).join(', ')}`);
  }

  if (!data.constraints) {
    hints.push('Tipp: Mit Einschränkungen wird das Ergebnis meist präziser.');
  }

  if ((data.goal || '').split(' ').length < 5) {
    hints.push('Tipp: Beschreibe das Ziel konkreter (5+ Wörter).');
  }

  if (hints.length === 0) {
    return '<strong class="ok">Qualität:</strong> Sehr solide. Der Prompt ist klar und strukturiert.';
  }

  return `<strong>Qualität:</strong> Noch ausbaufähig.<br>${hints.join('<br>')}`;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getFormData()));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function hydrate(data) {
  if (!data) return;
  if (data.type && promptTypes.some((t) => t.value === data.type)) {
    promptTypeSelect.value = data.type;
  }
  renderFields(data);
  refresh();
}

function refresh() {
  const data = getFormData();
  preview.value = buildPrompt(data);
  quality.innerHTML = qualityReport(data);
  saveState();
}

function onFormChange() {
  refresh();
}

function resetForm() {
  localStorage.removeItem(STORAGE_KEY);
  renderFields();
  refresh();
}

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(preview.value);
    copyButton.textContent = 'Kopiert ✓';
    setTimeout(() => {
      copyButton.textContent = 'Prompt kopieren';
    }, 1500);
  } catch {
    copyButton.textContent = 'Kopieren fehlgeschlagen';
    setTimeout(() => {
      copyButton.textContent = 'Prompt kopieren';
    }, 1500);
  }
}

function loadExample() {
  const type = promptTypeSelect.value;
  const sample = examples[type] || examples.text;
  renderFields(sample);
  refresh();
}

function improvePrompt() {
  const data = getFormData();

  if (!data.constraints) {
    data.constraints = 'Keine unnötigen Wiederholungen, klare Sprache, nur relevante Inhalte.';
  }

  if (!data.length) {
    data.length = 'Mittel bis ausführlich, mit klarer Struktur.';
  }

  if (!data.format) {
    data.format = 'Markdown mit Überschriften und Stichpunkten.';
  }

  renderFields(data);
  refresh();
}

promptTypeSelect.addEventListener('change', () => {
  renderFields();
  refresh();
});

copyButton.addEventListener('click', copyPrompt);
resetButton.addEventListener('click', resetForm);
exampleButton.addEventListener('click', loadExample);
improveButton.addEventListener('click', improvePrompt);

initTypeOptions();
const saved = loadState();
if (saved?.type) {
  promptTypeSelect.value = saved.type;
}
renderFields(saved || {});
refresh();
