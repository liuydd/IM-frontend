import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import FriendRequest from "../friend/send_friend_request";
import Respond2FriendRequest from "../friend/respond_friend_request";
import ListFriendRequests from "../friend/friend_request_list";
import SearchUser from "../search_target_user";
import DeleteFriend from "../friends/delete";
import ListFriends from "../friends/list";
import LabelFriends from "../friends/label";

const UserScreen = () => {
    //获取现有的userName, token, password
    const username = useSelector((state: RootState) => state.auth.name);
    const token = useSelector((state: RootState) => state.auth.token);
    const password = useSelector((state: RootState) => state.auth.password);

    const router = useRouter();
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        //username: "",
        newUsername: "",
        //password: "",
        newPassword: "",
        avatar: "",
        newAvatar: "",
        email: "",
        newEmail: "",
        phoneNumber: "",
        newPhoneNumber: ""
    });

    const openModal = () => {
        setShowModal(true);
      };
    const closeModal = () => {
        setShowModal(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if(name === "username"){
            dispatch(setName(value));
        }
        else if(name === "password"){
            dispatch(setPassword(value));
        }
        else{
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const edit = () => {
        const { newUsername, newPassword, newAvatar, newEmail, newPhoneNumber } = formData;
        fetch(`${BACKEND_URL}/api/modify`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
            },
            body : JSON.stringify({
                username,
                //newUsername,
                password,
                newPassword,
                //newAvatar,
                newEmail,
                newPhoneNumber,
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (Number(res.code) === 0) {
                alert("用户信息更新成功");
            }
            else {
                alert("用户信息更新失败");
            }
        })
        .catch((err) => alert(FAILURE_PREFIX + err));

        closeModal();
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        dispatch(setName(""));
        dispatch(setToken(""));
        router.push("/");
    };

    const delete_user = () => { //删除用户功能有问题，不知道是后端还是前端的问题
        fetch(`${BACKEND_URL}/api/delete_user`, {
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
            <div>
                <button onClick = {openModal}>
                    Account Info
                </button>
                {showModal && (
                <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <h2>Edit Account Info</h2>
                    <form onSubmit={edit}>
                    <label>
                        Username:
                        <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={handleChange}
                        />
                    </label>
                    <label>
                        Password:
                        <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        />
                    </label>
                    <label>
                        Avatar:
                        <input
                        type="file"
                        name="avatar"
                        onChange={handleChange}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        />
                    </label>
                    <label>
                        Phone Number:
                        <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        />
                    </label>
                    <button type="submit">Save</button>
                    </form>
                </div>
                </div>
            )}
            </div>
            <p><SearchUser /></p>
            //暂时这样列
            <div><p><DeleteFriend /></p></div>
            <div><p><ListFriends /></p></div>
            <div><p><LabelFriends /></p></div>
            <div><p><FriendRequest /></p></div>
            <div><p><Respond2FriendRequest /></p></div>
            <div><p><ListFriendRequests /></p></div>
        </>
    );
};

export default UserScreen;