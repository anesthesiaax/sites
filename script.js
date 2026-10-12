// Список книг: [название, год, короткое описание, цвет]. Добавляйте свои строки сюда.
const BOOKS = [
  ['Норвежский лес', 1987, 'Любовь, утрата и взросление в Токио 1960-х.', '#7FB5A5'],
  ['Охота на овец', 1982, 'Детективный поиск с мистикой и странной овцой.', '#C9B46A'],
  ['Страна чудес без тормозов и Конец света', 1985, 'Два мира, которые постепенно сходятся в один.', '#8E9BE0'],
  ['Хроники заводной птицы', 1994, 'Пропавший кот, пропавшая жена и колодец.', '#6FA3C7'],
  ['Кафка на пляже', 2002, 'Побег подростка и старик, который говорит с кошками.', '#D98E73'],
  ['Послемрак', 2004, 'Одна ночь в большом городе, от полуночи до рассвета.', '#B78FD1'],
  ['1Q84', 2009, 'Параллельная реальность с двумя лунами.', '#E6D58A'],
  ['Убийство Командора', 2017, 'Художник находит на чердаке неизвестную картину.', '#E08F9A']
];
const MOODS = ['Грусть', 'Тишина', 'Тревога', 'Нежность', 'Одиночество', 'Надежда', 'Растерянность', 'Лёгкость'];

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Записи хранятся в браузере (localStorage) на вашем компьютере
let items = [];
try { items = JSON.parse(localStorage.getItem('feelings') || '[]'); } catch (e) {}
const save = () => { try { localStorage.setItem('feelings', JSON.stringify(items)); } catch (e) {} };

// Заполняем страницу
const options = BOOKS.map((b, i) => `<option value="${i}">${b[0]}</option>`).join('');
$('#book').innerHTML = options;
$('#filter').innerHTML = '<option value="all">Все книги</option>' + options;
$('#moods').innerHTML = MOODS.map(m =>
  `<label class="chip"><input type="checkbox" name="mood" value="${m}"><span>${m}</span></label>`).join('');
$('#books').innerHTML = BOOKS.map((b, i) =>
  `<button class="book" style="--c:${b[3]}" data-i="${i}"><h3>${b[0]}</h3><small>${b[1]}</small><p>${b[2]}</p></button>`).join('');

// Клик по книге выбирает её в форме
$('#books').onclick = e => {
  const card = e.target.closest('.book');
  if (!card) return;
  $('#book').value = card.dataset.i;
  $('#feel').scrollIntoView();
  $('#text').focus({ preventScroll: true });
};

// Отправка формы
$('#form').onsubmit = e => {
  e.preventDefault();
  const moods = [...document.querySelectorAll('[name=mood]:checked')].map(x => x.value);
  const text = $('#text').value.trim();
  if (!moods.length && !text) {
    $('#msg').textContent = 'Выберите хотя бы одно состояние или напишите пару слов.';
    return;
  }
  items.unshift({
    id: Date.now(),
    b: Number($('#book').value),
    moods, text,
    name: $('#name').value.trim() || 'Читатель',
    d: new Date().toISOString()
  });
  save();
  e.target.reset();
  $('#msg').textContent = 'Спасибо. Ваше впечатление добавлено на стену.';
  render();
};

// Показ записей
function render() {
  const f = $('#filter').value;
  const list = items.filter(x => f === 'all' || x.b == f);
  $('#wall').innerHTML = list.length ? list.map(x => `
    <article class="entry" style="--c:${BOOKS[x.b][3]}">
      <h3>${BOOKS[x.b][0]}</h3>
      <div class="tags">${x.moods.map(m => `<span>${esc(m)}</span>`).join('')}</div>
      ${x.text ? `<p class="t">${esc(x.text)}</p>` : ''}
      <footer>
        <span>${esc(x.name)}, ${new Date(x.d).toLocaleDateString('ru-RU')}</span>
        <button data-id="${x.id}">Удалить</button>
      </footer>
    </article>`).join('')
    : '<p class="mu">Здесь пока пусто. Расскажите первым, что оставила в вас книга.</p>';
}
$('#filter').onchange = render;
$('#wall').onclick = e => {
  const id = e.target.dataset.id;
  if (!id) return;
  items = items.filter(x => x.id != id);
  save();
  render();
};
render();
