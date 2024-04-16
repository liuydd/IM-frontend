import React from 'react';
import { Layout, Menu, Button, theme} from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import Link from 'next/link';
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";

const MySider = () =>{
    const username = useSelector((state: RootState) => state.auth.name);
    const items = [
        { label: "User", key: "1", to: `/user/${username}` },
        { label: "Friend List", key: "2", to: "/friends/list" },
        { label: "Friend Request List", key: "3", to: "/friend/friend_request_list" },
        { label: "Messages", key: "4", to: "/messages" },
    ];
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();

    return (
            <Layout>
                <Sider
                style={{
                    overflow: 'auto',
                    height: 'calc(100vh - 64px)', // 减去 Header 的高度
                    position: 'sticky',
                    top: '64px', // Header 的高度
                    left: 0,
                    background: colorBgContainer,
                }}
                width={200}
                >
                <div className="demo-logo-vertical" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
                    {items.map((item) => (
                    <Menu.Item key={item.key}>
                        <Link href={item.to}>{item.label}</Link>
                    </Menu.Item>
                    ))}
                </Menu>
                </Sider>
                
            </Layout>
    );
};

export default MySider;