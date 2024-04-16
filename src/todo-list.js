import { LitElement, html } from 'lit'

export class TodoList extends LitElement {
  static properties = {
    state: {},
  };

  constructor() {
    super();
    this.state = JSON.parse(localStorage.getItem('state')) ?? { 'hide_done': false, 'todos': [] };
  }

  render() {
    const els = [];
    this.state.todos.forEach((x, i) => {
      if (this.state.hide_done && x.done) return;
      els.push(html`
        <li>
          <input type=checkbox .checked=${x.done} @input=${e => this.updTodo(i, 'done', e.target.checked)}>
          <input .value=${x.text} @input=${e => this.updTodo(i, 'text', e.target.value)}>
          <button @click=${() => this.delTodo(i)}>删除</a>
        </li>
      `);
    });
    return html`
      <h1>SVCA待办事项清单</h1>
      <button @click=${this.addTodo}>添加</button>
      <button @click=${this.delAll}>删除所有</button>
      <label><input type=checkbox .checked=${this.state.hide_done} @input=${e => this.setHideDone(e.target.checked)}>隐藏完成</label>
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

  update() {
    super.update();
    localStorage.setItem('state', JSON.stringify(this.state));
  }
}

window.customElements.define('todo-list', TodoList)
