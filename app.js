// app.js - improved and robust
const SPACE_ID = '4dyI0nFzJ9r9';
const ACCESS_TOKEN = 'iM5jiM8vZ134UphU8EidL1zsZ6-c1v8kAiP8311IhHY';

document.addEventListener('DOMContentLoaded', () => {
  const postsContainer = document.getElementById('posts');
  if (!postsContainer) {
    console.error('No #posts element found in the page.');
    return;
  }

  // Ensure the Contentful SDK is loaded
  if (!window.contentful || typeof window.contentful.createClient !== 'function') {
    postsContainer.innerHTML = '<p style="text-align:center; color:#a00;">Unable to load content: Contentful SDK missing.</p>';
    console.error('Contentful SDK not found. Make sure the script from unpkg.com/contentful is included before app.js.');
    return;
  }

  const client = contentful.createClient({
    space: SPACE_ID,
    accessToken: ACCESS_TOKEN
  });

  postsContainer.innerHTML = '<p style="text-align:center; color:#666;">Loading portfolio items…</p>';

  client.getEntries()
    .then(response => {
      postsContainer.innerHTML = ''; // clear loading message

      if (!response.items || response.items.length === 0) {
        postsContainer.innerHTML = '<p style="text-align:center; color:#666;">No entries found in Contentful.</p>';
        return;
      }

      response.items.forEach(item => {
        const title = item.fields && item.fields.title ? item.fields.title : 'Untitled';
        const body = item.fields && item.fields.body ? item.fields.body : '';
        const image = item.fields && item.fields.image ? item.fields.image : null;

        // body may be rich text object in some Contentful setups.
        let bodyHtml = '';
        if (typeof body === 'string') {
          bodyHtml = `<p>${body}</p>`;
        } else if (body && body.content) {
          // crude fallback for rich text -> plain text
          const text = JSON.stringify(body).replace(/\\n/g, ' ');
          bodyHtml = `<pre style="white-space:pre-wrap">${text}</pre>`;
        } else {
          bodyHtml = '';
        }

        const post = document.createElement('div');
        post.className = 'post';
        post.innerHTML = `
          <h2>${escapeHtml(title)}</h2>
          ${image && image.fields && image.fields.file && image.fields.file.url ? `<img src="https:${image.fields.file.url}" alt="${escapeHtml(title)}">` : ''}
          ${bodyHtml}
        `;
        postsContainer.appendChild(post);
      });
    })
    .catch(error => {
      console.error('Error loading content from Contentful:', error);
      postsContainer.innerHTML = `<p style="text-align:center; color:#a00;">Error loading content. Open the browser console for details.</p>`;
    });
});

// small helper to avoid injecting raw HTML from Contentful titles
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
                          }
