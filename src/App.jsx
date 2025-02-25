import { useState } from "react";
import "./components/todo/todo.css";
import TodoData from "./components/todo/todoData";
import TodoNew from "./components/todo/todoNew";
import imgLogo from "./assets/react.svg";

const App = () => {
    const [todoList, setTodoList] = useState([]);

    const addNewToDo = (name) => {
        if (name != "") {
            const newTodo = {
                id: randomIntFromInterval(1, 1000),
                name: name,
            };
            setTodoList([...todoList, newTodo]);
        }
    };

    const deleteToDo = (id) => {
        console.log("Deleteid : ", id);
        const newTodo = todoList.filter((item) => item.id != id);
        setTodoList(newTodo);
    };

    const randomIntFromInterval = (min, max) => {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    return (
        <div className="todo-container">
            <div className="todo-title">Todo List</div>
            <TodoNew addNewToDo={addNewToDo} />

            {todoList.length > 0 ? (
                <TodoData todoList={todoList} deleteToDo={deleteToDo} />
            ) : (
                <div className="Image">
                    <img src={imgLogo} className="logo" alt="" />
                </div>
            )}
        </div>
    );
};

export default App;
