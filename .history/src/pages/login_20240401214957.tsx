import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX, LOGIN_FAILED, LOGIN_SUCCESS_PREFIX } from "../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../redux/auth";
import { useDispatch } from "react-redux";

const LoginScreen = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

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
                    alert(LOGIN_SUCCESS_PREFIX + username);

                    router.push('./user/${username}');
                }
                else {
                    alert(LOGIN_FAILED);
                }
            })
            .catch((err) => alert(FAILURE_PREFIX + err));
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
            <button onClick={login} disabled={username === "" || password === ""}>
                Login
            </button>
        </>
    );
};

export default LoginScreen;
