import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

function delete_friend(){
    const [username, setUsername] = useState("");
    const [friend, setFriend] = useState("");

    const deleteFriend = () =>{
        fetch(`${BACKEND_URL}/api/friends/delete`,{
            method : "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                friend
            })
        })
        .then((res) => res.json())
        .then(res => {
            if(res.ok) {
                alert(res.info)
            }
            else {
                alert(FAILURE_PREFIX + res.info);
            }
        })
        .catch((err) => {
            alert("An error occurred while deleting friend.");
        });
    };
};
export default delete_friend;