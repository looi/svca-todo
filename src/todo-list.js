import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js';

export class TodoList extends LitElement {
  static properties = {
    state: {},
  };

  constructor() {
    super();
    this.loadStateFromLocalStorage();
  }

  render() {
    // TODO: make everything work
    const { todos } = this.state;
    const todo_indices = [];
    todos.forEach((x, i) => {
      if (this.state.hide_done && x.done) return;
      todo_indices.push(i);
    });
    const els = repeat(todo_indices, (i) => i, (i) => {
      const x = todos[i];
      return html`
        <li>
          <input type=checkbox>
          <input>
          <button>删除</a>
        </li>
      `;
    });
    return html`
      <h1>SVCA任务清单</h1>
      <p>
      语言:
      <label><input type=radio name=lang>中文</label>
      <label><input type=radio name=lang>English</label>
      </p>
      <button @click=${this.addTodo}>添加</button>
      <button>删除所有</button>
      <label><input type=checkbox>隐藏完成</label>
      <ol>
      ${els}
      </ol>
      <p>原始数据: ${JSON.stringify(this.state)}</p>
    `
  }

  addTodo() {
    this.state.todos.push({ done: false, text: '' });
    this.requestUpdate();
  }

  updTodo(i, p, x) {
    // TODO_ update todo
    this.requestUpdate();
  }

  delTodo(i) {
    // TODO: delete single todo
    this.requestUpdate();
  }

  delAll() {
    // TODO: delete all todos
    this.requestUpdate();
  }

  setHideDone(x) {
    // TODO: set hide done
    this.requestUpdate();
  }

  setLang(lang) {
    // TODO: set language
    this.requestUpdate();
  }

  update() {
    super.update();
    this.saveStateToLocalStorage();
  }

  loadStateFromLocalStorage() {
    // TODO: load state from LocalStorage
    this.state = {
      'hide_done': false,
      'lang': 'zh',
      'todos': [],
    };
  }

  saveStateToLocalStorage() {
    // TODO: save state to LocalStorage
  }
}

window.customElements.define('todo-list', TodoList)
