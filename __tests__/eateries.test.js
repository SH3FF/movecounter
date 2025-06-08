const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');

describe('eateries.html', () => {
  let window, document;
  beforeAll(async () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'eateries.html'), 'utf8');
    const dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable',
      url: 'http://localhost',
      beforeParse(win) {
        win.Chart = function(){ this.update = () => {}; };
        win.marked = { parse: () => '' };
      }
    });
    await new Promise(r => dom.window.addEventListener('load', r));
    await new Promise(r => setTimeout(r, 600));
    window = dom.window;
    document = dom.window.document;
  });

  test('header has title', () => {
    const header = document.querySelector('header h1');
    expect(header).not.toBeNull();
    expect(header.textContent).toContain('Chicago');
  });

  test('search filtering works', () => {
    const input = document.getElementById('search');
    input.value = 'Alinea';
    input.dispatchEvent(new window.Event('input'));
    const cards = document.querySelectorAll('#restaurant-grid .restaurant-card');
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain('Alinea');
  });

  test('no script tags inside restaurant grid', () => {
    const scripts = document.querySelectorAll('#restaurant-grid script');
    expect(scripts.length).toBe(0);
  });
});
