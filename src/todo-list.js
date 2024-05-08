import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js';

const LANG_TABLE = {
  en: {
    title: 'SVCA To-Do List',
    language: 'Language',
    add: 'Add',
    delete: 'Delete',
    delete_all: "Delete All",
    hide_done: "Hide Done",
    raw_data: "Raw Data",
  },
  zh: {
    title: 'SVCA任务清单',
    language: '语言',
    add: '添加',
    delete: "删除",
    delete_all: "删除所有",
    hide_done: "隐藏完成",
    raw_data: "原始数据",
  }
};

export class TodoList extends LitElement {
  static properties = {
    state: {},
  };

  constructor() {
    super();
    this.loadStateFromLocalStorage();
  }

  render() {
    const { lang, todos } = this.state;
    const todo_indices = [];
    todos.forEach((x, i) => {
      if (this.state.hide_done && x.done) return;
      todo_indices.push(i);
    });
    const els = repeat(todo_indices, (i) => i, (i) => {
      const x = todos[i];
      return html`
        <li>
          <input type=checkbox .checked=${x.done} @input=${e => this.updTodo(i, 'done', e.target.checked)}>
          <input .value=${x.text} @input=${e => this.updTodo(i, 'text', e.target.value)}>
          <button @click=${() => this.delTodo(i)}>${LANG_TABLE[lang].delete}</a>
        </li>
      `;
    });
    return html`
      <h1>${LANG_TABLE[lang].title}</h1>
      <p>
      ${LANG_TABLE[lang].language}:
      <label><input type=radio name=lang .checked=${lang == 'zh'} @input=${e => this.setLang('zh')}>中文</label>
      <label><input type=radio name=lang .checked=${lang == 'en'} @input=${e => this.setLang('en')}>English</label>
      </p>
      <button @click=${this.addTodo}> ${LANG_TABLE[lang].add}</button>
      <button @click=${this.delAll}> ${LANG_TABLE[lang].delete_all}</button>
      <label><input type=checkbox .checked=${this.state.hide_done} @input=${e => this.setHideDone(e.target.checked)}>${LANG_TABLE[lang].hide_done}</label>
      <ol>
      ${els}
      </ol>
      <p>${LANG_TABLE[lang].raw_data}: ${JSON.stringify(this.state)}</p>
    `
  }

  addTodo() {
    this.state.todos.push({ done: false, text: '' });
    this.requestUpdate();
  }

  updTodo(i, p, x) {
    this.state.todos[i][p] = x;
    this.requestUpdate();
  }

  delTodo(i) {
    if (!confirm("你为什么要删除我？救命！")) return;
    this.state.todos.splice(i, 1);
    this.requestUpdate();
  }

  delAll() {
    this.state.todos = [];
    this.requestUpdate();
  }

  setHideDone(x) {
    this.state.hide_done = x;
    this.requestUpdate();
  }

  setLang(lang) {
    this.state.lang = lang;
    this.requestUpdate();
  }

  update() {
    super.update();
    this.saveStateToLocalStorage();
  }

  loadStateFromLocalStorage() {
    const saved_state = JSON.parse(localStorage.getItem('state')) ?? {};
    this.state = {
      'hide_done': false,
      'lang': 'zh',
      'todos': [],
      ...saved_state,
    };
  }

  saveStateToLocalStorage() {
    localStorage.setItem('state', JSON.stringify(this.state));
  }
}

window.customElements.define('todo-list', TodoList)
