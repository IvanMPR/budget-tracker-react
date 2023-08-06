import { useState, useEffect } from "react";

function App() {
  const [entries, setEntries] = useState([]);
  const [type, setType] = useState("inc");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState(0);

  const incomeFunds = entries
    .filter((entry) => entry.type === "inc")
    .map((entry) => Number(entry.amount))
    .reduce((acc, curr) => acc + curr, 0);

  const expenseFunds = entries
    .filter((entry) => entry.type === "exp")
    .map((entry) => Number(entry.amount))
    .reduce((acc, curr) => acc + curr, 0);

  const availableFunds = incomeFunds - expenseFunds;

  function addEntry() {
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
    // q: how to shorten the date in newEntry.time?
    // a: use toLocaleString() method
    // q: how to shorten the year in newEntry.time?
    // a: use toLocaleString() method with options
    // q: show me the options needed to shorten the year in newEntry.time
    // a: { year: "2-digit" }
    // q: do I need the first argument in toLocaleString() method?
    // a: no, it's optional
    // q: how to shorten the time only to two digits hours and minutes and am/pm?
    // a: use toLocaleTimeString() method with options
    // q: show me the options needed to shorten the time in newEntry.time
    // a: { hour: "2-digit", minute: "2-digit" }
    // q: how to make months in abbreviations?
    // a: use toLocaleString() method with options
    // q: show me the options needed to make months in abbreviations in newEntry.time
    // a: { month: "short" }
    // q: how to add dash between day, month and year in newEntry.time?
    // a: use toLocaleString() method with options
    // q: show me the options needed to add dash between day, month and year in newEntry.time
    // a: { day: "2-digit", month: "short", year: "2-digit" }
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
          <span className="label-span"> 20%</span>
        </Amount>
      </Amounts>
      <Inputs setType={setType} addEntry={addEntry}>
        <RadioInputs setType={setType}>
          <label>Income</label>
          <input type="radio" name="inputs" defaultChecked value={"inc"} />
          <label>Expense</label>
          <input type="radio" name="inputs" value={"exp"} />
        </RadioInputs>
        <div className="other-inputs">
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
          <button className="btn" onClick={addEntry}>
            New entry
          </button>
        </div>
      </Inputs>
      <div className="lists">
        <List type="inc-list" entries={entries} />
        <List type="exp-list" entries={entries} />
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

function List({ type, entries }) {
  return (
    <div className="single-list">
      {type === "inc-list" ? <h2>Income</h2> : <h2>Expense</h2>}
      <ul className={`list ${type}`}>
        {entries.map((entry) => (
          <ListItem entry={entry} />
        ))}
        {/* <ListItem entries={entries} /> */}
      </ul>
    </div>
  );
}

function ListItem({ entry }) {
  return (
    <li className="li-item" key={entry.id}>
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
        <span className="btn-delete">
          <i className="fa-solid fa-trash" title="Delete entry"></i>
        </span>
      </div>
    </li>
  );
}

export default App;
