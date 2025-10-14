# Minimal Academic Website

A single-page, no-build static website to list your publications and contact details. Easy to host anywhere (including GitHub Pages) and edit by hand.

Now includes optional extras: dark mode, avatar/CV, dedicated pages (Publications/Software/Teaching/Talks), simple search/tags, and BibTeX import helper.

## Edit your details

- Open `index.html` and change:
  - Title, name, subtitle (top of the page)
  - About section text
  - Contact info and profile links
- Open `assets/js/publications.js` and edit `window.PUBLICATIONS`.
  - Each publication supports fields:
    - `title` (string)
    - `authors` (string)
    - `venue` (string)
    - `year` (number)
    - `note` (string, optional), e.g., "To appear"
    - `links` (object, optional) with any of: `doi`, `arxiv`, `pdf`, `code`, `slides`, `website`
     - `tags` (array of strings, optional) for filtering

## Avatar and CV

- Put an optional avatar at `assets/avatar.jpg` (square works best). If missing, it will hide automatically.
- Put your CV as `files/CV.pdf`. The sidebar link will work out of the box.

## Top banner (optional)

- Place an image at `assets/banner.jpg`.
- Recommended: wide aspect ratio (e.g., 3:1 or 5:2). The site displays it at 1100×180 (object-fit: cover).
- If the file is missing, the banner automatically hides.

## Add a PDF or files

- Place PDFs in a `files/` folder next to `index.html` (create it if it doesn't exist)
- Reference them in `publications.js` like: `links: { pdf: "files/my-paper.pdf" }`

## Development: preview locally

You don't need any build step. Just open `index.html` in your browser. If you prefer a local server:

```bash
# macOS (Python)
python3 -m http.server 8080
# then visit http://localhost:8080/
```

## Deploy (GitHub Pages)

1. Create a new repo and push this folder's contents.
2. In the repo settings, enable GitHub Pages and set the branch to `main` (or `master`) and the root folder.
3. Your site will be served at `https://<username>.github.io/<repo>/`.

## Accessibility and performance notes

- Uses semantic HTML and accessible navigation (skip link, ARIA labels)
- No external JS frameworks; tiny, fast.
- Works without JS except for the publications list (a fallback message is shown if JS is disabled).

## License

## New pages

- `publications.html`, `software.html`, `teaching.html`, `talks.html` provide separate views with the same sidebar layout.

## Dark mode

- Click the "Toggle theme" button in the sidebar. Preference is saved in `localStorage`.

## Search and tags for publications

- On pages with publications, use the search box and tag chips to filter entries. Add `tags: ["topic", "area"]` in your publication entries to enable tag filters.

## BibTeX import (optional)

- A tiny helper `assets/js/bibtex.js` can parse a `.bib` string. Quick snippet you can adapt in a page console:

```js
// Assume you have your BibTeX in a string `txt`
const entries = Bib.parse(txt);
// Map to PUBLICATIONS shape
const mapped = entries.map(({fields}) => ({
  title: fields.title,
  authors: fields.author,
  venue: fields.journal || fields.booktitle || '',
  year: Number(fields.year),
  links: { doi: fields.doi, arxiv: fields.eprint && `https://arxiv.org/abs/${fields.eprint}` }
}));
console.log(mapped);
```

For a permanent import, paste the mapped array into `assets/js/publications.js`.

## SEO / Open Graph

- `index.html` includes basic Open Graph/Twitter meta tags. Update `og:url` and supply an `assets/avatar.jpg` image.
- Optionally add `robots.txt` and `sitemap.xml` at the site root (see below for examples you can create):

robots.txt
```
User-agent: *
Allow: /
Sitemap: https://your-domain/sitemap.xml
```

sitemap.xml (minimal)
```
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://your-domain/</loc></url>
  <url><loc>https://your-domain/publications.html</loc></url>
  <url><loc>https://your-domain/software.html</loc></url>
  <url><loc>https://your-domain/teaching.html</loc></url>
  <url><loc>https://your-domain/talks.html</loc></url>
  <!-- add more as needed -->
  
</urlset>
```

This template is provided under the MIT License. Feel free to use and modify.
