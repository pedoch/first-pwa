const main = document.querySelector('main');
const selector = document.querySelector('#sourceSelector');
const defaultSource = 'the-washington-post';

window.addEventListener('load', async (e) => {
  updateNews();
  await updateSources();
  selector.value = defaultSource;

  selector.addEventListener('change', (e) => {
    updateNews(e.target.value);
  });

  if ('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.register('sw.js');
      console.log('Service Worker registered');
    } catch (err) {
      console.log('Service Worker registeration failed');
    }
  }
});

async function updateSources() {
  const res = await fetch(
    `https://cors-anywhere.herokuapp.com/https://newsapi.org/v1/sources`,
    {
      headers: {
        'Access-Control-Allow-Origin': 'https://newsapi.org/',
      },
    }
  );
  const json = await res.json();

  selector.innerHTML = json.sources
    .map((src) => `<option value="${src.id}">${src.name}</option>`)
    .join('\n');
}

async function updateNews(source = defaultSource) {
  const res = await fetch(
    `https://cors-anywhere.herokuapp.com/https://newsapi.org/v1/articles?source=${source}&apiKey=94d25c6ff6904bf891b6e8048cde38bf`
  );
  const json = await res.json();

  main.innerHTML = json.articles.map(createArticle).join('\n');
}

function createArticle(article) {
  return `
    <div class="article" >
      <a href=${article.url}>
        <h2>${article.title}</h2>
        <img src="${article.urlToImage}" >
        <p>${article.description}</p>
      </a>
    </div>
  `;
}
