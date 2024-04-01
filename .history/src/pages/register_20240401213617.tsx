import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX, REGISTER_FAILED, REGISTER_SUCCESS_PREFIX } from "../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../redux/auth";
import { useDispatch } from "react-redux";

const RegisterScreen = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    //const [error, setError] = useState("");

    const router = useRouter();
    const dispatch = useDispatch();

    const register = () => {
        // //检查输入的合法性
        // //输入是否为空
        // if(! username || ! password) {
        //     setError("User name and password cannot be empty");
        //     return;
        // }
        // //用户名长度是否符合要求，6 <= userNmae.length <=18
        // if(username.length < 6 || username.length > 18){
        //     setError("User name length must be between 6 and 18");
        //     return;
        // }
        // //密码长度是否符合要求，password.length >= 6
        // if(password.length < 6){
        //     setError("Password length must be at least 6");
        //     return;
        // }

        fetch(`${BACKEND_URL}/api/register`, {
            method: "POST",
            body: JSON.stringify({
                username,
                password,
                email, 
                phone_number,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (Number(res.code) === 0) {
                    dispatch(setName(username));
                    dispatch(setToken(res.token));
                    alert(REGISTER_SUCCESS_PREFIX + username);
                    router.push('./user'); //通过user_id跳到user页面，似乎是后端的活？
                }
                else {
                    alert(REGISTER_FAILED);
                }
            })
            .catch((err) => alert(FAILURE_PREFIX + err));
        // //检查用户名是否已存在
        // fetch(`${BACKEND_URL}/api/register`, {
        //     method: "POST",
        //     body: JSON.stringify({ username })
        // })
        //     .then(res => res.json())
        //     .then((res => {
        //         if(Number(res.code) === 0){ //这个isUnique可能是后端实现的？
        //             //如果用户名唯一，则继续注册流程
        //             fetch(`${BACKEND_URL}/api/register`, {
        //                 method: "POST",
        //                 body: JSON.stringify({
        //                     username,
        //                     password,
        //                 }),
        //             })
        //                 .then((res) => res.json())
        //                 .then((res) => {
        //                     if (Number(res.code) === 0) {
        //                         dispatch(setName(username));
        //                         dispatch(setToken(res.token));
        //                         alert(REGISTER_SUCCESS_PREFIX + username);
        //                         router.push("/login") //待改
        //                     }
        //                     else {
        //                         alert(REGISTER_FAILED);
        //                     }
        //                 })
        //                 .catch((err) => alert(FAILURE_PREFIX + err));
        //         }
        //         else{
        //             alert(REGISTER_FAILED)
        //             setError("User name already exists");
        //         }
        //     }))
        //     .catch((err) => alert(FAILURE_PREFIX + err));
    };

    return (
        <>
            <input
                type="text"
                placeholder="User name"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Phone number"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button onClick={register} disabled={username === "" || password === ""}>
                Register
            </button>
        </>
    );
};