import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { LogoutOutlined, DeleteOutlined } from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;

interface NavProps {
    logout: Function;
    deleteUser: Function;
  }

const Navbar: React.FC<NavProps> = ({ logout, deleteUser }) => {
  return (
    <Header 
    style={{
      position: 'sticky',
      top: 0,
      zIndex: 1,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
    }}
    >
      <div className="demo-logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ flex: 1, minWidth: 0 }}
      >
        {/* 这里放置其他菜单项 */}
      </Menu>
      <Button type="primary" icon={<LogoutOutlined />} onClick={() => logout()}>
        Logout
      </Button>
      <Button type="primary" icon={<DeleteOutlined />} onClick={() => deleteUser()}>
        Delete User
      </Button>
    </Header>
  );
};

export default Navbar;
