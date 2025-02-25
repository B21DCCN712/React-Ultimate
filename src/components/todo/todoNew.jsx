import { useState } from "react";

const TodoNew = (props) => {
    const { addNewToDo, settodoList } = props;
    // useState Hook
    const [inputValue, setInputValue] = useState("Đinh Toàn");

    const onChange = (name) => {
        setInputValue(name);
    };

    const handClick = () => {
        addNewToDo(inputValue);
        setInputValue("");
    };

    return (
        <div className="todo-new">
            <input
                type="text"
                onChange={(event) => onChange(event.target.value)}
                value={inputValue}
            />

            <button style={{ cursor: "pointer" }} onClick={handClick}>
                Add
            </button>
        </div>
    );
};

export default TodoNew;
