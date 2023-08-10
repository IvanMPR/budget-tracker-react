import { useState, useEffect, useRef } from "react";

function App() {
  // state
  const [entries, setEntries] = useState(
    () => JSON.parse(localStorage.getItem("entries")) || []
  );
  const [type, setType] = useState("inc");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState(null);
  // derived state
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
  // handlers
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
    if (isEditing) return;
    const filteredEntries = entries.filter((entry) => entry.id !== id);
    setEntries(filteredEntries);
  }
  // effects
  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  return (
    <div className="app">
      <h1>Budget Tracker App - React</h1>
      <Amounts
        availableFunds={availableFunds}
        incomeFunds={incomeFunds}
        expenseFunds={expenseFunds}
        percentage={percentage}
      />
      <Inputs
        type={type}
        setType={setType}
        addEntry={addEntry}
        desc={desc}
        setDesc={setDesc}
        amount={amount}
        setAmount={setAmount}
        entries={entries}
      >
        <RadioInputs setType={setType}>
          <label>Income</label>
          <input type="radio" name="inputs" defaultChecked value={"inc"} />
          <label>Expense</label>
          <input type="radio" name="inputs" value={"exp"} />
        </RadioInputs>
        <FormInputs
          desc={desc}
          setDesc={setDesc}
          amount={amount}
          setAmount={setAmount}
          addEntry={addEntry}
          entries={entries}
          type={type}
        />
      </Inputs>
      <ListsParent
        incomeEntries={incomeEntries}
        expenseEntries={expenseEntries}
        deleteEntry={deleteEntry}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        entryToEdit={entryToEdit}
        setEntryToEdit={setEntryToEdit}
        setEntries={setEntries}
      />
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

function Amounts(props) {
  return (
    <>
      <Amount bgColor="lightgray">
        <span className="label-span">Available funds: </span>
        <h2>{props.availableFunds}</h2>
      </Amount>
      <Amount bgColor="yellowgreen">
        <span className="label-span">Income: </span>
        <h3>{props.incomeFunds}</h3>
      </Amount>
      <Amount bgColor="orangered">
        <span className="label-span">Expense: </span>
        <h3>{props.expenseFunds}</h3>
        <span className="label-span">
          {isNaN(props.percentage) || props.percentage === Infinity
            ? ""
            : props.percentage + " %"}
        </span>
      </Amount>
    </>
  );
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

function FormInputs(props) {
  const descriptionInput = useRef(null);

  useEffect(() => {
    descriptionInput.current.focus();
  }, [props.type, props.entries]);

  return (
    <form className="other-inputs">
      <input
        type="text"
        placeholder="Add description"
        className="value-inputs"
        value={props.desc}
        onChange={(e) => props.setDesc(e.target.value)}
        ref={descriptionInput}
      />
      <input
        type="number"
        placeholder="Add amount"
        className="value-inputs"
        value={props.amount}
        onChange={(e) => props.setAmount(e.target.value)}
      />
      <button type="submit" className="btn" onClick={props.addEntry}>
        New entry
      </button>
    </form>
  );
}

function Inputs({ children }) {
  return <div className="inputs-div">{children}</div>;
}

function ListsParent({
  isEditing,
  setIsEditing,
  incomeEntries,
  expenseEntries,
  deleteEntry,
  entryToEdit,
  setEntryToEdit,
  setEntries,
}) {
  return (
    <div className="lists">
      <div className="inc-list">
        <h2>Income</h2>
        {incomeEntries.length === 0 ? (
          "No income entries"
        ) : (
          <List
            type="inc-list"
            typeOfEntries={incomeEntries}
            deleteEntry={deleteEntry}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setEntryToEdit={setEntryToEdit}
            setEntries={setEntries}
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
            typeOfEntries={expenseEntries}
            deleteEntry={deleteEntry}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setEntryToEdit={setEntryToEdit}
            setEntries={setEntries}
          />
        )}
      </div>
      {isEditing ? (
        <EditingModal
          setIsEditing={setIsEditing}
          setEntryToEdit={setEntryToEdit}
          entryToEdit={entryToEdit}
          setEntries={setEntries}
        />
      ) : (
        ""
      )}
    </div>
  );
}

function List({
  type,
  typeOfEntries,
  deleteEntry,
  isEditing,
  setIsEditing,
  setEntryToEdit,
}) {
  return (
    <div className="single-list">
      <ul className={`list ${type}`}>
        {typeOfEntries.map((entry) => (
          <ListItem
            entry={entry}
            key={entry.id}
            deleteEntry={deleteEntry}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setEntryToEdit={setEntryToEdit}
          />
        ))}
      </ul>
    </div>
  );
}

function ListItem({
  entry,
  deleteEntry,
  isEditing,
  setIsEditing,
  setEntryToEdit,
}) {
  const [showInfo, setShowInfo] = useState(false);

  function handleInfo() {
    if (isEditing) return;
    setShowInfo(!showInfo);
  }

  function handleEdit() {
    setEntryToEdit(entry);
    setIsEditing(true);
  }
  return (
    <li className="li-item">
      {entry.desc}
      {showInfo ? <span className="created-at">{entry.time}</span> : ""}
      <div>
        <span className="item-amount">{entry.amount}</span>
      </div>
      <div>
        <span className="btn-info">
          <i
            className="fa-solid fa-circle-info"
            title={
              isEditing
                ? 'Can"t show info while editing'
                : "Click for date/time info"
            }
            onClick={handleInfo}
          ></i>
        </span>
        <span className="btn-edit" onClick={() => handleEdit()}>
          <i
            className="fa-solid fa-pen-to-square"
            title={
              isEditing ? 'Can"t edit entry while modal is open' : "Edit entry"
            }
          ></i>
        </span>
        <span className="btn-delete" onClick={() => deleteEntry(entry.id)}>
          <i
            className="fa-solid fa-trash"
            title={
              isEditing ? 'Can"t delete entry while editing' : "Delete entry"
            }
          ></i>
        </span>
      </div>
    </li>
  );
}

function EditingModal({
  setIsEditing,
  entryToEdit,
  setEntryToEdit,
  setEntries,
}) {
  const [newDesc, setNewDesc] = useState(entryToEdit.desc);
  const [newAmount, setNewAmount] = useState(entryToEdit.amount);

  const newDescriptionInput = useRef(null);

  useEffect(() => {
    newDescriptionInput.current.focus();
  }, []);

  function closeModal() {
    setIsEditing(false);
    setEntryToEdit(null);
  }

  function handleNewDesc(e) {
    setNewDesc(e.target.value);
  }

  function handleNewAmount(e) {
    setNewAmount(Number(e.target.value));
  }

  function handleEditEntry(id) {
    setEntries((entries) =>
      entries.map((entry) =>
        entry.id === id ? { ...entry, desc: newDesc, amount: newAmount } : entry
      )
    );
  }

  return (
    <div className="editing-modal">
      <span className="close-modal" title="Close window" onClick={closeModal}>
        X
      </span>
      <h2>Edit entry</h2>
      <form className="editing-form">
        <input
          type="text"
          value={newDesc}
          onChange={handleNewDesc}
          ref={newDescriptionInput}
        />
        <input type="number" value={newAmount} onChange={handleNewAmount} />
        <button
          type="submit"
          className="btn"
          onClick={() => handleEditEntry(entryToEdit.id)}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default App;
