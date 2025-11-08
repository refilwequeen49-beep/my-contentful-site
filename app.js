const SPACE_ID =4dyl0nfzl9r9;
const ACCESS_TOKEN = iM5jiM8vZ134UphU8EidL1zsZ6-c1v8kAiP8311IhHY

// Connect to Contentful
const client = contentful.createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN
});

// Get your posts
client.getEntries({ content_type: 'blogPost' })
  .then(response => {
    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = ''; // clear loading text

    response.items.forEach(item => {
      const title = item.fields.title;
      const body = item.fields.body;
      const article = document.createElement('article');
      article.innerHTML = `<h2>${title}</h2><p>${body}</p>`;
      postsDiv.appendChild(article);
    });
  })
  .catch(err => {
    document.getElementById('posts').innerText = 'Error loading content.';
    console.error(err);
  });
