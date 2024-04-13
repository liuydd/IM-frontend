import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button, Form, Input, Modal, Flex } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import React, { ReactNode } from 'react';
import Link from 'next/link';
import { LogoutOutlined, DeleteOutlined } from '@ant-design/icons';
import Navbar from './Navbar';
import MySider from './MySider';

interface Props {
    children: ReactNode;
    logout: Function;
    deleteUser: Function;
  }

const BasicLayout = ({ children, logout, deleteUser }: Props) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();

    const layoutStyle = {
        borderRadius: 8,
        overflow: 'hidden',
        width: 'calc(100% - 8px)',
        maxWidth: 'calc(100% - 8px)',
      };

    const contentStyle: React.CSSProperties = {
        textAlign: 'center',
        minHeight: 120,
        lineHeight: '120px',
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      };  

  return (
    <Flex gap="middle" wrap="wrap">
        <Layout>
        <Navbar logout={logout} deleteUser={deleteUser} />
            <Layout style={layoutStyle}>
                <MySider />
                <Content
                    className="site-layout-background"
                    style={contentStyle}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    </Flex>
  );
};

export default BasicLayout;