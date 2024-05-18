import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX, LOGIN_FAILED, LOGIN_SUCCESS_PREFIX } from "../constants/string";
import { useRouter } from "next/router";
import { setName, setToken, setUserid, setPassword } from "../redux/auth";
import { useDispatch } from "react-redux";
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import Link from 'next/link';
import { useLocalStorageState, useRequest } from 'ahooks';
const { Title } = Typography;
import { db } from '../api/db';

const LoginScreen = () => {
    const [username, setUserName] = useState("");
    const [password, setPassWord] = useState("");
    const [me, setMe] = useLocalStorageState('me', { defaultValue: 'test' });

    const router = useRouter();
    const dispatch = useDispatch();

    const login = () => {
        fetch(`${BACKEND_URL}/api/login`, {
            method: "POST",
            body: JSON.stringify({
                username,
                password,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (Number(res.code) === 0) {
                    dispatch(setName(username));
                    dispatch(setToken(res.token));
                    dispatch(setUserid(res.userid));
                    dispatch(setPassword(password));
                    setMe(username);
                    alert(LOGIN_SUCCESS_PREFIX + username);

                    router.push(`./home`);
                }
                else {
                    alert(LOGIN_FAILED+res.info);
                }
            })
            .catch((err) => alert(FAILURE_PREFIX + err));
    };

    return (
        <>
        <div style={{ textAlign: 'center' }}>
        <h1>Login</h1>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, display: 'inline-block'  }}
          initialValues={{ remember: true }}
          onFinish={login}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input value={username} onChange={(e) => setUserName(e.target.value)} />
          </Form.Item>
    
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password value={password} onChange={(e) => setPassWord(e.target.value)} />
          </Form.Item>
    
          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
    
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <p>还没有账号?请 <Link href="/register" >注册</Link></p>
        </div>
        </>
      );
};

export default LoginScreen;
