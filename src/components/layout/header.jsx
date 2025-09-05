import { Link, useNavigate  } from "react-router-dom";
import { Menu, message  } from "antd";
import {
    AliwangwangOutlined,
    BookOutlined,
    HomeTwoTone,
    LoginOutlined,
    SettingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useContext, useState } from "react";
import { AuthContext } from "../context/auth.context";
import { logoutAPI } from "../../services/api.service";
const Header = () => {
    const [current, setCurrent] = useState("");
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);
    const onClick = (e) => {
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            // clean data
            localStorage.removeItem("access_token");
            setUser({
                email: "",
                phone: "",
                fullName: "",
                role: "",
                avatar: "",
                id: "",
            });
            message.success("Logout thành công.");

            // redirect to home
            navigate("/");
        }
    };

    const items = [
        {
            label: <Link to={"/"}>Home</Link>,
            key: "home",
            icon: <HomeTwoTone />,
        },
        {
            label: <Link to={"/users"}>Users</Link>,
            key: "users",
            icon: <UserOutlined />,
        },
        {
            label: <Link to={"/books"}>Books</Link>,
            key: "books",
            icon: <BookOutlined />,
        },
        ...(!user.id
            ? [
                  {
                      label: <Link to={"/login"}>Đăng nhập</Link>,
                      key: "login",
                      icon: <LoginOutlined />,
                  },
              ]
            : []),

        ...(user.id
            ? [
                  {
                      label: `Welcome ${user.fullName}`,
                      key: "setting",
                      icon: <AliwangwangOutlined />,
                      children: [
                          {
                              label: (
                                  <span
                                      onClick={() => {
                                          handleLogout();
                                      }}
                                  >
                                      Đăng xuất
                                  </span>
                              ),
                              key: "logout",
                          },
                      ],
                  },
              ]
            : []),
    ];

    return (
        <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
        />
    );
};
export default Header;
