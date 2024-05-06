import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken } from "../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import FriendRequest from "./friend/send_friend_request";
import Respond2FriendRequest from "./friend/respond_friend_request";
import ListFriendRequests from "./friend/friend_request_list";
import SearchUser from "./search_target_user";
import DeleteFriend from "./friends/delete";
import ListFriends from "./friends/list";
import LabelFriends from "./friends/label";
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button, Form, Input, Modal, Image } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import React from 'react';
import Link from 'next/link';
import { LogoutOutlined, DeleteOutlined } from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import ChatPage from "../components/chat/ChatLayout"; //测试页面

const UserScreen = () => {
    //获取现有的userName, token, password
    const userid = useSelector((state: RootState) => state.auth.userid);
    const username = useSelector((state: RootState) => state.auth.name);
    const token = useSelector((state: RootState) => state.auth.token);
    const password = useSelector((state: RootState) => state.auth.password);

    const router = useRouter();
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        newUsername: "",
        password: "",
        newPassword: "",
        avatar: "",
        newAvatar: "",
        email: "",
        newEmail: "",
        phoneNumber: "",
        newPhoneNumber: ""
    });

    const openModal = () => {
        setShowModal(true);
      };
    const closeModal = () => {
        setShowModal(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        if(name === "newUsername"){
            dispatch(setName(value));
        }
        else if(name === "newPassword"){
            dispatch(setPassword(value));
        }
    };

    const edit = () => {
        const { username, password, newUsername, newPassword, newAvatar, newEmail, newPhoneNumber } = formData;
        fetch(`${BACKEND_URL}/api/modify`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `${token}`
            },
            body : JSON.stringify({
                userid,
                username,
                newUsername,
                password,
                newPassword,
                newAvatar,
                newEmail,
                newPhoneNumber,
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("用户信息更新成功");
            }
            else {
                alert("用户信息更新失败"+res.info);
            }
        })
        .catch((err) => alert(FAILURE_PREFIX + err));

        closeModal();
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        dispatch(setName(""));
        dispatch(setToken(""));
        router.push("/");
    };

    const deleteUser = () => {
        //const username = useSelector((state: RootState) => state.auth.name);
        fetch(`${BACKEND_URL}/api/delete_user`, {
            method : "DELETE",
            headers : {
                Authorization : `${token}`
            },
            body: JSON.stringify({
                userid,
            })
        })
        .then(response => {
            if(response.ok) {
                logout();
            }
            else {
                alert(FAILURE_PREFIX);
            }
        })
        .catch((err) => {
            alert("An error occurred while deleting account");
        });
    };

    const [collapsed, setCollapsed] = useState(false);
    const items = [
        { label: "User", key: "1", to: "/home" },
        { label: "Friend List", key: "2", to: "/friends/list" },
        { label: "Friend Request List", key: "3", to: "/friend/friend_request_list" },
        //{ label: "Messages", key: "4", to: "/group/list" },
    ];

    const [showChatSidebar, setShowChatSidebar] = useState(false);
    const [selectedChat, setSelectedChat] = useState("");

    const handleMenuClick = () => {
        setShowChatSidebar(true);
    };

    const cancelMenuClick = () => {
        setShowChatSidebar(false);
    };

    const handleChatSelect = (info: { key: string }) => {
        setSelectedChat(info.key);
      };

    return (
        <Layout>
            <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Button type="primary" icon={<LogoutOutlined />} onClick={logout}>Logout</Button>
                    <Button type="primary" icon={<DeleteOutlined />} onClick={deleteUser}>Delete Account</Button>
                </div>
            </Header>
            <Layout>
            <Sider
                style={{
                    overflow: 'auto',
                    height: 'calc(100vh - 64px)', // 减去 Header 的高度
                    position: 'sticky',
                    top: '64px', // Header 的高度
                    left: 0,
                    //background: colorBgContainer,
                }}
                width={200}
                >
                <div>
                    <Avatar
                        size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                        icon={<UserOutlined />}
                    />
                </div>
                <div>
                    <Button onClick={openModal}>Account Info</Button>
                    {showModal && (
                        <Modal
                            visible={showModal}
                            onCancel={closeModal}
                            footer={null}
                        >
                            <h2>Edit Account Info</h2>
                            <Form onFinish={edit}>
                                <Form.Item label="Password">
                                    <Input.Password name="password" value={formData.password} onChange={handleChange} />
                                </Form.Item>
                                <Form.Item label="New Username">
                                    <Input name="newUsername" value={formData.newUsername} onChange={handleChange} />
                                </Form.Item>
                                <Form.Item label="New Password">
                                    <Input.Password name="newPassword" value={formData.newPassword} onChange={handleChange} />
                                </Form.Item>
                                <Form.Item label="New Email">
                                    <Input name="newEmail" value={formData.newEmail} onChange={handleChange} />
                                </Form.Item>
                                <Form.Item label="New Phone Number">
                                    <Input name="newPhoneNumber" value={formData.newPhoneNumber} onChange={handleChange} />
                                </Form.Item>
                                <Button type="primary" htmlType="submit">Save</Button>
                            </Form>
                        </Modal>
                    )}
                </div>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
                    {items.map((item) => (
                    <Menu.Item key={item.key}>
                        <Link href={item.to}>{item.label}</Link>
                    </Menu.Item>
                    ))}
                    <Menu.Item key="messages" onClick={handleMenuClick}>
                        Messages
                    </Menu.Item>
                </Menu>
                </Sider>
                <Content>
                    <Layout>
                    {showChatSidebar && (
                        <Sider 
                            width={200} theme="light"
                            style={{
                                overflow: 'auto',
                                height: 'calc(100vh - 64px)', // 减去 Header 的高度
                                position: 'sticky',
                                top: '64px', // Header 的高度
                            }}
                        >
                        <Menu mode="inline" onSelect={handleChatSelect}>
                            <Menu.Item key="chat1">Chat 1</Menu.Item>
                            <Menu.Item key="chat2">Chat 2</Menu.Item>
                            <Menu.Item key="chat3">Chat 3</Menu.Item>
                            {/* Add more chat options as needed */}
                        </Menu>
                        <Button block onClick={cancelMenuClick}>关闭</Button>
                        </Sider>
                        )}
                    <SearchUser />
                    <ChatPage chat={selectedChat} />
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    );
};

export default UserScreen;