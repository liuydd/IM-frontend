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
        phone: ""
    });

    // const edit = () => {
    //     fetch(`${BACKEND_URL}/api/user`, {
    //         method : "PUT",
    //         headers : {
    //             "Content-Type" : "application/json",
    //             Authorization : `Bearer ${token}`
    //         },
    //         body : JSON.stringify({
    //             username,
    //             password,
    //             email,
    //             phone_number,
    //         })
    //     })
    // };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        dispatch(setName(""));
        dispatch(setToken(""));
        router.push("/login");
    };

    const delete_user = () => {
        fetch(`${BACKEND_URL}/api/user/${username}`, {
            method : "DELETE",
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        .then(response => {
            if(response.ok) {
                logout(); //但是直接logout似乎没有删除这个用户的除用户名和密码外的任何信息？
                //maybe这是后端的工作
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
            <button onClick = {logout}>
                Logout
            </button>
            <button onClick = {delete_user}>
                Delete Account
            </button>
        </>
    );
};

export default UserScreen;