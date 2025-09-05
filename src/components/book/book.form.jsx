import { Input, notification, Button, Modal, InputNumber, Select } from "antd";
import { useState } from "react";
import { handleUploadFile, createBookAPI } from "../../services/api.service";

const BookForm = (props) => {
    const { loadBook, isModalOpen, setIsModalOpen } = props;

    const [mainText, setMainText] = useState("");
    const [author, setAuthor] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [category, setCategory] = useState("");

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleSubmitBtn = async () => {
        const uploadedThumbnail = await handleUpdateThumbnail();
        const res = await createBookAPI(
            mainText,
            author,
            price,
            quantity,
            category,
            uploadedThumbnail
        );
        if (res.data) {
            notification.success({
                message: "Success",
                description: "Create book successfully!",
            });
            await loadBook();
            resetAndCloseModal();
        } else {
            notification.error({
                message: "Error",
                description: JSON.stringify(
                    res.message || "Failed to create book"
                ),
            });
        }
    };

    const handleUpdateThumbnail = async () => {
        const resUpload = await handleUploadFile(selectedFile, "book");

        if (resUpload.data) {
            return resUpload.data.fileUploaded; // fileUploaded is the key that response from backend
        } else {
            notification.error({
                message: "Error",
                description: JSON.stringify(
                    resUpload.message || "Failed to upload file"
                ),
            });
            return;
        }
    };

    const resetAndCloseModal = () => {
        setMainText("");
        setAuthor("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setSelectedFile(null);
        setPreview(null);
        setIsModalOpen(false);
    };

    const handleOnChangeFile = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        // I've kept this example simple by using the first image instead of multiple
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="user-form" style={{ margin: "20px 0" }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h3>Table Books</h3>
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>
                        Create Book
                    </Button>
                </div>
            </div>

            <Modal
                title="Create Book"
                closable={{ "aria-label": "Custom Close Button" }}
                open={isModalOpen}
                onOk={() => handleSubmitBtn()}
                onCancel={() => resetAndCloseModal()}
                maskClosable={false} // Prevent closing by clicking outside the modal
                okText="Create"
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                    }}
                >
                    <div>
                        <span>Title</span>
                        <Input
                            value={mainText}
                            onChange={(e) => {
                                setMainText(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <span>Author</span>
                        <Input
                            value={author}
                            onChange={(e) => {
                                setAuthor(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <div>Price</div>
                        <InputNumber
                            addonAfter="đ"
                            style={{ width: "100%" }}
                            value={price}
                            onChange={(value) => {
                                setPrice(value);
                            }}
                        />
                    </div>
                    <div>
                        <span>Quantity</span>
                        <Input
                            value={quantity}
                            onChange={(e) => {
                                setQuantity(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <div>Category</div>
                        <Select
                            style={{ width: "100%" }}
                            onChange={(value) => {
                                setCategory(value);
                            }}
                            // defaultValue='Arts'
                            placeholder="Select a category"
                            options={[
                                { value: "Arts", label: "Arts" },
                                { value: "Business", label: "Business" },
                                { value: "Comics", label: "Comics" },
                                { value: "Cooking", label: "Cooking" },
                                {
                                    value: "Entertainment",
                                    label: "Entertainment",
                                },
                                { value: "History", label: "History" },
                                { value: "Music", label: "Music" },
                                { value: "Sports", label: "Sports" },
                                { value: "Teen", label: "Teen" },
                                { value: "Travel", label: "Travel" },
                            ]}
                        />
                    </div>
                    <div>
                        <div>Thumbnail</div>
                        <div>
                            <label
                                htmlFor="btnUpload"
                                style={{
                                    display: "block",
                                    width: "fit-content",
                                    marginTop: "15px",
                                    padding: "5px 10px",
                                    background: "orange",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Upload
                            </label>
                            <input
                                type="file"
                                hidden
                                id="btnUpload"
                                onChange={(event) => handleOnChangeFile(event)}
                                onClick={(event) => (event.target.value = null)}
                            />
                        </div>
                        {preview && (
                            <>
                                <div
                                    style={{
                                        marginTop: "10px",
                                        marginBottom: "15px",
                                        height: "100px",
                                        width: "150px",
                                    }}
                                >
                                    <img
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                            objectFit: "contain",
                                        }}
                                        src={preview}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default BookForm;
