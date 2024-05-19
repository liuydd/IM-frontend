import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface DeleteFriendProps {
    friendid: number;
}

function DeleteFriend(props: DeleteFriendProps){
    const userid = useSelector((state: RootState) => state.auth.userid);
    const token = useSelector((state: RootState) => state.auth.token);
    //const [friend, setFriend] = useState("");

    const deleteFriend = () =>{
        fetch(`${BACKEND_URL}/api/friends/delete`,{
            method : "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Authorization : `${token}`
            },
            body: JSON.stringify({
                userid,
                friendid: props.friendid
            })
        })
        .then((res) => res.json())
        .catch((err) => {
            alert("An error occurred while deleting friend.");
        });
    };

    return (
        <div>
        <button onClick={deleteFriend}>Delete Friend</button>
        {/* <h2>Delete Friend</h2>
        <form onSubmit={deleteFriend}>
            <br />
            <label>
            Friend's Username to Delete:
            <input type="text" value={friend} onChange={(e) => setFriend(e.target.value)} />
            </label>
            <br />
            <button type="submit">Delete Friend</button>
        </form> */}
        </div>
    );
};
export default DeleteFriend;