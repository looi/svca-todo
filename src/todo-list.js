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
        <div class="input-group mb-3">
          <div class="input-group-text">
            <input class="form-check-input mt-0" type=checkbox .checked=${x.done} @input=${e => this.updTodo(i, 'done', e.target.checked)}>
          </div>
          <input class="form-control" .value=${x.text} @input=${e => this.updTodo(i, 'text', e.target.value)}>
          <button class="btn btn-danger" @click=${() => this.delTodo(i)}>${LANG_TABLE[lang].delete}</a>
        </li>
      `;
    });
    return html`
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <nav class="navbar bg-primary" data-bs-theme="dark">
        <div class="container-fluid">
          <span class="navbar-brand mb-0 h1">${LANG_TABLE[lang].title}</span>
        </div>
      </nav>
      <div class="input-group mb-3">
        <span class="input-group-text">
          ${LANG_TABLE[lang].language}
        </span>
        <span class="input-group-text">
          <div class="form-check form-check-inline">
            <input class="form-check-input" id="radio-lang-zh" type=radio name=lang .checked=${lang == 'zh'} @input=${e => this.setLang('zh')}>
            <label class="form-check-label" for="radio-lang-zh">中文</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" id="radio-lang-en" type=radio name=lang .checked=${lang == 'en'} @input=${e => this.setLang('en')}>
            <label class="form-check-label" for="radio-lang-en">English</label>
          </div>
        </span>
      </div>
      <div class="input-group mb-3">
        <button class="btn btn-outline-primary" @click=${this.addTodo}> ${LANG_TABLE[lang].add}</button>
        <button class="btn btn-outline-primary" @click=${this.delAll}> ${LANG_TABLE[lang].delete_all}</button>
        <span class="input-group-text">
          <div class="form-check form-switch">
            <input class="form-check-input" id="check-hide" type=checkbox .checked=${this.state.hide_done} @input=${e => this.setHideDone(e.target.checked)}>
            <label class="form-check-label" for="check-hide">${LANG_TABLE[lang].hide_done}</label>
          </div>
        </span>
      </div>
      ${els}
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
