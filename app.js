// Your real Contentful details
const SPACE_ID = '4dyI0nFzJ9r9'; // replace with your real Space ID
const ACCESS_TOKEN = 'iM5jIMbVZ13U4phU8EidLtzs6-ctVbKAiPB311fhHY'; // replace with your Content Delivery API token

// Contentful API URL
const API_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}`;

async function loadContent() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    if (data.items.length === 0) {
      contentDiv.innerHTML = '<p>No content found. Make sure you have published entries in Contentful.</p>';
      return;
    }

    data.items.forEach((item) => {
      const post = document.createElement('div');
      post.classList.add('post');

      const title = item.fields.title ? item.fields.title : 'Untitled';
      const description = item.fields.description ? item.fields.description : 'No description available.';

      post.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
      `;

      contentDiv.appendChild(post);
    });
  } catch (error) {
    console.error('Error loading content:', error);
    document.getElementById('content').innerHTML =
      '<p>Error loading content. Please check your API keys or published entries.</p>';
  }
}

// Run the function
loadContent();
