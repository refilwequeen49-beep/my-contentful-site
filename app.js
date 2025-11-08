// app.js - fetch-based Contentful loader (no SDK required)
// Safer and simpler for debugging when SDK or CSP might block external scripts.

const SPACE_ID = '4dyI0nFzJ9r9';
const ACCESS_TOKEN = 'iM5jiM8vZ134UphU8EidL1zsZ6-c1v8kAiP8311IhHY';

// Build a Contentful CDA URL (include assets to be able to map images)
const CDA_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}&include=1`;

document.addEventListener('DOMContentLoaded', () => {
  const postsContainer = document.getElementById('posts');
  if (!postsContainer) {
    console.error('No #posts element found in the page.');
    return;
  }

  // Clear fallback and show loading
  const fallback = document.getElementById('fallback');
  if (fallback) fallback.remove();
  postsContainer.innerHTML = '<p style="text-align:center; color:#666;">Loading portfolio items…</p>';

  fetch(CDA_URL)
    .then(r => {
      if (!r.ok) throw new Error(`Contentful fetch failed: ${r.status} ${r.statusText}`);
      return r.json();
    })
    .then(data => {
      postsContainer.innerHTML = '';

      // Map included assets for quick lookups
      const assets = {};
      if (data.includes && Array.isArray(data.includes.Asset)) {
        data.includes.Asset.forEach(a => {
          if (a && a.sys && a.sys.id && a.fields && a.fields.file && a.fields.file.url) {
            assets[a.sys.id] = a.fields.file.url;
          }
        });
      }

      if (!data.items || data.items.length === 0) {
        postsContainer.innerHTML = '<p style="text-align:center; color:#666;">No entries found in Contentful.</p>';
        return;
      }

      data.items.forEach(item => {
        const fields = item.fields || {};
        const title = fields.title || 'Untitled';
        let bodyHtml = '';

        // Body can be plain text or a rich text object — handle both safely
        if (typeof fields.body === 'string') {
          bodyHtml = `<p>${escapeHtml(fields.body)}</p>`;
        } else if (fields.body && fields.body.content) {
          // Simple fallback to show raw JSON if it's rich text
          const short = JSON.stringify(fields.body).slice(0, 1000);
          bodyHtml = `<pre style="white-space:pre-wrap; font-size:0.9rem; background:#f4f4f4; padding:8px; border-radius:6px;">${escapeHtml(short)}${short.length >= 1000 ? '…' : ''}</pre>`;
        }

        // Resolve image: could be an object with fields (if includes expanded) or a link sys object
        let imageUrl = null;
        const imgField = fields.image;
        if (imgField) {
          if (imgField.fields && imgField.fields.file && imgField.fields.file.url) {
            imageUrl = imgField.fields.file.url;
          } else if (imgField.sys && imgField.sys.id && assets[imgField.sys.id]) {
            imageUrl = assets[imgField.sys.id];
          }
        }

        const post = document.createElement('div');
        post.className = 'post';
        post.innerHTML = `
          <h2>${escapeHtml(title)}</h2>
          ${imageUrl ? `<img src="https:${imageUrl}" alt="${escapeHtml(title)}">` : ''}
          ${bodyHtml}
        `;
        postsContainer.appendChild(post);
      });
    })
    .catch(err => {
      console.error('Error loading content from Contentful:', err);
      postsContainer.innerHTML = `<p style="text-align:center; color:#a00;">Error loading content. Open the browser console for details.</p>`;
    });
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
