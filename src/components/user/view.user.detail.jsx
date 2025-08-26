import { Button, Drawer, notification } from "antd";
import { useState } from "react";
import {
    handleUploadFile,
    updateUserAvatarAPI,
} from "../../services/api.service";
const ViewUserDetail = (props) => {
    const {
        dataDetail,
        setDataDetail,
        isDetailOpen,
        setIsDetailOpen,
        loadUser,
    } = props;

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleOnChangeFile = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };
    const handleUpdateUserAvatar = async () => {
        // step 1: upload file
        const resUpload = await handleUploadFile(selectedFile, "avatar");
        if (resUpload.data) {
            // success
            const newAvatar = resUpload.data.fileUploaded;
            const resUpdateAvatar = await updateUserAvatarAPI(
                newAvatar,
                dataDetail._id,
                dataDetail.fullName,
                dataDetail.phone
            );
            if (resUpdateAvatar.data) {
                setIsDetailOpen(false);
                setSelectedFile(null);
                setPreview(null);
                await loadUser();

                notification.success({
                    message: "Update user avatar",
                    description: "Cap nhat avatar thanh cong",
                });
            } else {
                notification.error({
                    message: "Error update avatar",
                    description: JSON.stringify(resUpdateAvatar.message),
                });
            }
        } else {
            // false
            notification.error({
                message: "Error Upload File",
                description: JSON.stringify(resUpload.message),
            });
        }
        // step 2: upload user
    };

    return (
        <>
            <Drawer
                width={"30vw"}
                title="User Information"
                onClose={() => {
                    setDataDetail(null);
                    setIsDetailOpen(false);
                }}
                open={isDetailOpen}
            >
                {dataDetail ? (
                    <>
                        <p>Id: {dataDetail._id}</p>
                        <br />
                        <p>Full Name: {dataDetail.fullName}</p>
                        <br />
                        <p>Email: {dataDetail.email}</p>
                        <br />
                        <p>Phone: {dataDetail.phone}</p>
                        <br />
                        <p>Avatar: </p>
                        <div
                            style={{
                                marginTop: "10px",
                                height: "100px",
                                width: "150px",
                                border: "1px solid #ccc",
                            }}
                        >
                            <img
                                height={"100"}
                                width={"150"}
                                src={`${
                                    import.meta.env.VITE_BACKEND_URL
                                }/images/avatar/${dataDetail.avatar}`}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="btnUpload"
                                style={{
                                    display: "block",
                                    width: "fit-content",
                                    marginTop: "15px",
                                    padding: "5px 10px",
                                    backgroundColor: "orange",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Upload Avatar
                            </label>
                            <input
                                type="file"
                                hidden
                                id="btnUpload"
                                onChange={(event) => handleOnChangeFile(event)}
                            />
                        </div>
                        {/* <Button type="primary">Upload Avatar</Button> */}
                        {preview && (
                            <>
                                <div
                                    style={{
                                        margin: "10px 0px 15px",
                                        height: "100px",
                                        width: "150px",
                                    }}
                                >
                                    <img
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                        }}
                                        src={preview}
                                    />
                                </div>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        handleUpdateUserAvatar();
                                    }}
                                >
                                    Save
                                </Button>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <p>No Have Information User</p>
                    </>
                )}
            </Drawer>
        </>
    );
};

export default ViewUserDetail;
