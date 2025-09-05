import BookTable from "../components/book/book.table";
import { fetchAllBooksAPI } from "../services/api.service";
import { useState, useEffect } from "react";
import BookForm from "../components/book/book.form";
const BookPage = () => {
    const [dataBook, setDataBook] = useState([]);
    // Pagination state
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        loadBook();
    }, [current, pageSize]); // Anytime current or pageSize changes, loadBook will be called

    const loadBook = async () => {
        const res = await fetchAllBooksAPI(current, pageSize);
        if (res.data) {
            setDataBook(res.data.result);
            setCurrent(res.data.meta.current);
            setPageSize(res.data.meta.pageSize);
            setTotal(res.data.meta.total);
        } else {
            console.error("Failed to fetch users:", res.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>

            <BookTable
                dataBook={dataBook}
                loadBook={loadBook}
                current={current}
                pageSize={pageSize}
                total={total}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
            />
        </div>
    );
};

export default BookPage;
