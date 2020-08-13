import React, { useReducer, useState, useRef } from "react";
import "./App.css";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface Action {
  id: string;
  text: string;
  type: "ADD_TODO" | "TOGGLE_TODO";
}

function todoReducer(state: Todo, action: Action): Todo {
  switch (action.type) {
    case "ADD_TODO":
      return {
        id: action.id,
        text: action.text,
        completed: false,
      };
    case "TOGGLE_TODO":
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed,
      };

    default:
      return state;
  }
}

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        todoReducer({ id: "1", text: "dummy todo", completed: false }, action),
      ];
    case "TOGGLE_TODO":
      return state.map((item) => todoReducer(item, action));

    default:
      return state;
  }
}

const initialState: Todo[] = [];
let counter = 0;

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newText, setNewText] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="App">
      <input
        ref={inputRef}
        value={newText}
        name="newTodo"
        onChange={(e) => setNewText(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter" && newText) {
            dispatch({
              type: "ADD_TODO",
              text: newText,
              id: (counter++).toString(),
            });

            setNewText("");

            const current = inputRef.current;

            if (current && current.focus) {
              current.focus();
            }
          }
        }}
        placeholder="Type here"
      />

      <button
        type="button"
        onClick={() => {
          if (newText) {
            dispatch({
              type: "ADD_TODO",
              text: newText,
              id: (counter++).toString(),
            });

            setNewText("");

            const current = inputRef.current;

            if (current && current.focus) {
              current.focus();
            }
          }
        }}
      >
        Save
      </button>

      <ol>
        {state.map((item) => (
          <li
            style={{
              cursor: "pointer",
              textDecoration: item.completed ? "line-through" : "none",
              padding: 10,
            }}
            onClick={() =>
              dispatch({ type: "TOGGLE_TODO", id: item.id, text: "dummy text" })
            }
            key={item.id}
          >
            {item.text}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
