// app.js
const SPACE_ID = '4dyI0nFzJ9r9';
const ACCESS_TOKEN = 'iM5jiM8vZ134UphU8EidL1zsZ6-c1v8kAiP8311IhHY'

const client = contentful.createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN
});

client.getEntries()
  .then(response => {
    const postsContainer = document.getElementById('posts');
    response.items.forEach(item => {
      const title = item.fields.title;
      const body = item.fields.body;
      const image = item.fields.image;

      const post = document.createElement('div');
      post.className = 'post';
      post.innerHTML = `
        <h2>${title}</h2>
        ${image ? `<img src="https:${image.fields.file.url}" alt="${title}"/>` : ''}
        <p>${body}</p>
      `;
      postsContainer.appendChild(post);
    });
  })
  .catch(error => console.log('Error loading content:', error));
