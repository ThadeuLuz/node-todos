
const unchecked = (<i className="material-icons" style={{ color: '#666' }}>check_box_outline_blank</i >);
const checked = (<i className="material-icons" style={{ color: 'green' }}>check</i>);

const radioOn = (<i className="material-icons">radio_button_checked</i>);
const radioOff = (<i className="material-icons">radio_button_unchecked</i>);


const styles = {
  cardTitle: {
    color: '#fff',
    height: 176,
    background: "url('/images/todos_bg.jpg') center / cover",
  },
  checkedText: {
    textDecoration: 'line-through',
    color: '#666',
  },
  cardActions: {
    justifyContent: 'space-between',
    display: 'flex',
  },
};

const Item = ({ todo, toggleDone, deleteItem }) => (
  <li className="mdl-list__item">
    <span className="mdl-list__item-primary-content" style={todo.done ? styles.checkedText : {}} >
      <button className="mdl-button mdl-button--icon mdl-button--colored" onClick={toggleDone}>
        {todo.done ? checked : unchecked}
      </button>
      {todo.text}
    </span>
    <button
      className="mdl-button mdl-button--icon mdl-button--colored mdl-button--accent"
      onClick={deleteItem}
    >
      <i className="material-icons">remove_circle</i>
    </button>
  </li>
);
Item.propTypes = {
  todo: React.PropTypes.object.isRequired,
  toggleDone: React.PropTypes.func.isRequired,
  deleteItem: React.PropTypes.func.isRequired,
};


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      filter: 'all',
      dirty: false,
      items: null,
    };
  }

  componentDidMount() {
    const elements = document.querySelectorAll('.mdl-js-textfield, .mdl-js-button');
    elements.forEach(el => componentHandler.upgradeElement(el));

    // Load items
    fetch('/api/todo', { credentials: 'include' })
      .then(response => {
        if (response.ok) return response.json();
        return { items: [{ text: 'Fake task', done: true }] }
      })
      .then((data) => {
        console.log('data', data);
        this.setState({ items: data.items || [], dirty: true });
      });
  }

  save() {
    const { items } = this.state;
    fetch('/api/todo', {
      credentials: 'include',
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    })
      .then((resp) => { if (resp.ok) this.setState({ dirty: false }); });
  }

  toggleDone(i) {
    const { items } = this.state;
    items[i].done = !items[i].done;
    this.setState({ items, dirty: true });
  }

  deleteItem(i) {
    const { items } = this.state;
    items.splice(i, 1);
    this.setState({ items, dirty: true });
  }

  addItem() {
    const { input, items } = this.state;
    this.setState({
      items: [{ text: input, done: false }, ...items],
      input: '',
      dirty: true,
    });
  }

  render() {
    const { items, filter, input, dirty } = this.state;

    console.log('items', items);

    const filters = {
      all: () => true,
      checked: t => t.done,
      unchecked: t => !t.done,
    };

    let todoElements;
    if (!items) {
      todoElements = (<p>Loading...</p>);
    } else {
      todoElements = items.filter(filters[filter])
        .map((todo, i) => (
          <Item
            todo={todo}
            toggleDone={() => this.toggleDone(i)}
            deleteItem={() => this.deleteItem(i)}
          />
        ));
    }


    return (
      <div className="demo-card-wide mdl-card mdl-shadow--2dp main-card">

        <div className="mdl-card__title" style={styles.cardTitle}>
          <h2 className="mdl-card__title-text">Items</h2>
        </div>

        <div className="mdl-card__supporting-text mdl-card--border" >
          <div
            id="ttf"
            style={{ width: '100%' }}
            className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
          >
            <input
              className="mdl-textfield__input"
              type="text"
              value={input}
              onChange={(e) => { this.setState({ input: e.target.value }); }}
              onKeyDown={(e) => { if (e.key === 'Enter') this.addItem(); }}
            />
            <label className="mdl-textfield__label" htmlFor="sample3">What needs to be done?</label>
          </div>
        </div>


        <ul className="demo-list-control mdl-list">
          {todoElements}
        </ul>

        <div style={styles.cardActions} className="mdl-card__actions mdl-card--border " >
          <button
            className="mdl-button mdl-js-button mdl-js-ripple-effect"
            onClick={() => { this.setState({ filter: 'all' }); }}
          >
            {filter === 'all' ? radioOn : radioOff} All
          </button>
          <button
            className="mdl-button mdl-js-button mdl-js-ripple-effect"
            onClick={() => { this.setState({ filter: 'checked' }); }}
          >
            {filter === 'checked' ? radioOn : radioOff} Checked
          </button>
          <button
            className="mdl-button mdl-js-button mdl-js-ripple-effect"
            onClick={() => { this.setState({ filter: 'unchecked' }); }}
          >
            {filter === 'unchecked' ? radioOn : radioOff} Unchecked
          </button>
        </div>

        <div className="fab-wrapper">
          <button
            className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored"
            disabled={!dirty}
            onClick={() => this.save()}
          >
            <i className="material-icons">save</i>
          </button>
        </div>

      </div >
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
