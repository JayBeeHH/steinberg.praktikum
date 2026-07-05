import { useEffect, useMemo, useState } from 'react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';

const HOME_SECTIONS = ['diary', 'interviews'];
const GLOSSARY_TERMS = [
  {
    id: 'ux',
    label: 'UX',
    aliases: ['ux', 'ux-design', 'user experience'],
    description: 'UX steht fuer User Experience und beschreibt das gesamte Nutzungserlebnis einer Person mit einem Produkt oder einer Website.'
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
    description: 'Ein Framework ist ein technisches Grundgeruest, das wiederkehrende Aufgaben vorbereitet und die Entwicklung strukturierter macht.'
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
    description: 'SEA meint bezahlte Anzeigen in Suchmaschinen, die ueber Suchbegriffe ausgespielt werden. Das ist eine abgeleitete Einordnung auf Basis von Google-Ads-Dokumentation.'
  },
  {
    id: 'keyword',
    label: 'Keyword',
    aliases: ['keyword', 'keywords', 'key word', 'key words'],
    description: 'Keywords sind Woerter oder Wortgruppen, die ein Thema oder Produkt beschreiben und zum Zuordnen von Suchanfragen oder Anzeigen genutzt werden.'
  },
  {
    id: 'ki',
    label: 'KI',
    aliases: ['ki', 'ai adoption'],
    description: 'KI steht fuer kuenstliche Intelligenz. Gemeint sind Systeme, die Inhalte erzeugen, analysieren oder Aufgaben teilweise automatisiert unterstuetzen.'
  }
];

function parseRoute(hash) {
  const normalized = hash.replace(/^#\/?/, '');
  if (!normalized) {
    return { page: 'home', section: null };
  }

  const segments = normalized.split('/').filter(Boolean);
  if (segments[0] === 'diary' && segments[1]) {
    return { page: 'detail', collection: 'diary', id: decodeURIComponent(segments.slice(1).join('/')) };
  }

  if (segments[0] === 'interviews' && segments[1]) {
    return { page: 'detail', collection: 'interviews', id: decodeURIComponent(segments.slice(1).join('/')) };
  }

  if (HOME_SECTIONS.includes(segments[0])) {
    return { page: 'home', section: segments[0] };
  }

  return { page: 'home', section: null };
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
  const [content, setContent] = useState({ diary: [], interviews: [] });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [route, setRoute] = useState(parseRoute(window.location.hash));
  const [showMoreDiary, setShowMoreDiary] = useState(false);
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState(null);

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch('/api/content');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error(error);
      setStatus('Inhalte konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const onHashChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (route.page !== 'home' || !route.section) return;

    const scrollToSection = () => {
      const target = document.getElementById(route.section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const timer = window.setTimeout(scrollToSection, loading ? 150 : 0);
    return () => window.clearTimeout(timer);
  }, [route, loading]);

  useEffect(() => {
    setActiveGlossaryTerm(null);
  }, [route]);

  const activeEntry = useMemo(() => {
    if (route.page !== 'detail') return null;
    const items = route.collection === 'diary' ? content.diary : content.interviews;
    return items.find((entry) => entry.id === route.id) || null;
  }, [route, content]);

  const stats = useMemo(() => (
    [
      { label: 'Tage', value: 15 },
      { label: 'Wochen', value: 3 },
      { label: 'Interviews', value: 9 }
    ]
  ), []);

  const orderedDiary = useMemo(() => content.diary, [content.diary]);
  const visibleDiaryEntries = useMemo(
    () => (showMoreDiary ? orderedDiary : orderedDiary.slice(0, 2)),
    [orderedDiary, showMoreDiary]
  );
  const interviewSpotlights = useMemo(() => content.interviews.slice(0, 6), [content.interviews]);
  const recommendedInterview = interviewSpotlights[0] || null;
  const interviewDetailHtml = useMemo(
    () => (route.collection === 'interviews' && activeEntry ? buildInterviewHtml(activeEntry.bodyHtml) : activeEntry?.bodyHtml || ''),
    [route.collection, activeEntry]
  );
  const glossaryTermsForEntry = useMemo(() => {
    if (!activeEntry) return [];

    const searchableText = [
      activeEntry.title,
      activeEntry.summary,
      activeEntry.bodyHtml ? activeEntry.bodyHtml.replace(/<[^>]+>/g, ' ') : ''
    ]
      .join(' ')
      .toLowerCase();

    return GLOSSARY_TERMS.filter((term) =>
      term.aliases.some((alias) => searchableText.includes(alias.toLowerCase()))
    );
  }, [activeEntry]);
  const activeGlossaryEntry = useMemo(
    () => glossaryTermsForEntry.find((term) => term.id === activeGlossaryTerm) || null,
    [glossaryTermsForEntry, activeGlossaryTerm]
  );

  if (route.page === 'detail') {
    return (
      <div className="app-shell">
        <header className="topbar">
          <a className="brand-mark" href="#/">
            <span className="brand-kicker">Praktikumsportal</span>
            <strong>Journal View</strong>
          </a>
          <nav className="nav-links">
            <a href="#/">Start</a>
            <a href={`#/${route.collection}`}>Zur Sammlung</a>
          </nav>
        </header>

        <main className="page-content detail-page">
          <section className="detail-header-card">
            <div className="detail-header-main">
              <p className="eyebrow">{route.collection === 'diary' ? 'Tagebuchkapitel' : 'Interviewporträt'}</p>
              <h1 className="detail-heading">{activeEntry ? activeEntry.title : 'Eintrag nicht gefunden'}</h1>
              <div className="detail-meta">
                <Badge>{route.collection === 'diary' ? 'Tagebuch' : 'Interview'}</Badge>
                {route.collection === 'interviews' ? <span>{activeEntry ? formatDate(activeEntry.date) : ''}</span> : null}
              </div>
            </div>

            <div className="detail-header-actions">
              <p className="detail-side-label">Rücksprung</p>
              <a className="button secondary" href={`#/${route.collection}`}>Zurück zur Sammlung</a>
            </div>
          </section>

          <section className="detail-card">
            {activeEntry ? (
              <>
                {activeEntry.image ? (
                  <div className="detail-image-wrap">
                    <img className="detail-image" src={activeEntry.image} alt={activeEntry.title} />
                  </div>
                ) : null}
                <div
                  className={`detail-body ${route.collection === 'interviews' ? 'detail-body-interview' : ''}`}
                  dangerouslySetInnerHTML={{ __html: interviewDetailHtml }}
                />
                {glossaryTermsForEntry.length ? (
                  <section className="inline-glossary">
                    <div className="inline-glossary-head">
                      <p className="eyebrow">Begriffe im Eintrag</p>
                      <h2>Kurze Erklaerungen zu Fachbegriffen</h2>
                    </div>
                    <div className="glossary-chip-row">
                      {glossaryTermsForEntry.map((term) => (
                        <button
                          key={term.id}
                          type="button"
                          className={`glossary-chip ${activeGlossaryTerm === term.id ? 'active' : ''}`}
                          onClick={() => setActiveGlossaryTerm((current) => current === term.id ? null : term.id)}
                        >
                          {term.label}
                        </button>
                      ))}
                    </div>
                    {activeGlossaryEntry ? (
                      <div className="glossary-panel">
                        <h3>{activeGlossaryEntry.label}</h3>
                        <p>{activeGlossaryEntry.description}</p>
                      </div>
                    ) : null}
                  </section>
                ) : null}
              </>
            ) : (
              <div className="status-card">Der Eintrag konnte nicht gefunden werden.</div>
            )}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand-mark" href="#/">
          <span className="brand-kicker">Praktikumsportal</span>
          <strong>Steinberg Praktikum</strong>
        </a>
        <nav className="nav-links">
          <a href="#/">Start</a>
          <a href="#/diary">Tagebuch</a>
          <a href="#/interviews">Interviews</a>
        </nav>
      </header>

      <main className="page-content">
        <section className="hero-stage">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />

          <div className="hero-copy">
            <p className="eyebrow">Praktikumsdokumentation</p>
            <h1>Mein Praktikum bei Steinberg.</h1>
            <p className="hero-text">
              Auf dieser Website sind meine Eindrücke, Gespräche und Unterlagen aus dem Praktikum gesammelt.
            </p>
            <div className="hero-actions">
              <a className="button" href="#/diary">Zum Tagebuch</a>
              <a className="button secondary" href="#/interviews">Zu den Interviews</a>
            </div>
          </div>

          <div className="hero-sidebar">
            <div className="hero-panel hero-panel-dark">
              <p className="hero-panel-label">Empfohlener Inhalt</p>
              <h2>{recommendedInterview ? `Interview mit ${recommendedInterview.title}` : 'Noch kein Interview'}</h2>
              <p>
                {recommendedInterview
                  ? createSnippet(recommendedInterview.summary, 120)
                  : 'Sobald Interviews vorhanden sind, wird hier ein empfohlener Inhalt angezeigt.'}
              </p>
              {recommendedInterview ? (
                <a className="inline-link" href={`#/interviews/${encodeURIComponent(recommendedInterview.id)}`}>Interview öffnen</a>
              ) : null}
            </div>

            <div className="stats-grid" aria-label="Projektstatistiken">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="diary" className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Tagebuch</p>
              <h2>Alle Tagebucheinträge in chronologischer Reihenfolge</h2>
            </div>
            <Badge>{orderedDiary.length} Einträge</Badge>
          </div>

          {loading ? (
            <div className="status-card">Lade Einträge …</div>
          ) : orderedDiary.length ? (
            <>
              <div className="timeline-grid timeline-grid-chronological">
                {visibleDiaryEntries.map((entry, index) => (
                <a key={entry.id} className={`timeline-card timeline-card-${(index % 3) + 1}`} href={`#/diary/${encodeURIComponent(entry.id)}`}>
                  <div className="timeline-meta">
                    <span>Eintrag {orderedDiary.findIndex((item) => item.id === entry.id) + 1}</span>
                  </div>
                  <h3>{entry.title}</h3>
                  <p>{createSnippet(entry.summary, 160)}</p>
                </a>
                ))}
              </div>

              {orderedDiary.length > 2 ? (
                <div className="diary-more">
                  <button className="button outline" onClick={() => setShowMoreDiary((value) => !value)}>
                    {showMoreDiary ? 'Weniger anzeigen' : `Mehr lesen (${orderedDiary.length - 2})`}
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="status-card">Noch keine Tagebucheinträge vorhanden.</div>
          )}
        </section>

        <section id="interviews" className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Gesprächsporträts</p>
              <h2>Interviews mit Personen aus dem Arbeitsumfeld</h2>
            </div>
            <Badge>{content.interviews.length} Gespräche</Badge>
          </div>

          {loading ? (
            <div className="status-card">Lade Interviews …</div>
          ) : content.interviews.length ? (
            <div className="interview-grid">
              {interviewSpotlights.map((entry, index) => (
                <a key={entry.id} className={`interview-card interview-card-${(index % 3) + 1}`} href={`#/interviews/${encodeURIComponent(entry.id)}`}>
                  <div className="interview-card-top">
                    <span className="interview-index">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3>{entry.title}</h3>
                  <p>{createSnippet(entry.summary, 150)}</p>
                  <span className="inline-link">Interview lesen</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="status-card">Noch keine Interviews vorhanden.</div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
