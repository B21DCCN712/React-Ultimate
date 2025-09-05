
import { Input, notification, Button, Modal, InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';
import { updateBookAPI, handleUploadFile } from '../../services/api.service';

const UpdateBookControl = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadBook } = props;
    const [Id, setId] = useState('');
    const [mainText, setMainText] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (dataUpdate) {
            setId(dataUpdate._id);
            setMainText(dataUpdate.mainText);
            setAuthor(dataUpdate.author);
            setPrice(dataUpdate.price);
            setQuantity(dataUpdate.quantity);
            setCategory(dataUpdate.category);
            if (dataUpdate.thumbnail) {
                setPreview(`${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`);
            } else {
                setPreview(null);
            }
        }
    }, [dataUpdate]);

    const handleSubmitBtn = async () => {
        //không có ảnh preview + không có file => return
        if (!selectedFile && !preview) {
            notification.error({
                message: "Error update book",
                description: "Vui lòng upload ảnh thumbnail"
            })
            return;
        }

        let newThumbnail = "";
        //có ảnh preview và không có file => không upload file
        if (!selectedFile && preview) {
            //do nothing
            newThumbnail = dataUpdate.thumbnail;
        } else {
            //có ảnh preview và có file => upload file
            const resUpload = await handleUploadFile(selectedFile, "book");
            if (resUpload.data) {
                //success
                newThumbnail = resUpload.data.fileUploaded;
            } else {
                //failed
                notification.error({
                    message: "Error upload file",
                    description: JSON.stringify(resUpload.message)
                });
                return;
            }
        }

        //step 2: update book
        await updateBook(newThumbnail);
    }

    const updateBook = async (newThumbnail) => {
        const res = await updateBookAPI(Id, mainText, author, price, quantity, category, newThumbnail)
        if (res.data) {
            resetAndCloseModal()
            await loadBook();
            notification.success({
                message: "Update book",
                description: "Cập nhật thành công",
            })
        } else {
            notification.error({
                message: "Error update book",
                description: JSON.stringify(res.message),
            })
        }
    }

    const resetAndCloseModal = () => {
        setMainText("");
        setAuthor("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setSelectedFile(null);
        setPreview(null);
        setId("");
        setDataUpdate(null); // Clear dataUpdate to avoid issues when reopening the modal (no data display)
        setIsModalUpdateOpen(false);
    }

    const handleOnChangeFile = async (event) => {
        console.log("File changed");
        if (!event.target.files || event.target.files.length === 0) {
            return
        }
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file); // get name of the selected file from local
            setPreview(URL.createObjectURL(file)); // Create a preview URL for the selected file from local
        }
    }

    return (
        <div className="user-form" style={{ margin: '20px 0' }}>
            <Modal
                title="Update Book"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalUpdateOpen} // Control the visibility of the modal
                onOk={() => handleSubmitBtn()} // Action when click "Create" button
                onCancel={() => resetAndCloseModal()} // Action when click "X" button or outside the modal
                maskClosable={false} // Prevent closing by clicking outside the modal
                okText="Update"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <span>ID</span>
                        <Input
                            value={Id}
                            disabled
                        />
                    </div>
                    <div>
                        <span>Title</span>
                        <Input
                            value={mainText}
                            onChange={(e) => { setMainText(e.target.value) }}
                        />
                    </div>
                    <div>
                        <span>Author</span>
                        <Input
                            value={author}
                            onChange={(e) => { setAuthor(e.target.value) }}
                        />
                    </div>
                    <div>
                        <div>Price</div>
                        <InputNumber
                            addonAfter="đ"
                            style={{ width: '100%' }}
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
                                setQuantity(e.target.value)
                            }}
                        />
                    </div>
                    <div>
                        <div>Category</div>
                        <Select
                            value={category}
                            style={{ width: '100%' }}
                            onChange={(value) => { setCategory(value); }}
                            placeholder="Select a category"
                            options={[
                                { value: 'Arts', label: 'Arts' },
                                { value: 'Business', label: 'Business' },
                                { value: 'Comics', label: 'Comics' },
                                { value: 'Cooking', label: 'Cooking' },
                                { value: 'Entertainment', label: 'Entertainment' },
                                { value: 'History', label: 'History' },
                                { value: 'Music', label: 'Music' },
                                { value: 'Sports', label: 'Sports' },
                                { value: 'Teen', label: 'Teen' },
                                { value: 'Travel', label: 'Travel' },
                            ]}
                        />
                    </div>
                    <div>
                        <div>Thumbnail</div>
                        <div>
                            <label htmlFor='btnUpload' style={{
                                display: "block",
                                width: "fit-content",
                                marginTop: "15px",
                                padding: "5px 10px",
                                background: "orange",
                                borderRadius: "5px",
                                cursor: "pointer"
                            }}>
                                Upload
                            </label>
                            <input
                                type='file' hidden id='btnUpload'
                                onChange={(event) => handleOnChangeFile(event)}
                                onClick={(event) => event.target.value = null}
                            />
                        </div>
                        {preview &&
                            <>
                                <div style={{
                                    marginTop: "10px",
                                    marginBottom: "15px",
                                    height: "100px", width: "150px",
                                }}>
                                    <img style={{ height: "100%", width: "100%", objectFit: "contain" }}
                                        src={preview} />
                                </div>
                            </>
                        }
                    </div>
                </div >
            </Modal >
        </div >
    );
};
export default UpdateBookControl;