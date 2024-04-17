import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import DeleteFriend from "./delete";
import CreateGroup from "../group/create";
import LabelFriends from "./label";

interface Friend{
    friend: string;
    labels: string[];
}

function ListFriends() {
    const username = useSelector((state: RootState) => state.auth.name);
    const token = useSelector((state: RootState) => state.auth.token);
    const [friendlist, setFriendlist] = useState<Friend[]>([]);
    const fetchFriend = ()=>{
        fetch(`${BACKEND_URL}/api/friends/list`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization : `${token}`
            },
            body: JSON.stringify({
                username,
            }),
        })
        .then((res) => res.json())
        .then((res) => {
            if (Number(res.code) === 0) {
                setFriendlist(res.friendList);
            }
            else{
                setFriendlist([]);
                alert(res.info);
            }
        })
        .catch((error) => {
            alert("An error occurred while fetching friends.");
        });
    };

    return (
        <div>
        <h2>Friend List</h2>
        <button onClick={fetchFriend}>Fetch Friends</button>
        <ul>
        {friendlist.map((myfriend, index) => (
            <li key={index}>
                <p>Friend Name: {myfriend.friend}</p>
                <p>Labels: {myfriend.labels.join(', ')}</p>
                <DeleteFriend friend={myfriend.friend} />
                <LabelFriends friend={myfriend.friend} />
            </li>
        ))}
        </ul>
        <CreateGroup friendlist={friendlist} />
        </div>
        
    );
};
export default ListFriends;