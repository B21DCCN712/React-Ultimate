import { Drawer } from "antd";

const ViewBookDetail = (props) => {
    const { isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail, formatter } = props;

    return (
        <Drawer
            width={"40vw"}
            title="Detail Book"
            closable={{ 'aria-label': 'Close Button' }}
            onClose={() => {
                setDataDetail(null); // set dataDetail to null after close Drawer
                setIsDetailOpen(false);
            }}
            open={isDetailOpen}
        >
            {dataDetail ? <>
                <p>ID: {dataDetail._id}</p>
                <br />
                <p> Title: {dataDetail.mainText}</p>
                <br />
                <p>Author: {dataDetail.author}</p>
                <br />
                <p>Category: {dataDetail.category}</p>
                <br />
                <p>Price: {formatter.format(dataDetail.price)}</p>
                <br />
                <p>Quantity: {dataDetail.quantity}</p>
                <br />
                <p>Sold: {dataDetail.sold}</p>
                <br />
                <p>Thumbnail:</p>
                <div style={{ marginTop: '10px', height: '100px', width: '150px', border: '1px solid #ccc' }}>
                    <img style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${dataDetail.thumbnail}`} />
                </div>
            </> :
                <p>No data</p>}
        </Drawer>
    );
}

export default ViewBookDetail;