import { useState } from "react";
import { handleUploadFile } from "../../services/api.service";
import { createBookAPI } from "../../services/api.service";
import {
    Button,
    Input,
    InputNumber,
    Modal,
    notification,
    Select,
    Form,
} from "antd";

const CreateBookUncontrolled = (props) => {
    const { loadBook, isModalOpen, setIsModalOpen } = props;
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [form] = Form.useForm();
    const handleSubmitBtn = async (values) => {
        if (!selectedFile) {
            notification.error({
                message: "Error create book",
                description: "Vui lòng upload ảnh thumbnail",
            });
            return;
        }

        const uploadedThumbnail = await handleUpdateThumbnail();
        const { mainText, author, price, quantity, category } = values;
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
            // After creating book successfully, re-load book list and reset/ close modal
            resetAndCloseModal();
            await loadBook();
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
        form.resetFields();
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
                title="Create Book Uncontrolled"
                closable={{ "aria-label": "Custom Close Button" }}
                open={isModalOpen} // Control the visibility of the modal
                onOk={() => form.submit()} // Action when click "Create" button
                onCancel={() => resetAndCloseModal()} // Action when click "X" button or outside the modal
                maskClosable={false} // Prevent closing by clicking outside the modal
                okText="Create"
            >
                <Form form={form} onFinish={handleSubmitBtn} layout="vertical">
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px",
                        }}
                    >
                        <Form.Item
                            name="mainText"
                            label="Main Text"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input title!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="author"
                            label="Author"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input author!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Price"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input price!",
                                },
                            ]}
                        >
                            <InputNumber
                                addonAfter="đ"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="quantity"
                            label="Quantity"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input quantity!",
                                },
                            ]}
                        >
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item
                            name="category"
                            label="Category"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input category!",
                                },
                            ]}
                        >
                            <Select
                                style={{ width: "100%" }}
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
                        </Form.Item>
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
                                    onChange={(event) =>
                                        handleOnChangeFile(event)
                                    }
                                    onClick={(event) =>
                                        (event.target.value = null)
                                    }
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
                </Form>
            </Modal>
        </div>
    );
};

export default CreateBookUncontrolled;
