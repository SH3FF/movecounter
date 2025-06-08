const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');

describe('index.html', () => {
  let dom, document, window;
  beforeAll(async () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', url: 'http://localhost' });
    await new Promise(r => {
      dom.window.addEventListener('load', r);
    });
    document = dom.window.document;
    window = dom.window;
  });

  test('navigation exists at top', () => {
    const header = document.querySelector('header');
    expect(header).not.toBeNull();
    const links = header.querySelectorAll('nav a');
    expect(links.length).toBe(3);
    expect(links[0].getAttribute('href')).toBe('index.html');
  });

  test('no skyline image', () => {
    expect(document.getElementById('skyline')).toBeNull();
  });

  test('theme toggle switches class', () => {
    const btn = document.getElementById('theme-toggle');
    btn.click();
    expect(document.body.classList.contains('dark')).toBe(true);
    btn.click();
    expect(document.body.classList.contains('dark')).toBe(false);
  });

  test('applies stored theme on load', async () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
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

  test('countWeekends calculates correctly', () => {
    const start = new Date('2024-12-01');
    const end = new Date('2024-12-31');
    const result = window.countWeekends(start, end);
    expect(result).toBe(4);
  });
});
