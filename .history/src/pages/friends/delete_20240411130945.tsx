import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

function DeleteFriend(){
    const username = useSelector((state: RootState) => state.auth.name);
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

    return (
        <div>
        <h2>Delete Friend</h2>
        <form onSubmit={deleteFriend}>
            <br />
            <label>
            Friend's Username to Delete:
            <input type="text" value={friend} onChange={(e) => setFriend(e.target.value)} />
            </label>
            <br />
            <button type="submit">Delete Friend</button>
        </form>
        </div>
    );
};
export default DeleteFriend;