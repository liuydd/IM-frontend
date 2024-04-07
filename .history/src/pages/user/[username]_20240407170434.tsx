import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const UserScreen = () => {
    //获取现有的userName和token
    const username = useSelector((state: RootState) => state.auth.name);
    const token = useSelector((state: RootState) => state.auth.token);

    const router = useRouter();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        avatar: "",
        email: "",
        phone_number: ""
    });

    const edit = () => {
        const { username, password, avatar, email, phone_number } = formData; //头像怎么修改
        fetch(`${BACKEND_URL}/api/user/${username}`, {
            method : "PUT",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
            },
            body : JSON.stringify({
                username,
                password,
                email,
                phone_number,
            })
        })
        .then(response => {
            if(response.ok) {
                console.log("成功更新用户信息");
            }
            else {
                console.error("更新用户信息失败");
            }
        })
        .catch((err) => {
            alert(FAILURE_PREFIX);
        })
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        dispatch(setName(""));
        dispatch(setToken(""));
        router.push("/login");
    };

    const delete_user = () => { //删除用户功能有问题，不知道是后端还是前端的问题
        fetch(`${BACKEND_URL}/api/user`, {
            method : "DELETE",
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        .then(response => {
            if(response.ok) {
                logout();
            }
            else {
                alert(FAILURE_PREFIX);
            }
        })
        .catch((err) => {
            alert("An error occurred while deleting account");
        });
    };

    return (
        <>
            <p>
                <button onClick = {logout}>
                    Logout
                </button>
            </p>
            <p>
                <button onClick = {delete_user}>
                    Delete Account
                </button>
            </p>
            <p>
                <button onClick = {edit}>
                    Edit Account Info
                </button>
            </p>
        </>
    );
};

export default UserScreen;