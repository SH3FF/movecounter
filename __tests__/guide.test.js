const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');

describe('guide.html', () => {
  let document;
  beforeAll(() => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'guide.html'), 'utf8');
    const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost' });
    document = dom.window.document;
  });

  test('navigation exists at top', () => {
    const header = document.querySelector('header');
    expect(header).not.toBeNull();
    const links = header.querySelectorAll('nav a');
    expect(links.length).toBe(3);
  });

  test('theme toggle switches class', () => {
    const btn = document.getElementById('theme-toggle');
    btn.click();
    expect(document.body.classList.contains('dark')).toBe(true);
  });

  test('applies stored theme on load', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'guide.html'), 'utf8');
    const dom2 = new JSDOM(html, {
      runScripts: 'dangerously',
      url: 'http://localhost',
      beforeParse(window) {
        window.localStorage.setItem('theme', 'dark');
      }
    });
    const doc2 = dom2.window.document;
    expect(doc2.body.classList.contains('dark')).toBe(true);
  });
});
