import React, { useReducer, useState, useRef } from "react";
import "./App.css";

interface Todo {
  id: string;
  text?: string;
  completed: boolean;
  deleted: boolean;
}

interface Action {
  id: string;
  text?: string;
  type: "ADD_TODO" | "TOGGLE_TODO" | "DELETE_TODO";
}

function todoReducer(state: Todo, action: Action): Todo {
  switch (action.type) {
    case "TOGGLE_TODO":
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed,
      };

    case "DELETE_TODO":
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        deleted: true,
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
        { id: action.id, text: action.text, completed: false, deleted: false },
      ];

    case "DELETE_TODO":
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

      <ul style={{ padding: 20, width: 600 }}>
        {state.map(
          (item, index) =>
            !item.deleted && (
              <li
                style={{
                  marginBottom: 10,
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 10,
                  background:
                    index % 2 === 0 ? "#ecf0f1" : "rgba(149, 165, 166, 0.6)",
                }}
                key={item.id}
              >
                <div
                  role="button"
                  style={{
                    cursor: "pointer",
                    textDecorationColor: "rgba(231, 76, 60,1.0)",
                    textDecorationLine: item.completed
                      ? "line-through"
                      : "none",
                  }}
                  onClick={() =>
                    dispatch({
                      type: "TOGGLE_TODO",
                      id: item.id,
                      text: "dummy text",
                    })
                  }
                >
                  {item.text}
                </div>

                <button
                  type="button"
                  style={{
                    border: "1px solid gray",
                    padding: 0,
                    margin: 0,
                    height: 20,
                    width: 20,
                    cursor: "pointer",
                  }}
                  onClick={() => dispatch({ type: "DELETE_TODO", id: item.id })}
                >
                  x
                </button>
              </li>
            )
        )}
      </ul>
    </div>
  );
}

export default App;
