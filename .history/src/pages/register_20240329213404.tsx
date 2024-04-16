import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX, REGISTER_FAILED, REGISTER_SUCCESS_PREFIX } from "../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../redux/auth";
import { useDispatch } from "react-redux";

const RegisterScreen = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();
    const dispatch = useDispatch();

    const register = () => {
        //检查输入的合法性
        //输入是否为空
        if(! userName || ! password) {
            setError("User name and password cannot be empty");
            return;
        }
        //用户名长度是否符合要求，6 <= userNmae.length <=18
        if(userName.length < 6 || userName.length > 18){
            setError("User name length must be between 6 and 18");
            return;
        }
        //密码长度是否符合要求，password.length >= 6
        if(password.length < 6){
            setError("Password length must be at least 6");
            return;
        }
        
        fetch(`${BACKEND_URL}/api/register`, {
            method: "POST",
            body: JSON.stringify({
                userName,
                password,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (Number(res.code) === 0) {
                    dispatch(setName(userName));
                    dispatch(setToken(res.token));
                    alert(REGISTER_SUCCESS_PREFIX + userName);
                    router.push("/user") //待改
                }
                else {
                    alert(REGISTER_FAILED);
                }
            })
            .catch((err) => alert(FAILURE_PREFIX + err));
    };

    return (
        <>
            <input
                type="text"
                placeholder="User name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={register} disabled={userName === "" || password === ""}>
                Register
            </button>
        </>
    );
};