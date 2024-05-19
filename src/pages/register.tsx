import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX, REGISTER_FAILED, REGISTER_SUCCESS_PREFIX } from "../constants/string";
import { useRouter } from "next/router";
import { setName, setToken, setUserid,setPassword } from "../redux/auth";
import { useDispatch } from "react-redux";
import { Button, Checkbox, Form, Input } from 'antd';
import Link from 'next/link';
import { CLIENT_STATIC_FILES_RUNTIME_MAIN_APP } from "next/dist/shared/lib/constants";

const RegisterScreen = () => {
    const [username, setUserName] = useState("");
    const [password, setPassWord] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    //const [error, setError] = useState("");

    const router = useRouter();
    const dispatch = useDispatch();

    const register = () => {
        fetch(`${BACKEND_URL}/api/register`, {
            method: "POST",
            body: JSON.stringify({
                username,
                password,
                email,
                phoneNumber,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (Number(res.code) === 0) {
                    dispatch(setName(username));
                    dispatch(setToken(res.token));
                    dispatch(setUserid(res.userid));
                    dispatch(setPassword(password));
                    alert(REGISTER_SUCCESS_PREFIX + username);
                    router.push("/login");
                }
                else {
                    // if (Number(res.code) === 2) {
                    //     alert(REGISTER_FAILED + res.message);
                    // } else if (Number(res.code) === 1) {
                    //     alert(REGISTER_FAILED + res.message);
                    // }
                    alert(REGISTER_FAILED + res.info);
                }
            })
            .catch((err) => alert(FAILURE_PREFIX + err));
    };

    return (
        <>
        <div style={{ textAlign: 'center' }}>
        <h1>Register</h1>
        <p>注意：密码只能包含字母和数字，长度不能小于8，不能大于16</p>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, display: 'inline-block'   }}
          initialValues={{ remember: true }}
          onFinish={register}
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
            label="E-mail"
            name="email"
            rules={[{ required: false, message: 'Please input your email!' }]}
          >
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: false, message: 'Please input your phonenumber!' }]}
          >
            <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
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
        <p>已经有了账号?请 <Link href="/login" >登录</Link></p>
        </div>
        </>
      );
};

export default RegisterScreen;