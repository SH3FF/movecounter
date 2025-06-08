const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');

describe('eateries.html', () => {
  let window, document;
  beforeAll(async () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'eateries.html'), 'utf8');
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', url: 'http://localhost' });
    await new Promise(r => dom.window.addEventListener('load', r));
    window = dom.window;
    document = window.document;
  });

  test('navigation exists at top', () => {
    const header = document.querySelector('header');
    expect(header).not.toBeNull();
    expect(header.querySelectorAll('nav a').length).toBe(3);
  });

  test('filtering works', () => {
    const select = document.getElementById('cuisine-filter');
    select.value = 'Italian';
    select.dispatchEvent(new window.Event('change'));
    const rows = document.querySelectorAll('#eatery-table tbody tr');
    expect(rows.length).toBeGreaterThan(0);
    rows.forEach(r => {
      expect(r.cells[1].textContent).toBe('Italian');
    });
  });

  test('table rows contain no script elements', () => {
    const scripts = document.querySelectorAll('#eatery-table tbody script');
    expect(scripts.length).toBe(0);
  });

  test('applies stored theme on load', async () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'eateries.html'), 'utf8');
    const dom2 = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable',
      url: 'http://localhost',
      beforeParse(window) {
        window.localStorage.setItem('theme', 'dark');
      }
    });
    await new Promise(r => dom2.window.addEventListener('load', r));
    expect(dom2.window.document.body.classList.contains('dark')).toBe(true);
  });
});
