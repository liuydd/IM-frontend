import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import FriendRequest from "../friend/send_friend_request";
import Respond2FriendRequest from "../friend/respond_friend_request";
import ListFriendRequests from "../friend/friend_request_list";
import SearchUser from "../search_target_user";

const UserScreen = () => {
    //获取现有的userName和token
    const username = useSelector((state: RootState) => state.auth.name);
    const token = useSelector((state: RootState) => state.auth.token);

    const router = useRouter();
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        newUsername: "",
        password: "",
        newPassword: "",
        avatar: "",
        newAvatar: "",
        email: "",
        newEmail: "",
        phone_number: "",
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
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const edit = () => {
        const { username, newUsername, password, newPassword, newAvatar, newEmail, newPhoneNumber } = formData;
        fetch(`${BACKEND_URL}/api/modify`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
            },
            body : JSON.stringify({
                username,
                newUsername,
                password,
                newPassword,
                newAvatar,
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
                        value={formData.username}
                        onChange={handleChange}
                        />
                    </label>
                    <label>
                        Password:
                        <input
                        type="password"
                        name="password"
                        value={formData.password}
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
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        />
                    </label>
                    <button type="submit">Save</button>
                    </form>
                </div>
                </div>
            )}
            </div>
            
            <div><p><FriendRequest /></p></div>
            <div><p><Respond2FriendRequest /></p></div>
            <div><p><ListFriendRequests /></p></div>
        </>
    );
};

export default UserScreen;