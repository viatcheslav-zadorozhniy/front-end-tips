export default function fetchHtml(path) {
  const url = `/${path}.html`;

  return fetch(url)
    .then(x => x.text());
}
