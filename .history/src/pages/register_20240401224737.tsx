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
                    router.push("/login");
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