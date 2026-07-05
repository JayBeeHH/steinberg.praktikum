async function loadContent() {
  const response = await fetch('/api/content');
  const data = await response.json();

  renderSection('diary-list', data.diary || [], 'Tagebucheintrag');
  renderSection('interviews-list', data.interviews || [], 'Interview');
  renderSection('glossary-list', data.glossary || [], 'Begriff');
  renderDocuments(data.documents || []);
}

function renderSection(containerId, items, fallbackLabel) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!items.length) {
    container.innerHTML = `<div class="card"><p>Noch keine Inhalte vorhanden.</p></div>`;
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const title = item.title || fallbackLabel;
      const date = item.date ? `<div class="card__meta">${item.date}</div>` : '';
      const image = item.image ? `<img src="${item.image}" alt="${title}" />` : '';
      return `
        <article class="card">
          ${date}
          <h3>${title}</h3>
          ${image}
          <div>${item.bodyHtml || `<p>${item.summary || 'Kein Inhalt vorhanden.'}</p>`}</div>
        </article>
      `;
    })
    .join('');
}

function renderDocuments(documents) {
  const container = document.getElementById('documents-list');
  if (!container) return;

  if (!documents.length) {
    container.innerHTML = '<div class="card"><p>Es wurden noch keine Dokumente hochgeladen.</p></div>';
    return;
  }

  container.innerHTML = documents
    .map(
      (doc) => `
        <div class="document-item">
          <span>${doc.name}</span>
          <a href="${doc.url}" target="_blank" rel="noreferrer">Öffnen</a>
        </div>
      `
    )
    .join('');
}

const uploadForm = document.getElementById('upload-form');
if (uploadForm) {
  uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = document.getElementById('file-input');
    if (!input.files || !input.files.length) return;

    const formData = new FormData();
    formData.append('file', input.files[0]);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();

    if (result.ok) {
      input.value = '';
      loadContent();
    }
  });
}

loadContent();
