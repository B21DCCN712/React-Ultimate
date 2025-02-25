const TodoData = (props) => {
    const { todoList, deleteToDo } = props;

    const handleClick = (id) => {
        deleteToDo(id);
    };

    return (
        <div className="todo-data">
            {todoList.map((items, index) => {
                return (
                    <div className="todo-items" key={items.id}>
                        <div>{items.name}</div>
                        <button onClick={() => handleClick(items.id)}>
                            Delete
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default TodoData;
