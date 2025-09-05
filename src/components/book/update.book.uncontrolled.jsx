import { Input, notification, Button, Modal, InputNumber, Select, Form } from 'antd';
import { useEffect, useState } from 'react';
import { updateBookAPI, handleUploadFile } from '../../services/api.service';

const UpdateBookUnControlled = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadBook } = props;
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    console.log("dataUpdate in uncontrolled:", dataUpdate);

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                Id: dataUpdate._id,
                mainText: dataUpdate.mainText,
                author: dataUpdate.author,
                price: dataUpdate.price,
                quantity: dataUpdate.quantity,
                category: dataUpdate.category,
            });
            if (dataUpdate.thumbnail) {
                setPreview(`${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`);
            } else {
                setPreview(null);
            }
        }
    }, [dataUpdate, form]);

    const handleSubmitBtn = async (values) => {
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
        await updateBook(newThumbnail, values);
    }

    const updateBook = async (newThumbnail, form_values) => {
        const { Id, mainText, author, price, quantity, category } = form_values;
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
        form.resetFields();
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
                onOk={() => form.submit()} // Action when click "Create" button
                onCancel={() => resetAndCloseModal()} // Action when click "X" button or outside the modal
                maskClosable={false} // Prevent closing by clicking outside the modal
                okText="Update"
            >
                <Form
                    form={form}
                    onFinish={handleSubmitBtn}
                    layout="vertical"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <Form.Item
                            name="Id"
                            label="ID"
                            rules={[{
                                required: true,
                            }]}
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            name="mainText"
                            label="Main Text"
                            rules={[{
                                required: true,
                                message: 'Please input title!'
                            }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="author"
                            label="Author"
                            rules={[{
                                required: true,
                                message: 'Please input author!'
                            }]} >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Price"
                            rules={[{
                                required: true,
                                message: 'Please input price!'
                            }]} >
                            <InputNumber
                                addonAfter="đ"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="quantity"
                            label="Quantity"
                            rules={[{
                                required: true,
                                message: 'Please input quantity!'
                            }]} >
                            <InputNumber
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="category"
                            label="Category"
                            rules={[{
                                required: true,
                                message: 'Please input category!'
                            }]} >
                            <Select
                                style={{ width: '100%' }}
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
                        </Form.Item>
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
                </Form>
            </Modal >
        </div >
    );
};
export default UpdateBookUnControlled;