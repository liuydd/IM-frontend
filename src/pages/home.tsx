import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken,setavatar } from "../redux/auth";
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
import { Breadcrumb, Layout, Menu, theme, Button, Form, Input, Modal, Image,Tooltip } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import React from 'react';
import Link from 'next/link';
import { LogoutOutlined, DeleteOutlined } from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import ChatPage from "../components/chat/ChatLayout"; //测试页面
import HomePage from "../components/chat/HomePage";
import faye from "../avatars/faye.jpg";
import spike from "../avatars/spike.jpg";
import asuka from "../avatars/asuka.jpg";
import fuu from "../avatars/fuu.jpg";
import jin from "../avatars/jin.jpg";
import mugen from "../avatars/mugen.jpg";
import Rei from "../avatars/Rei.jpg";
import ritsuko from "../avatars/ritsuko.jpg";
import { StaticImageData } from "next/image";
import { useLocalStorageState, useRequest } from 'ahooks';
import { db } from "../api/db"

const UserScreen = () => {
    //获取现有的userName, token, password
    const userid = useSelector((state: RootState) => state.auth.userid);
    const avatar = useSelector((state: RootState) => state.auth.avatar);
    const username = useSelector((state: RootState) => state.auth.name);
    const token = useSelector((state: RootState) => state.auth.token);
    const password = useSelector((state: RootState) => state.auth.password);
    const [selectedAvatar, setSelectedAvatar] = useState<string>(avatar);
    const [avatarHovered, setAvatarHovered] = useState(false);
    const [me, setMe] = useLocalStorageState('me', { defaultValue: 'test' });

    const avatarMap: { [key: string]:  StaticImageData} = {
        "faye": faye,
        "spike": spike,
        "asuka": asuka,
        "fuu": fuu,
        "jin": jin,
        "mugen": mugen,
        "Rei": Rei,
        "ritsuko": ritsuko,
    };
    const UserAvatar = avatarMap[avatar]; // 根据字符串值获取图片路径

    const router = useRouter();
    const dispatch = useDispatch();

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
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

    
    const openPasswordModal = () => {
        setShowPasswordModal(true);
      };
    
    const closePasswordModal = () => {
    setShowPasswordModal(false);
    };

    const openProfileModal = () => {
    setShowProfileModal(true);
    };

    const closeProfileModal = () => {
    setShowProfileModal(false);
    };

    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const handleAvatarClick = () => {
        setShowAvatarModal(true);
      };
      
    const handleAvatarModalClose = () => {
        setShowAvatarModal(false);
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

    const handlePasswordSubmit = () => {
        // 发送密码到后端进行验证
        fetch(`${BACKEND_URL}/api/checkPassword`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            userid,
            password: formData.password,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (Number(res.code) === 0) {
              // 密码验证成功，关闭密码验证模态框，显示修改profile的模态框
              setShowPasswordModal(false);
              setShowProfileModal(true);
            } else {
              // 密码验证失败，提示用户密码错误
              alert("密码错误，请重试");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      };
    
    const handleProfileEdit = () => {
        const { username, password, newUsername, newPassword, newAvatar, newEmail, newPhoneNumber } = formData;
        
        // Check if the password is correct before making the API call
        fetch(`${BACKEND_URL}/api/checkPassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`
            },
            body: JSON.stringify({
                userid,
                password
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (Number(res.code) === 0) {
                // Password is correct, proceed with the edit
                fetch(`${BACKEND_URL}/api/modify`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`
                    },
                    body: JSON.stringify({
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
                    } else {
                        alert("用户信息更新失败" + res.info);
                    }
                });
            } else {
                // Password is incorrect
                alert("密码错误，请重试");
            }
        });
    setShowProfileModal(false);
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
                db.clearCachedData();
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

    const AvatarSelectorModal = () => {
        const handleAvatarChange = (selectedAvatar:string) => {
            const { username,newUsername, newPassword, newAvatar, newEmail, newPhoneNumber } = formData;

          // 向后端发送请求，更改用户头像
          fetch(`${BACKEND_URL}/api/modify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`
            },
            body: JSON.stringify({
                userid,
                password,
                username,
                newUsername,
                newPassword,
                newEmail,
                newPhoneNumber,
                newAvatar: selectedAvatar // 发送用户选择的新头像
            })
          })
            .then((res) => res.json())
            .then((res) => {
              if (Number(res.code) === 0) {
                alert("头像更新成功");
                setSelectedAvatar(selectedAvatar);
                dispatch(setavatar(selectedAvatar));
                handleAvatarModalClose();
              } else {
                alert("头像更新失败：" + res.info);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              alert("发生错误，请重试");
            });
        };
      
        return (
          <Modal
            visible={showAvatarModal}
            onCancel={handleAvatarModalClose}
            footer={null}
          >
            <h2>选择头像</h2>
            <div>
              {Object.entries(avatarMap).map(([key, image]) => (
                <Tooltip title={`选择${key}`} key={key}>
                  <Avatar
                    size={64}
                    src={image.src}
                    style={{ cursor: 'pointer', margin: '0 10px' }}
                    onClick={() => handleAvatarChange(key)} // 在点击时调用handleAvatarChange函数并传入选定的头像键
                  />
                </Tooltip>
              ))}
            </div>
          </Modal>
        );
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
                    <Tooltip title="修改头像">
                    <div 
                        style={{ border: avatarHovered ? '2px solid blue' : 'none', display: 'inline-block' }}
                        onMouseOver={() => setAvatarHovered(true)}
                        onMouseOut={() => setAvatarHovered(false)}
                        onClick={handleAvatarClick}
                    >
                        <Avatar
                        size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                        src={UserAvatar.src}
                        style={{ cursor: 'pointer' }}
                        />
                    </div>
                    </Tooltip>
                    <AvatarSelectorModal />
                </div>

            <div>
                <Button onClick={openPasswordModal}>Account Info</Button>
                <Modal
                    visible={showPasswordModal}
                    onCancel={closePasswordModal}
                    footer={null}
                >
                    <h2>Enter Your Password</h2>
                    <Form onFinish={handlePasswordSubmit}>
                    <Form.Item label="Password">
                        <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Confirm
                    </Button>
                    </Form>
                </Modal>

                <Modal
                    visible={showProfileModal}
                    onCancel={closeProfileModal}
                    footer={null}
                >
                    <h2>Edit Account Info</h2>
                    <Form onFinish={handleProfileEdit}>
                    <Form.Item label="New Username">
                        <Input
                        name="newUsername"
                        value={formData.newUsername}
                        onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label="New Password">
                        <Input.Password
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label="New Email">
                        <Input
                        name="newEmail"
                        value={formData.newEmail}
                        onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label="New Phone Number">
                        <Input
                        name="newPhoneNumber"
                        value={formData.newPhoneNumber}
                        onChange={handleChange}
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                    </Form>
                </Modal>
                </div>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
                    {items.map((item) => (
                    <Menu.Item key={item.key} onClick={cancelMenuClick}>
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
                        // <Sider 
                        //     width={200} theme="light"
                        //     style={{
                        //         overflow: 'auto',
                        //         height: 'calc(100vh - 64px)', // 减去 Header 的高度
                        //         position: 'sticky',
                        //         top: '64px', // Header 的高度
                        //     }}
                        // >
                        // <Menu mode="inline" onSelect={handleChatSelect}>
                        //     <Menu.Item key="chat1">Chat 1</Menu.Item>
                        //     <Menu.Item key="chat2">Chat 2</Menu.Item>
                        //     <Menu.Item key="chat3">Chat 3</Menu.Item>
                        //     {/* Add more chat options as needed */}
                        // </Menu>
                        // <Button block onClick={cancelMenuClick}>关闭</Button>
                        // </Sider>
                        <div>
                            <HomePage />
                            <Button block onClick={cancelMenuClick}>关闭</Button>
                        </div>
                        )}
                    {!showChatSidebar &&(<SearchUser />)}
                    {/* <ChatPage chat={selectedChat} /> */}
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    );
};

export default UserScreen;