import { useEffect, useMemo, useState } from 'react';
import { Badge } from './components/ui/badge';
import { DevelopmentAgentation } from './components/DevelopmentAgentation';
import steinbergLogo from './assets/steinberg-logo.png';
import { getContentData } from './lib/content';

const TOUR_STEPS = [
  'Willkommen',
  'Steinberg: Profil',
  'Steinberg: Geschichte',
  'Berufsbild: Überblick',
  'Kompetenzen',
  'Werkzeuge',
  'Ausbildungswege',
  'Gehaltsaussichten',
  'Trends',
  'Karriere',
  'Persönliche Reflexion',
  'Tagebuch',
  'Interviews',
  'Quiz: Webdesign',
  'Quiz: Entwicklung',
  'Quiz: Grundlagen',
  'Quiz: Zusammenarbeit',
  'Quiz: Trends',
  'Quiz-Ergebnis'
];
const TOUR_POSITION = {
  reflection: 11,
  diary: 12,
  interviews: 13,
  quizStart: 14,
  result: 19
};
const PRAKTIKUM_REFLECTIONS = [
  {
    title: 'Was mir gefallen hat',
    text: 'Mir hat besonders gefallen, dass ich verschiedene Bereiche kennenlernen und bei Gesprächen mit dem Team viele Einblicke sammeln konnte. Die offene Atmosphäre hat es mir leicht gemacht, Fragen zu stellen und neue Themen besser zu verstehen.'
  },
  {
    title: 'Was mir nicht gefallen hat',
    text: 'Nicht immer einfach war, dass viele Themen am Anfang neu waren und ich in manchen Meetings nicht sofort alles verstehen konnte. Mit der Zeit konnte ich aber besser nachfragen und die Zusammenhänge nachvollziehen.'
  }
];
const STEINBERG_FACTS = [
  {
    label: 'Sitz',
    value: 'Hamburg, Deutschland'
  },
  {
    label: 'Gründung',
    value: '1984'
  },
  {
    label: 'Yamaha-Gruppe',
    value: 'seit 21. Januar 2005'
  }
];
const STEINBERG_TIMELINE = [
  {
    year: '1983',
    title: 'Die Idee entsteht',
    text: 'Karl "Charlie" Steinberg und Manfred Rürup lernten sich bei einer Recording-Session kennen und entwickelten die Idee für einen MIDI-Multitrack-Sequenzer.'
  },
  {
    year: '1984',
    title: 'Unternehmensgründung',
    text: 'Steinberg Research GmbH wurde gegründet und mit Pro-16 erschien das erste eigene Softwareprodukt.'
  },
  {
    year: '2005',
    title: 'Teil der Yamaha-Gruppe',
    text: 'Seit dem 21. Januar 2005 ist Steinberg ein eigenständiges Unternehmen innerhalb der Yamaha-Gruppe.'
  }
];
const STEINBERG_PROFILE = {
  summary: 'Steinberg ist ein Audiotechnologie-Unternehmen, das Werkzeuge für Musikproduktion, Recording, Komposition und Sounddesign entwickelt. Das Unternehmen begleitet damit sowohl Einsteiger als auch professionelle Musikerinnen, Produzenten und Audio-Profis.',
  business: 'Für meine Praktikumsreflexion lässt sich Steinberg am einfachsten als Software- und Medienunternehmen im Musik- und Audiobereich beschreiben. Es gehört zur Berufsbranche Wirtschaft und Dienstleistungen, weil es digitale Produkte und zugehörige Services entwickelt und vertreibt. Dazu zählen Programme, mit denen Musik produziert, bearbeitet, aufgenommen oder für Medienprojekte vorbereitet wird.'
};
const CAREER_SKILLS = [
  {
    title: 'Hard Skills',
    items: [
      'HTML, CSS und JavaScript bilden das Fundament. Für das Backend kommen zum Beispiel Python, Java oder SQL hinzu.',
      'Farbtheorie, Typografie und Komposition sorgen für eine klare, stimmige Gestaltung.',
      'Barrierefreiheit nach BFSG/EAA und Suchmaschinenoptimierung gehören zu modernen Webstandards.'
    ]
  },
  {
    title: 'Soft Skills',
    items: [
      'Analytisches Denken hilft, komplexe Probleme in gute digitale Lösungen zu übersetzen.',
      'Kommunikationsstärke, Zeitmanagement und Teamfähigkeit sind für Abstimmungen mit Kund:innen und Teams wichtig.'
    ]
  }
];
const CAREER_TOOLS = [
  {
    category: 'Design & Prototyping',
    tools: 'Figma verbindet Entwurf, Klick-Prototypen und Kommentare an einem Ort. Adobe XD und Sketch sind weitere Werkzeuge, um Abläufe und Oberflächen vor der Programmierung zu testen.'
  },
  {
    category: 'Grafikbearbeitung',
    tools: 'Mit Photoshop werden Bilder für das Web optimiert, während Illustrator Logos, Icons und skalierbare Vektorgrafiken vorbereitet. Beide gehören zur Adobe Creative Cloud.'
  },
  {
    category: 'Entwicklung & Zusammenarbeit',
    tools: 'VS Code ist der Arbeitsbereich für Code. GitHub dokumentiert Änderungen, erleichtert die Zusammenarbeit im Team und macht den Entwicklungsstand nachvollziehbar.'
  }
];
const CAREER_PATHS = [
  { title: 'Studium', detail: 'Medieninformatik, Mediendesign, Grafikdesign oder Informatik', duration: 'ca. 6–8 Semester' },
  { title: 'Duale Ausbildung', detail: 'Mediengestalter:in Digital und Print oder Fachinformatiker:in für Anwendungsentwicklung', duration: '3 Jahre' },
  { title: 'Quereinstieg', detail: 'Coding Bootcamps sowie zertifizierte Weiterbildungen, zum Beispiel über GFN oder Coursera', duration: 'ca. 3–6 Monate' }
];
const CAREER_SALARIES = [
  {
    role: 'Webdesigner:in',
    start: 'ca. 30.500 €',
    average: 'ca. 36.100 €',
    senior: 'bis ca. 42.600 €'
  },
  {
    role: 'Software-/Webentwickler:in',
    start: 'ca. 48.000 €',
    average: 'ca. 51.200 €',
    senior: 'bis ca. 62.000 €'
  }
];
const CAREER_SOURCES = [
  { label: 'Stepstone: Webdesigner:in', url: 'https://www.stepstone.de/gehalt/Webdesigner-in.html' },
  { label: 'kununu: Webdesigner:in', url: 'https://www.kununu.com/de/gehalt/webdesigner-in-45570' },
  { label: 'Stepstone: Software-Entwickler:in', url: 'https://www.stepstone.de/gehalt/Software-Entwickler-in.html' },
  { label: 'BFSGV: Barrierefreiheitsanforderungen', url: 'https://www.gesetze-im-internet.de/bfsgv/BJNR092800022.html' }
];
const CAREER_TRENDS = [
  { title: 'KI-Personalisierung', text: 'Websites passen Inhalte in Echtzeit intelligenter an ihre Besucher:innen an.' },
  { title: 'Machine Experience', text: 'Webinhalte werden auch für KI-Crawler wie ChatGPT verständlich und auffindbar gestaltet.' },
  { title: 'Green UX', text: 'Schlanker Code und niedriger Energieverbrauch verbessern Tempo und Nachhaltigkeit.' },
  { title: 'Passkeys', text: 'Biometrische Anmeldung per Fingerabdruck oder Face ID ersetzt zunehmend Passwörter.' }
];
const QUIZ_QUESTION_POOL = [
  {
    question: 'Welche Aufgabe gehört vor allem zu Webdesign und UI/UX?',
    options: [
      'Farben, Schriften, Navigation und Nutzungserlebnis gestalten',
      'Datenbanken ausschließlich auf Sicherheitslücken prüfen',
      'Computerhardware zusammenbauen',
      'Musikdateien im Tonstudio aufnehmen'
    ],
    correctIndex: 0,
    explanation: 'Webdesign und UI/UX gestalten die visuelle Oberfläche und sorgen dafür, dass eine Website verständlich und angenehm nutzbar ist.'
  },
  {
    question: 'Wofür ist Webentwicklung zuständig?',
    options: [
      'Nur für die Auswahl von Farben und Bildern',
      'Für Frontend, Backend sowie technische Infrastruktur wie Server und Datenbanken',
      'Ausschließlich für Texte auf einer Website',
      'Nur für die Planung von Werbekampagnen'
    ],
    correctIndex: 1,
    explanation: 'Webentwicklung verbindet die sichtbare Oberfläche mit der technischen Logik im Hintergrund.'
  },
  {
    question: 'Welche drei Technologien bilden ein wichtiges Fundament für die Webentwicklung?',
    options: [
      'Photoshop, Figma und Illustrator',
      'Python, Java und SQL',
      'HTML, CSS und JavaScript',
      'Word, Excel und PowerPoint'
    ],
    correctIndex: 2,
    explanation: 'HTML strukturiert Inhalte, CSS gestaltet sie und JavaScript macht Webseiten interaktiv.'
  },
  {
    question: 'Wofür wird GitHub in einem Entwicklungsteam genutzt?',
    options: [
      'Für Versionskontrolle und die gemeinsame Arbeit am Code',
      'Zum Erstellen von Bildbearbeitungen',
      'Als Ersatz für eine Programmiersprache',
      'Zum Messen der Internetgeschwindigkeit'
    ],
    correctIndex: 0,
    explanation: 'GitHub dokumentiert Änderungen am Code und erleichtert die Zusammenarbeit im Team.'
  },
  {
    question: 'Was ist das Ziel von Green UX?',
    options: [
      'Webseiten ausschließlich grün einzufärben',
      'Mehr Animationen und größere Dateien einzusetzen',
      'Schlanken Code und geringeren Energieverbrauch für nachhaltigere Webseiten zu fördern',
      'Passwörter durch längere Benutzernamen zu ersetzen'
    ],
    correctIndex: 2,
    explanation: 'Green UX verbindet gute Nutzererfahrung mit effizientem Code, schnelleren Ladezeiten und weniger Energieverbrauch.'
  },
  {
    question: 'Welches Werkzeug eignet sich besonders für gemeinsame Designentwürfe und klickbare Prototypen?',
    options: [
      'Figma',
      'GitHub',
      'SQL',
      'JavaScript'
    ],
    correctIndex: 0,
    explanation: 'Figma wird für kollaborative Designentwürfe, Kommentare und klickbare Prototypen genutzt.'
  },
  {
    question: 'Was beschreibt Barrierefreiheit im Web?',
    options: [
      'Eine Website nur für einen Browser zu gestalten',
      'Digitale Inhalte für möglichst viele Menschen wahrnehmbar, bedienbar und verständlich zu machen',
      'Möglichst viele Animationen einzubauen',
      'Alle Texte ausschließlich in Großbuchstaben zu schreiben'
    ],
    correctIndex: 1,
    explanation: 'Barrierefreiheit hilft unterschiedlichen Menschen, digitale Angebote selbstständig zu nutzen.'
  },
  {
    question: 'Welche Aufgabe übernimmt das Frontend?',
    options: [
      'Es gestaltet und programmiert den sichtbaren Teil einer Website im Browser',
      'Es ersetzt alle Datenbanken',
      'Es speichert nur Passwörter',
      'Es erstellt ausschließlich Grafiken'
    ],
    correctIndex: 0,
    explanation: 'Das Frontend ist der Teil einer Website oder App, den Nutzer:innen direkt sehen und bedienen.'
  },
  {
    question: 'Wozu dient Suchmaschinenoptimierung, kurz SEO?',
    options: [
      'Damit Webseiten für Suchmaschinen besser verständlich und auffindbar werden',
      'Damit Bilder automatisch gemalt werden',
      'Damit Passwörter durch Fingerabdruck ersetzt werden',
      'Damit ein Server ausgeschaltet werden kann'
    ],
    correctIndex: 0,
    explanation: 'SEO verbessert Struktur und Inhalte einer Website, damit Suchmaschinen sie besser einordnen können.'
  },
  {
    question: 'Was ersetzen Passkeys zunehmend?',
    options: [
      'Klassische Passwörter durch sichere Anmeldeverfahren wie Fingerabdruck oder Face ID',
      'HTML durch CSS',
      'Webdesign durch Datenbanken',
      'GitHub durch E-Mails'
    ],
    correctIndex: 0,
    explanation: 'Passkeys ermöglichen eine sichere Anmeldung über das Gerät, etwa per Fingerabdruck oder Gesichtserkennung.'
  }
];

function createQuizQuestions() {
  return [...QUIZ_QUESTION_POOL]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
}
const GLOSSARY_TERMS = [
  {
    id: 'ux',
    label: 'UX',
    aliases: ['ux', 'ux-design', 'user experience'],
    description: 'UX steht für User Experience und beschreibt das gesamte Nutzungserlebnis einer Person mit einem Produkt oder einer Website.'
  },
  {
    id: 'backend',
    label: 'Backend',
    aliases: ['backend'],
    description: 'Das Backend ist der Teil einer Website oder App, der im Hintergrund Daten verarbeitet, speichert und Anfragen beantwortet.'
  },
  {
    id: 'framework',
    label: 'Framework',
    aliases: ['framework', 'frameworks'],
    description: 'Ein Framework ist ein technisches Grundgerüst, das wiederkehrende Aufgaben vorbereitet und die Entwicklung strukturierter macht.'
  },
  {
    id: 'ticket',
    label: 'Ticket',
    aliases: ['ticket', 'tickets'],
    description: 'Ein Ticket ist ein einzelner dokumentierter Arbeitsauftrag oder ein Problem, das im Team bearbeitet und nachverfolgt wird.'
  },
  {
    id: 'jira',
    label: 'Jira',
    aliases: ['jira'],
    description: 'Jira ist ein Tool, in dem Teams Aufgaben, Bugs und andere einzelne Arbeitspakete verwalten und verfolgen.'
  },
  {
    id: 'newsletter-automation',
    label: 'Newsletter-Automation',
    aliases: ['newsletter-automationen', 'newsletter-automation', 'email-automation', 'newsletter automation'],
    description: 'Eine Newsletter-Automation verschickt E-Mails automatisch nach vorher festgelegten Regeln oder bestimmten Aktionen.'
  },
  {
    id: 'ab-test',
    label: 'A/B-Test',
    aliases: ['a/b-tests', 'a/b-test', 'ab-tests', 'ab-test', 'a b test'],
    description: 'Bei einem A/B-Test werden zwei oder mehr Varianten verglichen, um zu sehen, welche bei Nutzerinnen und Nutzern besser funktioniert.'
  },
  {
    id: 'seo',
    label: 'SEO',
    aliases: ['seo'],
    description: 'SEO bedeutet Search Engine Optimization und meint die Optimierung von Inhalten, damit Suchmaschinen sie besser verstehen und Menschen sie leichter finden.'
  },
  {
    id: 'sea',
    label: 'SEA',
    aliases: ['sea'],
    description: 'SEA meint bezahlte Anzeigen in Suchmaschinen, die über Suchbegriffe ausgespielt werden. Das ist eine abgeleitete Einordnung auf Basis von Google-Ads-Dokumentation.'
  },
  {
    id: 'keyword',
    label: 'Keyword',
    aliases: ['keyword', 'keywords', 'key word', 'key words'],
    description: 'Keywords sind Wörter oder Wortgruppen, die ein Thema oder Produkt beschreiben und zum Zuordnen von Suchanfragen oder Anzeigen genutzt werden.'
  },
  {
    id: 'ki',
    label: 'KI',
    aliases: ['ki', 'ai adoption'],
    description: 'KI steht für künstliche Intelligenz. Gemeint sind Systeme, die Inhalte erzeugen, analysieren oder Aufgaben teilweise automatisiert unterstützen.'
  }
];

function parseTourStep(hash) {
  const normalized = hash.replace(/^#\/?/, '');
  const segments = normalized.split('/').filter(Boolean);
  const step = segments[0] === 'tour' ? Number(segments[1]) : 1;
  return Number.isInteger(step) && step >= 1 && step <= TOUR_STEPS.length ? step : 1;
}

function isOverviewRoute(hash) {
  return hash.replace(/^#/, '') === '/uebersicht';
}

function formatDate(dateValue) {
  if (!dateValue) return '';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function createSnippet(text, limit = 160) {
  if (!text) return '';
  return text.length > limit ? `${text.slice(0, limit).trim()}…` : text;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildInterviewHtml(bodyHtml) {
  if (typeof window === 'undefined' || !bodyHtml) {
    return bodyHtml;
  }

  const parser = new window.DOMParser();
  const doc = parser.parseFromString(`<div>${bodyHtml}</div>`, 'text/html');
  const root = doc.body.firstElementChild;

  if (!root) return bodyHtml;

  const blocks = Array.from(root.children);
  const transformed = [];
  let currentSection = null;

  for (const block of blocks) {
    if (/^H[1-6]$/.test(block.tagName)) {
      if (currentSection) {
        transformed.push(currentSection);
      }

      currentSection = {
        heading: block.textContent.trim(),
        answer: ''
      };
      continue;
    }

    const text = block.textContent.trim();
    const qaMatch = text.match(/Frage:\s*(.*?)\s*Antwort:\s*(.*)$/i);
    if (qaMatch) {
      if (!currentSection) currentSection = { heading: qaMatch[1].trim(), answer: '' };
      currentSection.answer = qaMatch[2].trim();
      continue;
    }

    if (currentSection) {
      currentSection.answer = `${currentSection.answer} ${text}`.trim();
    } else {
      transformed.push({ heading: '', answer: text });
    }
  }

  if (currentSection) {
    transformed.push(currentSection);
  }

  return transformed.map((section) => {
    const question = section.heading
      ? `<div class="qa-bubble qa-bubble-question"><span class="qa-role">Frage</span><p>${escapeHtml(section.heading)}</p></div>`
      : '';
    const answer = section.answer
      ? `<div class="qa-bubble qa-bubble-answer"><span class="qa-role">Antwort</span><p>${escapeHtml(section.answer)}</p></div>`
      : '';

    return `<section class="qa-thread">${question}${answer}</section>`;
  }).join('');
}

function App() {
  const [content] = useState(() => getContentData());
  const [step, setStep] = useState(() => parseTourStep(window.location.hash));
  const [isOverview, setIsOverview] = useState(() => isOverviewRoute(window.location.hash));
  const [sliderIndex, setSliderIndex] = useState({ diary: 0, interviews: 0 });
  const [reader, setReader] = useState(null);
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState(() => createQuizQuestions());
  const [readEntries, setReadEntries] = useState(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem('praktikumsportal-read-entries'));
      return {
        diary: Array.isArray(stored?.diary) ? stored.diary : [],
        interviews: Array.isArray(stored?.interviews) ? stored.interviews : []
      };
    } catch {
      return { diary: [], interviews: [] };
    }
  });

  const diaryEntries = content.diary;
  const interviewEntries = content.interviews;
  const diaryGroups = useMemo(() => {
    const groups = [];

    for (const entry of diaryEntries) {
      const match = entry.title.match(/^(Woche\s+\d+):\s*(.+)$/);
      const label = match ? match[1] : 'Tagebuch';
      const title = match ? match[2] : entry.title;
      const lastGroup = groups[groups.length - 1];

      if (!lastGroup || lastGroup.label !== label) {
        groups.push({ label, entries: [{ ...entry, displayTitle: title }] });
      } else {
        lastGroup.entries.push({ ...entry, displayTitle: title });
      }
    }

    return groups;
  }, [diaryEntries]);
  const requiredDiaryReads = Math.min(3, diaryEntries.length);
  const requiredInterviewReads = Math.min(3, interviewEntries.length);
  const diaryReadCount = readEntries.diary.length;
  const interviewReadCount = readEntries.interviews.length;
  const isCurrentStepUnlocked = step !== TOUR_POSITION.diary || diaryReadCount >= requiredDiaryReads;
  const isInterviewStepUnlocked = isCurrentStepUnlocked && (step !== TOUR_POSITION.interviews || interviewReadCount >= requiredInterviewReads);
  const quizIndex = step - TOUR_POSITION.quizStart;
  const isQuizStep = quizIndex >= 0 && quizIndex < quizQuestions.length;
  const canAdvance = isInterviewStepUnlocked && (!isQuizStep || quizAnswers[quizIndex] !== undefined);

  const getAccessibleStep = (requestedStep) => {
    if (requestedStep > TOUR_POSITION.diary && diaryReadCount < requiredDiaryReads) return TOUR_POSITION.diary;
    if (requestedStep > TOUR_POSITION.interviews && interviewReadCount < requiredInterviewReads) return TOUR_POSITION.interviews;

    const firstUnansweredQuiz = quizQuestions.findIndex((_, index) => quizAnswers[index] === undefined);
    if (requestedStep >= TOUR_POSITION.quizStart && firstUnansweredQuiz !== -1 && requestedStep > TOUR_POSITION.quizStart + firstUnansweredQuiz) {
      return TOUR_POSITION.quizStart + firstUnansweredQuiz;
    }

    return requestedStep;
  };

  useEffect(() => {
    const syncRoute = (closeReader = false) => {
      if (isOverviewRoute(window.location.hash)) {
        setIsOverview(true);
        if (closeReader) {
          setReader(null);
          setActiveGlossaryTerm(null);
        }
        return;
      }

      const requestedStep = parseTourStep(window.location.hash);
      const accessibleStep = getAccessibleStep(requestedStep);
      if (!window.location.hash.startsWith('#/tour/') || requestedStep !== accessibleStep) {
        window.history.replaceState(null, '', `#/tour/${accessibleStep}`);
      }

      setIsOverview(false);
      setStep(accessibleStep);
      if (closeReader) {
        setReader(null);
        setActiveGlossaryTerm(null);
      }
    };

    syncRoute();
    const onHashChange = () => syncRoute(true);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [diaryReadCount, interviewReadCount, quizAnswers, quizQuestions]);

  const goToStep = (nextStep) => {
    window.location.hash = `/tour/${nextStep}`;
  };

  useEffect(() => {
    if (!reader) return;

    setReadEntries((current) => {
      if (current[reader.collection].includes(reader.entry.id)) return current;
      const next = { ...current, [reader.collection]: [...current[reader.collection], reader.entry.id] };
      sessionStorage.setItem('praktikumsportal-read-entries', JSON.stringify(next));
      return next;
    });
  }, [reader]);

  const openReader = (collection, entry) => {
    setActiveGlossaryTerm(null);
    setReader({ collection, entry });
  };

  const answerQuizQuestion = (questionIndex, answerIndex) => {
    setQuizAnswers((current) => {
      if (current[questionIndex] !== undefined) return current;
      const next = [...current];
      next[questionIndex] = answerIndex;
      return next;
    });
  };

  const restartQuiz = () => {
    setQuizAnswers([]);
    setQuizQuestions(createQuizQuestions());
    goToStep(TOUR_POSITION.quizStart);
  };

  const openOverview = () => {
    window.location.hash = '/uebersicht';
  };

  const readerGlossaryTerms = useMemo(() => {
    if (!reader) return [];
    const searchableText = [reader.entry.title, reader.entry.summary, reader.entry.bodyHtml.replace(/<[^>]+>/g, ' ')].join(' ').toLowerCase();
    return GLOSSARY_TERMS.filter((term) => term.aliases.some((alias) => searchableText.includes(alias.toLowerCase())));
  }, [reader]);
  const activeGlossaryEntry = useMemo(
    () => readerGlossaryTerms.find((term) => term.id === activeGlossaryTerm) || null,
    [readerGlossaryTerms, activeGlossaryTerm]
  );

  const collectionCards = (collection, entries, title, eyebrow, readCount, requiredReads) => {
    const pages = collection === 'diary'
      ? diaryGroups.flatMap((group) =>
          Array.from({ length: Math.ceil(group.entries.length / 3) }, (_, index) => ({
            label: group.label,
            entries: group.entries.slice(index * 3, index * 3 + 3)
          }))
        )
      : Array.from({ length: Math.ceil(entries.length / 3) }, (_, index) => ({ entries: entries.slice(index * 3, index * 3 + 3) }));
    const pageIndex = Math.min(sliderIndex[collection], Math.max(0, pages.length - 1));
    const currentPage = pages[pageIndex] || { entries: [] };
    const visibleEntries = currentPage.entries;
    const hasPrevious = pageIndex > 0;
    const hasNext = pageIndex < pages.length - 1;

    return (
      <section className="tour-panel collection-panel">
        <div className="tour-heading">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
          </div>
          <Badge>{Math.min(readCount, requiredReads)} / {requiredReads} gelesen</Badge>
        </div>
        <p className="tour-intro">Öffne mindestens drei unterschiedliche Einträge, um die nächste Station freizuschalten.</p>
        {collection === 'diary' ? <div className="diary-week-card"><span>Praktikumswoche</span><h2>{currentPage.label}</h2></div> : null}
        <div className={`collection-slider collection-slider-${collection}`}>
          {visibleEntries.map((entry, index) => (
            <button
              key={entry.id}
              type="button"
              className={`collection-card ${collection === 'diary' ? `timeline-card-${(pageIndex + index) % 3 + 1}` : `interview-card-${(pageIndex * 3 + index) % 3 + 1}`}`}
              onClick={() => openReader(collection, entry)}
            >
              <span className={readEntries[collection].includes(entry.id) ? 'is-read' : ''}>{readEntries[collection].includes(entry.id) ? 'Gelesen' : `Eintrag ${pageIndex * 3 + index + 1}`}</span>
              <h2>{entry.displayTitle || entry.title}</h2>
              <p>{createSnippet(entry.summary, 155)}</p>
              <strong>Öffnen</strong>
            </button>
          ))}
        </div>
        <div className="slider-controls">
          <span>{collection === 'diary' ? `${currentPage.label} · ${pageIndex + 1} / ${pages.length}` : `Einträge ${pageIndex * 3 + 1}–${Math.min(pageIndex * 3 + 3, entries.length)} von ${entries.length}`}</span>
          <div className="slider-arrow-group">
            <button type="button" aria-label="Vorherige Einträge" onClick={() => setSliderIndex((current) => ({ ...current, [collection]: Math.max(0, current[collection] - 1) }))} disabled={!hasPrevious}>‹</button>
            <button type="button" aria-label="Weitere Einträge" onClick={() => setSliderIndex((current) => ({ ...current, [collection]: Math.min(pages.length - 1, current[collection] + 1) }))} disabled={!hasNext}>›</button>
          </div>
        </div>
      </section>
    );
  };

  const renderTourStep = () => {
    switch (step) {
      case 1:
        return <section className="tour-panel hero-stage"><div className="hero-orbit hero-orbit-one" /><div className="hero-orbit hero-orbit-two" /><div className="hero-copy"><p className="eyebrow">Praktikumsdokumentation</p><h1>Mein Praktikum bei Steinberg.</h1><p className="hero-text">Eine geführte Dokumentation meiner Eindrücke, Gespräche und Lernerfahrungen.</p></div><div className="hero-sidebar"><div className="steinberg-wordmark"><img className="steinberg-logo" src={steinbergLogo} alt="Steinberg" /></div></div></section>;
      case 2:
        return <section className="tour-panel"><div className="tour-heading"><div><p className="eyebrow">Unternehmen</p><h1>Steinberg unter der Lupe</h1></div><Badge>Profil</Badge></div><div className="tour-company-layout"><article className="company-intro-card"><h2>Was macht Steinberg?</h2><p>{STEINBERG_PROFILE.summary}</p><p>{STEINBERG_PROFILE.business}</p></article><div className="company-facts-grid">{STEINBERG_FACTS.map((fact) => <article key={fact.label} className="company-fact-card"><span>{fact.label}</span><strong>{fact.value}</strong></article>)}</div></div></section>;
      case 3:
        return <section className="tour-panel"><div className="tour-heading"><div><p className="eyebrow">Unternehmen</p><h1>Steinbergs Geschichte</h1></div><Badge>1983–heute</Badge></div><div className="tour-timeline tour-timeline-full">{STEINBERG_TIMELINE.map((item) => <article key={item.year}><span>{item.year}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}</div></section>;
      case 4:
        return <section className="tour-panel"><div className="tour-heading"><div><p className="eyebrow">Berufsbild</p><h1>Webdesigner:in &amp; Webentwickler:in</h1></div><Badge>01 / 06</Badge></div><div className="tour-career-overview"><article className="career-intro-copy"><h2>Berufsbild im Überblick</h2><p className="career-lead">Webdesigner:innen und Webentwickler:innen arbeiten Hand in Hand: Design entwickelt die Vision und Ästhetik, Entwicklung macht sie funktional und erlebbar. Bei Steinberg umfasst das die Webpräsenz, den Online-Shop, Support-Portale und Oberflächen für neue Softwarelösungen wie MixKey.</p></article><article className="career-role-card"><div className="career-role-item"><span>01</span><h2>Webdesign · UI/UX</h2><p>Visuelles Layout, Farben, Schriften und Grafiken gestalten sowie Navigation und Usability optimieren.</p></div><div className="career-role-item"><span>02</span><h2>Webentwicklung</h2><p>Frontend, Server, Datenbanken und die technische Infrastruktur programmieren und verbinden.</p></div></article></div></section>;
      case 5:
        return <section className="tour-panel"><div className="tour-heading"><div><p className="eyebrow">Berufsbild · Kompetenzen &amp; Werkzeuge</p><h1>Kompetenzen</h1></div><Badge>02 / 07</Badge></div><div className="tour-skill-grid tour-skill-grid-full">{CAREER_SKILLS.map((group) => <article key={group.title}><h2>{group.title}</h2><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></section>;
      case 6:
        return <section className="tour-panel"><div className="tour-heading"><div><p className="eyebrow">Berufsbild · Kompetenzen &amp; Werkzeuge</p><h1>Werkzeuge im IT-Beruf</h1></div><Badge>03 / 07</Badge></div><div className="tour-tools-grid tour-tools-grid-full">{CAREER_TOOLS.map((tool, index) => <article key={tool.category}><span>{String(index + 1).padStart(2, '0')}</span><h2>{tool.category}</h2><p>{tool.tools}</p></article>)}</div></section>;
      case 7:
        return <section className="tour-panel"><div className="tour-heading"><div><p className="eyebrow">Berufsbild</p><h1>Wege in den Beruf</h1></div><Badge>04 / 07</Badge></div><div className="tour-path-grid">{CAREER_PATHS.map((path) => <article key={path.title}><span>{path.duration}</span><div><h2>{path.title}</h2><p>{path.detail}</p></div></article>)}</div></section>;
      case 8:
        return <section className="tour-panel"><div className="tour-heading"><div><p className="eyebrow">Berufsbild</p><h1>Gehaltsaussichten 2026</h1></div><Badge>05 / 07</Badge></div><div className="tour-salary-panel"><div><p className="eyebrow">Brutto/Jahr</p><h2>Orientierungswerte</h2><p>Die Vergütung hängt stark von Erfahrung, Region und Spezialisierung ab.</p></div><div className="tour-salary-grid">{CAREER_SALARIES.map((salary) => <article key={salary.role}><h3>{salary.role}</h3><p><span>Einstieg</span><strong>{salary.start}</strong></p><p><span>Durchschnitt</span><strong>{salary.average}</strong></p><p><span>Oberer Wert</span><strong>{salary.senior}</strong></p></article>)}</div><div className="tour-sources">{CAREER_SOURCES.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}</div></div></section>;
      case 9:
        return <section className="tour-panel"><div className="tour-heading"><div><p className="eyebrow">Berufsbild</p><h1>Wichtige Trends</h1></div><Badge>06 / 07</Badge></div><div className="tour-trend-grid">{CAREER_TRENDS.map((trend, index) => <article key={trend.title}><span>{String(index + 1).padStart(2, '0')}</span><h2>{trend.title}</h2><p>{trend.text}</p></article>)}</div></section>;
      case 10:
        return <section className="tour-panel"><div className="tour-heading"><div><p className="eyebrow">Berufsbild</p><h1>Karriereperspektiven</h1></div><Badge>07 / 07</Badge></div><aside className="tour-outlook tour-outlook-full"><p className="eyebrow">Vom Team zur eigenen Spezialisierung</p><h2>Viele Wege, ein digitales Berufsfeld</h2><p>Fachkräfte arbeiten in Agenturen, IT-Abteilungen großer Unternehmen wie Steinberg oder Yamaha oder als Freelancer. Mögliche nächste Schritte sind Senior Designer, Art Director oder Head of UX Design.</p><p>Technische Schwerpunkte reichen von Frontend und Backend bis DevOps. Ein gutes Portfolio und die Zusammenarbeit zwischen Design, Entwicklung und Produktmanagement öffnen viele Wege.</p></aside></section>;
      case TOUR_POSITION.reflection:
        return <section className="tour-panel tour-reflection"><div><p className="eyebrow">Persönliche Reflexion</p><h1>Mein persönlicher Eindruck</h1><div className="tour-reflection-grid">{PRAKTIKUM_REFLECTIONS.map((reflection) => <article key={reflection.title}><h2>{reflection.title}</h2><p>{reflection.text}</p></article>)}</div></div></section>;
      case TOUR_POSITION.diary:
        return collectionCards('diary', diaryEntries, 'Tagebucheinträge', 'Tagebuch', diaryReadCount, requiredDiaryReads);
      case TOUR_POSITION.interviews:
        return collectionCards('interviews', interviewEntries, 'Interviews mit Mitarbeitenden', 'Gesprächsporträts', interviewReadCount, requiredInterviewReads);
      case TOUR_POSITION.quizStart:
      case TOUR_POSITION.quizStart + 1:
      case TOUR_POSITION.quizStart + 2:
      case TOUR_POSITION.quizStart + 3:
      case TOUR_POSITION.quizStart + 4: {
        const questionIndex = step - TOUR_POSITION.quizStart;
        const question = quizQuestions[questionIndex];
        const selectedAnswer = quizAnswers[questionIndex];
        const isCorrect = selectedAnswer === question.correctIndex;
        return <section className="tour-panel quiz-panel"><div className="quiz-card"><p className="eyebrow">Abschlussquiz · Frage {questionIndex + 1} von {quizQuestions.length}</p><h1>{question.question}</h1><div className="quiz-options">{question.options.map((option, optionIndex) => { const isSelected = selectedAnswer === optionIndex; const isCorrectOption = selectedAnswer !== undefined && optionIndex === question.correctIndex; const isWrongOption = isSelected && !isCorrect; return <button key={option} type="button" className={`quiz-option ${isCorrectOption ? 'correct' : ''} ${isWrongOption ? 'wrong' : ''}`} onClick={() => answerQuizQuestion(questionIndex, optionIndex)} disabled={selectedAnswer !== undefined}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>; })}</div>{selectedAnswer !== undefined ? <div className={`quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`}><strong>{isCorrect ? 'Richtig!' : 'Noch nicht richtig.'}</strong><p>{question.explanation}</p></div> : null}</div></section>;
      }
      case TOUR_POSITION.result: {
        const score = quizAnswers.reduce((total, answer, index) => total + (answer === quizQuestions[index].correctIndex ? 1 : 0), 0);
        const resultText = score === 5 ? 'Perfekt. Du hast die wichtigsten Inhalte sicher im Blick.' : score >= 3 ? 'Stark. Die zentralen Inhalte des Berufsbilds sitzen.' : 'Guter Anfang. Wiederhole das Quiz, um die Themen noch einmal zu festigen.';
        return <section className="tour-panel tour-finish quiz-result"><div className="finish-orbit" /><p className="eyebrow">Quiz abgeschlossen</p><p className="quiz-score">{score} <span>/ {quizQuestions.length}</span></p><h1>{resultText}</h1><p>Dein Ergebnis zum Berufsbild Webdesign und Webentwicklung.</p><div className="finish-stats"><span>5 Fragen</span><span>{score} richtig</span><span>Berufsbild</span></div><div className="finish-actions"><button type="button" className="button" onClick={restartQuiz}>Neue Fragen starten</button><button type="button" className="button secondary" onClick={openOverview}>Zur Gesamtansicht</button></div></section>;
      }
      default:
        return null;
    }
  };

  const renderOverview = () => (
    <div className="overview-page">
      <header className="overview-hero">
        <div className="overview-hero-copy"><p className="eyebrow">Praktikumsdokumentation</p><h1>Mein Praktikum bei Steinberg.</h1><p>Alle Inhalte meines Rundgangs auf einer Seite - zum Nachlesen in deinem eigenen Tempo.</p><button type="button" className="button" onClick={() => goToStep(1)}>Rundgang erneut starten</button></div>
        <div className="overview-logo"><img className="steinberg-logo" src={steinbergLogo} alt="Steinberg" /></div>
      </header>
      <main className="overview-content">
        <section><p className="eyebrow">Unternehmen</p><h2>Steinberg unter der Lupe</h2><div className="overview-company"><article><h3>Was macht Steinberg?</h3><p>{STEINBERG_PROFILE.summary}</p><p>{STEINBERG_PROFILE.business}</p></article><div className="overview-facts">{STEINBERG_FACTS.map((fact) => <article key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong></article>)}</div></div></section>
        <section><p className="eyebrow">Berufsbild</p><h2>Webdesign &amp; Webentwicklung</h2><div className="overview-grid overview-role-grid"><article><h3>Webdesign · UI/UX</h3><p>Visuelle Layouts, Farben, Schriften und Grafiken gestalten sowie Navigation und Usability verbessern.</p></article><article><h3>Webentwicklung</h3><p>Frontend, Server, Datenbanken und technische Infrastruktur programmieren und verbinden.</p></article></div></section>
        <section><p className="eyebrow">Kompetenzen</p><h2>Das Handwerkszeug</h2><div className="tour-skill-grid overview-tour-grid">{CAREER_SKILLS.map((group) => <article key={group.title}><h2>{group.title}</h2><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></section>
        <section><p className="eyebrow">Werkzeuge</p><h2>Werkzeuge im IT-Beruf</h2><div className="tour-tools-grid overview-tour-grid">{CAREER_TOOLS.map((tool, index) => <article key={tool.category}><span>{String(index + 1).padStart(2, '0')}</span><h2>{tool.category}</h2><p>{tool.tools}</p></article>)}</div></section>
        <section><p className="eyebrow">Berufseinstieg</p><h2>Wege in den Beruf</h2><div className="tour-path-grid overview-path-grid">{CAREER_PATHS.map((path) => <article key={path.title}><span>{path.duration}</span><div><h2>{path.title}</h2><p>{path.detail}</p></div></article>)}</div></section>
        <section><p className="eyebrow">Gehalt</p><h2>Gehaltsaussichten 2026</h2><div className="tour-salary-panel overview-salary-panel"><div><p className="eyebrow">Brutto/Jahr</p><h2>Orientierungswerte</h2><p>Die Vergütung hängt stark von Erfahrung, Region und Spezialisierung ab.</p></div><div className="tour-salary-grid">{CAREER_SALARIES.map((salary) => <article key={salary.role}><h3>{salary.role}</h3><p><span>Einstieg</span><strong>{salary.start}</strong></p><p><span>Durchschnitt</span><strong>{salary.average}</strong></p><p><span>Oberer Wert</span><strong>{salary.senior}</strong></p></article>)}</div><div className="tour-sources">{CAREER_SOURCES.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}</div></div></section>
        <section><p className="eyebrow">Entwicklung</p><h2>Trends und Karriere</h2><div className="tour-trend-grid overview-tour-grid">{CAREER_TRENDS.map((trend, index) => <article key={trend.title}><span>{String(index + 1).padStart(2, '0')}</span><h2>{trend.title}</h2><p>{trend.text}</p></article>)}</div><aside className="tour-outlook overview-outlook"><p className="eyebrow">Vom Team zur eigenen Spezialisierung</p><h2>Viele Wege, ein digitales Berufsfeld</h2><p>Fachkräfte arbeiten in Agenturen, IT-Abteilungen großer Unternehmen wie Steinberg oder Yamaha oder als Freelancer. Mögliche nächste Schritte sind Senior Designer, Art Director oder Head of UX Design.</p><p>Technische Schwerpunkte reichen von Frontend und Backend bis DevOps. Ein gutes Portfolio und die Zusammenarbeit zwischen Design, Entwicklung und Produktmanagement öffnen viele Wege.</p></aside></section>
        <section className="overview-reflection"><p className="eyebrow">Persönliche Reflexion</p><h2>Mein persönlicher Eindruck</h2><div>{PRAKTIKUM_REFLECTIONS.map((reflection) => <article key={reflection.title}><h3>{reflection.title}</h3><p>{reflection.text}</p></article>)}</div></section>
        <section><p className="eyebrow">Tagebuch</p><h2>Mein Praktikumsalltag</h2><div className="overview-grid overview-entry-grid">{diaryEntries.map((entry) => <article key={entry.id}><span>{entry.title}</span><p>{entry.summary}</p><button type="button" className="text-button" onClick={() => openReader('diary', entry)}>Eintrag lesen</button></article>)}</div></section>
        <section><p className="eyebrow">Interviews</p><h2>Gespräche mit Mitarbeitenden</h2><div className="overview-grid overview-entry-grid">{interviewEntries.map((entry) => <article key={entry.id}><span>{entry.title}</span><p>{entry.summary}</p><button type="button" className="text-button" onClick={() => openReader('interviews', entry)}>Interview lesen</button></article>)}</div></section>
      </main>
    </div>
  );

  const readerHtml = reader?.collection === 'interviews' ? buildInterviewHtml(reader.entry.bodyHtml) : reader?.entry.bodyHtml;

  if (isOverview) {
    return <div className="app-shell overview-shell">{renderOverview()}{reader ? <div className="reader-overlay" role="dialog" aria-modal="true" aria-label={reader.entry.title}><article className="reader-card"><header><div><p className="eyebrow">{reader.collection === 'diary' ? 'Tagebuch' : 'Interview'}</p><h1>{reader.entry.title}</h1></div><button type="button" className="button secondary" onClick={() => setReader(null)}>Schließen</button></header><div className="reader-content" dangerouslySetInnerHTML={{ __html: readerHtml }} />{readerGlossaryTerms.length ? <div className="reader-glossary"><span>Begriffe</span>{readerGlossaryTerms.map((term) => <button key={term.id} type="button" onClick={() => setActiveGlossaryTerm((current) => current === term.id ? null : term.id)}>{term.label}</button>)}{activeGlossaryEntry ? <p>{activeGlossaryEntry.description}</p> : null}</div> : null}</article></div> : null}<DevelopmentAgentation /></div>;
  }

  return (
    <div className="app-shell tour-shell">
      <div className="tour-progress" aria-label={`Station ${step} von ${TOUR_STEPS.length}`} style={{ '--tour-steps': TOUR_STEPS.length }}>{TOUR_STEPS.map((label, index) => <span key={label} className={index + 1 <= step ? 'active' : ''} />)}</div>
      <main className="tour-main">{renderTourStep()}</main>
      <nav className="tour-navigation" aria-label="Rundgang Navigation"><button type="button" className="button secondary" onClick={() => goToStep(step - 1)} disabled={step === 1}>‹ Zurück</button><span>Rundgang · {step} / {TOUR_STEPS.length}</span>{step === TOUR_STEPS.length ? <div className="tour-final-actions"><button type="button" className="button secondary" onClick={openOverview}>Gesamtansicht</button><button type="button" className="button" onClick={restartQuiz}>Quiz wiederholen</button></div> : <button type="button" className="button" onClick={() => goToStep(step + 1)} disabled={!canAdvance}>Weiter ›</button>}</nav>
      {reader ? <div className="reader-overlay" role="dialog" aria-modal="true" aria-label={reader.entry.title}><article className="reader-card"><header><div><p className="eyebrow">{reader.collection === 'diary' ? 'Tagebuch' : 'Interview'}</p><h1>{reader.entry.title}</h1></div><button type="button" className="button secondary" onClick={() => setReader(null)}>Schließen</button></header><div className="reader-content" dangerouslySetInnerHTML={{ __html: readerHtml }} />{readerGlossaryTerms.length ? <div className="reader-glossary"><span>Begriffe</span>{readerGlossaryTerms.map((term) => <button key={term.id} type="button" onClick={() => setActiveGlossaryTerm((current) => current === term.id ? null : term.id)}>{term.label}</button>)}{activeGlossaryEntry ? <p>{activeGlossaryEntry.description}</p> : null}</div> : null}</article></div> : null}
      <DevelopmentAgentation />
    </div>
  );
}

export default App;
