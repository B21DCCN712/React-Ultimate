import { ArrowRightOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    message,
    notification,
    Row,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "../services/api.service";
import { useContext, useState } from "react";
import { AuthContext } from "../components/context/auth.context";

const LoginPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const onFinish = async (values) => {
        setLoading(true);
        const res = await loginAPI(values.email, values.password);

        if (res.data) {
            message.success("Đăng nhập thành công.");
            localStorage.setItem("access_token", res.data.access_token);
            setUser(res.data.user);
            navigate("/");
        } else {
            notification.error({
                message: "Error login",
                description: JSON.stringify(res.message),
            });
        }
        setLoading(false);
    };
    return (
        <Row justify={"center"} style={{ marginTop: "60px" }}>
            <Col xs={24} md={16} lg={6}>
                <fieldset
                    style={{
                        padding: "15px",
                        margin: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                >
                    <legend style={{ fontWeight: "500" }}>Đăng nhập</legend>
                    <Form
                        form={form}
                        layout="vertical"
                        style={{ margin: "10px" }}
                        onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui long nhap Email!",
                                },
                                {
                                    type: "email",
                                    message: "Email khong dung dinh dang",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Password khong duoc de trong",
                                },
                                {
                                    min: 6,
                                    message: "Password phai tu 6 ky tu tro len",
                                },
                            ]}
                        >
                            <Input.Password
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") form.submit();
                                }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        form.submit();
                                    }}
                                    loading={loading}
                                >
                                    Login
                                </Button>
                                <Link to={"/"}>
                                    Go to homepage <ArrowRightOutlined />
                                </Link>
                            </div>
                        </Form.Item>
                    </Form>

                    <Divider />

                    <div style={{ textAlign: "center" }}>
                        Chưa có tài khoản?{" "}
                        <Link to={"/register"}>Đăng ký tại đây</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
};

export default LoginPage;
