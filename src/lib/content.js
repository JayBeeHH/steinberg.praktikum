const markdownModules = import.meta.glob('/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseInlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function parseMarkdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  let html = '';
  let paragraph = [];
  let listItems = [];
  let inList = false;

  function flushParagraph() {
    if (!paragraph.length) return;
    html += `<p>${parseInlineMarkdown(paragraph.join(' '))}</p>`;
    paragraph = [];
  }

  function flushList() {
    if (!listItems.length) {
      inList = false;
      return;
    }

    html += `<ul>${listItems.map((item) => `<li>${parseInlineMarkdown(item)}</li>`).join('')}</ul>`;
    listItems = [];
    inList = false;
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      if (inList) flushList();
      continue;
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      flushParagraph();
      if (inList) flushList();

      const level = trimmed.match(/^#+/)[0].length;
      const text = trimmed.replace(/^#{1,6}\s+/, '');
      html += `<h${level}>${parseInlineMarkdown(text)}</h${level}>`;
      continue;
    }

    if (/^-\s+/.test(trimmed)) {
      flushParagraph();
      inList = true;
      listItems.push(trimmed.replace(/^-\s+/, ''));
      continue;
    }

    if (inList) {
      flushList();
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  if (inList) flushList();

  return html;
}

function parseFrontmatter(text) {
  const trimmed = text.trimStart();
  if (!trimmed.startsWith('---')) {
    return { metadata: {}, body: text.trim() };
  }

  const endIndex = trimmed.indexOf('\n---', 4);
  if (endIndex === -1) {
    return { metadata: {}, body: text.trim() };
  }

  const frontmatter = trimmed.slice(4, endIndex);
  const body = trimmed.slice(endIndex + 4).trim();
  const metadata = {};

  for (const line of frontmatter.split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
    metadata[key] = value;
  }

  return { metadata, body };
}

function normalizeEntries(entries, type) {
  const withTimestamps = entries.map((entry) => {
    const timestamp = Date.parse(entry.date || '1970-01-01');
    return {
      ...entry,
      _ts: Number.isNaN(timestamp) ? 0 : timestamp
    };
  });

  withTimestamps.sort((a, b) => a._ts - b._ts);

  if (type === 'diary' && withTimestamps.length) {
    const germanWeekday = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const firstTimestamp = withTimestamps[0]._ts || 0;
    const weekDuration = 7 * 24 * 60 * 60 * 1000;

    withTimestamps.forEach((entry) => {
      const weekIndex = firstTimestamp ? Math.floor((entry._ts - firstTimestamp) / weekDuration) + 1 : 1;
      const weekday = entry._ts ? germanWeekday[new Date(entry._ts).getDay()] : '';
      entry.title = `Woche ${weekIndex}: ${weekday}`;
    });
  }

  return withTimestamps.map(({ _ts, ...entry }) => entry);
}

function toCollectionEntry(filePath, rawContent, type) {
  const { metadata, body } = parseFrontmatter(rawContent);
  const titleFromPath = filePath.split('/').pop()?.replace(/\.md$/i, '') || filePath;

  return {
    id: filePath.replace(/^\//, ''),
    title: metadata.title || titleFromPath,
    date: metadata.date || '',
    type,
    summary: metadata.summary || body.split(/\n{2,}/)[0]?.slice(0, 180) || '',
    image: metadata.image || '',
    bodyHtml: parseMarkdownToHtml(body),
    source: filePath.replace(/^\//, '')
  };
}

export function getContentData() {
  const diary = [];
  const interviews = [];
  const glossary = [];

  for (const [filePath, rawContent] of Object.entries(markdownModules)) {
    if (typeof rawContent !== 'string') continue;

    if (filePath.startsWith('/content/diary/')) {
      diary.push(toCollectionEntry(filePath, rawContent, 'diary'));
      continue;
    }

    if (filePath.startsWith('/content/interviews/')) {
      interviews.push(toCollectionEntry(filePath, rawContent, 'interview'));
      continue;
    }

    if (filePath.startsWith('/content/glossary/')) {
      glossary.push(toCollectionEntry(filePath, rawContent, 'glossary'));
    }
  }

  return {
    diary: normalizeEntries(diary, 'diary'),
    interviews: normalizeEntries(interviews, 'interview'),
    glossary: normalizeEntries(glossary, 'glossary'),
    documents: []
  };
}
