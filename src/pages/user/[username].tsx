import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import FriendRequest from "../friend/send_friend_request";
import Respond2FriendRequest from "../friend/respond_friend_request";
import ListFriendRequests from "../friend/friend_request_list";
import SearchUser from "../search_target_user";
import DeleteFriend from "../friends/delete";
import ListFriends from "../friends/list";
import LabelFriends from "../friends/label";
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import React from 'react';
import Link from 'next/link';
import { LogoutOutlined, DeleteOutlined } from '@ant-design/icons';

const UserScreen = () => {
    //获取现有的userName, token, password
    const username = useSelector((state: RootState) => state.auth.name);
    const token = useSelector((state: RootState) => state.auth.token);
    const password = useSelector((state: RootState) => state.auth.password);

    const router = useRouter();
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        //username: "",
        newUsername: "",
        //password: "",
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
        if(name === "username"){
            dispatch(setName(value));
        }
        else if(name === "password"){
            dispatch(setPassword(value));
        }
        else{
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const edit = () => {
        const { newUsername, newPassword, newAvatar, newEmail, newPhoneNumber } = formData;
        fetch(`${BACKEND_URL}/api/modify`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                //Authorization : `Bearer ${token}`
            },
            body : JSON.stringify({
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

    const delete_user = () => {
        fetch(`${BACKEND_URL}/api/delete_user`, {
            method : "DELETE",
            headers : {
                Authorization : `Bearer ${token}`
            }
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
        { label: "User", key: "1", to: `/user/${username}` },
        { label: "Friend List", key: "2", to: "/friends/list" },
        { label: "Friend Request List", key: "3", to: "/friend/friend_request_list" },
        { label: "Messages", key: "4", to: "/messages" },
    ];

    return (
        <>
            <Layout>
            <Header style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
            }}>
                <div className="demo-logo" />
                <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                style={{ flex: 1, minWidth: 0 }}
                >
                {/* 这里放置其他菜单项 */}
                </Menu>
                <Button type="primary" icon={<LogoutOutlined />} onClick={logout}>
                Logout
                </Button>
                <Button type="primary" icon={<DeleteOutlined />} onClick={delete_user}>
                Delete User
                </Button>
            </Header>
            <Layout>
                <Sider
                style={{
                    overflow: 'auto',
                    height: 'calc(100vh - 64px)', // 减去 Header 的高度
                    position: 'sticky',
                    top: '64px', // Header 的高度
                    left: 0,
                }}
                >
                <div className="demo-logo-vertical" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                    {items.map((item) => (
                    <Menu.Item key={item.key}>
                        <Link href={item.to}>{item.label}</Link>
                    </Menu.Item>
                    ))}
                </Menu>
                </Sider>
                <Layout style={{ marginLeft: 200 }}>
                <Header style={{ padding: 0 }} />
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    <div
                    style={{
                        padding: 24,
                        textAlign: 'center',
                        // background: colorBgContainer,
                        // borderRadius: borderRadiusLG,
                    }}
                    >

                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    FishAndChips ©{new Date().getFullYear()}
                </Footer>
                </Layout>
            </Layout>
            </Layout>

            <div>
                <button onClick = {openModal}>
                    Account Info
                </button>
                {showModal && (
                <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <h2>Edit Account Info</h2>
                    <form onSubmit={edit}>
                    <label>
                        Username:
                        <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={handleChange}
                        />
                    </label>
                    <label>
                        Password:
                        <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        />
                    </label>
                    <label>
                        Avatar:
                        <input
                        type="file"
                        name="avatar"
                        onChange={handleChange}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        />
                    </label>
                    <label>
                        Phone Number:
                        <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        />
                    </label>
                    <button type="submit">Save</button>
                    </form>
                </div>
                </div>
            )}
            </div>
            <p><SearchUser /></p>
            //暂时这样列
            <div><p><DeleteFriend /></p></div>
            <div><p><ListFriends /></p></div>
            <div><p><LabelFriends /></p></div>
            <div><p><FriendRequest /></p></div>
            <div><p><Respond2FriendRequest /></p></div>
            <div><p><ListFriendRequests /></p></div>
        </>
    );
};

export default UserScreen;