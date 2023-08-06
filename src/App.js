import { useState, useRef } from "react";

function App() {
  const [entries, setEntries] = useState([]);
  const [type, setType] = useState("inc");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState(0);

  const incomeEntries = entries.filter((entry) => entry.type === "inc");
  const expenseEntries = entries.filter((entry) => entry.type === "exp");

  const incomeFunds = incomeEntries
    .map((entry) => Number(entry.amount))
    .reduce((acc, curr) => acc + curr, 0);

  const expenseFunds = expenseEntries
    .map((entry) => Number(entry.amount))
    .reduce((acc, curr) => acc + curr, 0);

  const availableFunds = incomeFunds - expenseFunds;

  const percentage = Math.round((expenseFunds / incomeFunds) * 100);

  function addEntry(e) {
    e.preventDefault();

    if (desc === "" || amount === 0) {
      alert("Please fill in all fields!");
      return;
    }

    const newEntry = {
      id: crypto.randomUUID(),
      type,
      desc,
      amount,
      time: new Date().toLocaleString("en-us", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setEntries([...entries, newEntry]);

    setDesc("");
    setAmount(0);
  }

  function deleteEntry(id) {
    const filteredEntries = entries.filter((entry) => entry.id !== id);
    setEntries(filteredEntries);
  }

  return (
    <div className="app">
      <h1>Budget Tracker App - React</h1>
      <Amounts>
        <Amount bgColor="lightgray">
          <span className="label-span">Available funds: </span>
          <h2>{availableFunds}</h2>
        </Amount>
        <Amount bgColor="yellowgreen">
          <span className="label-span">Income: </span>
          <h3>{incomeFunds}</h3>
        </Amount>
        <Amount bgColor="orangered">
          <span className="label-span">Expense: </span> <h3>{expenseFunds}</h3>
          <span className="label-span">
            {isNaN(percentage) || percentage === Infinity
              ? ""
              : percentage + " %"}
          </span>
        </Amount>
      </Amounts>
      <Inputs setType={setType} addEntry={addEntry}>
        <RadioInputs setType={setType}>
          <label>Income</label>
          <input type="radio" name="inputs" defaultChecked value={"inc"} />
          <label>Expense</label>
          <input type="radio" name="inputs" value={"exp"} />
        </RadioInputs>
        <form className="other-inputs">
          <input
            type="text"
            placeholder="Add description"
            className="value-inputs"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <input
            type="number"
            placeholder="Add amount"
            className="value-inputs"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button type="submit" className="btn" onClick={addEntry}>
            New entry
          </button>
        </form>
      </Inputs>
      <div className="lists">
        <div className="inc-list">
          <h2>Income</h2>
          {incomeEntries.length === 0 ? (
            "No income entries"
          ) : (
            <List
              type="inc-list"
              entries={incomeEntries}
              deleteEntry={deleteEntry}
            />
          )}
        </div>
        <div className="exp-list">
          <h2>Expense</h2>
          {expenseEntries.length === 0 ? (
            "No expense entries"
          ) : (
            <List
              type="exp-list"
              entries={expenseEntries}
              deleteEntry={deleteEntry}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Amount({ children, bgColor }) {
  const styles = { backgroundColor: bgColor };
  return (
    <div className="amount" style={styles}>
      {children}
    </div>
  );
}

function Amounts({ children }) {
  return <>{children}</>;
}

function RadioInputs({ children, setType }) {
  function handleType(e) {
    setType(e.target.value);
  }
  return (
    <div className="radio-inputs-div" onChange={handleType}>
      {children}
    </div>
  );
}

function Inputs({ children }) {
  return <div className="inputs-div">{children}</div>;
}

function List({ type, entries, deleteEntry }) {
  return (
    <div className="single-list">
      <ul className={`list ${type}`}>
        {entries.map((entry) => (
          <ListItem entry={entry} key={entry.id} deleteEntry={deleteEntry} />
        ))}
      </ul>
    </div>
  );
}

function ListItem({ entry, deleteEntry }) {
  return (
    <li className="li-item">
      {entry.desc}
      <span className="created-at">{entry.time}</span>
      <div>
        <span className="item-amount">{entry.amount}</span>
      </div>
      <div>
        <span className="btn-info">
          <i
            className="fa-solid fa-circle-info"
            title="Click for additional info"
          ></i>
        </span>
        <span className="btn-edit">
          <i className="fa-solid fa-pen-to-square" title="Edit entry"></i>
        </span>
        <span className="btn-delete" onClick={() => deleteEntry(entry.id)}>
          <i className="fa-solid fa-trash" title="Delete entry"></i>
        </span>
      </div>
    </li>
  );
}

export default App;
