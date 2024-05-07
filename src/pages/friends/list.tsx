import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import DeleteFriend from "./delete";
import CreateGroup from "../group/create";
import LabelFriends from "./label";
import { Input, Select, Button, Typography } from 'antd';
import GroupList from "../../components/GroupList";

interface Friend{
    friendid: number;
    friend: string;
    labels: string[];
}

function ListFriends() {
    const userid = useSelector((state: RootState) => state.auth.userid);
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
                userid,
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
        <Button onClick={fetchFriend}>Fetch Friends</Button>
        <ul>
        {friendlist.map((myfriend, index) => (
            <li key={index}>
                <p>Friend Name: {myfriend.friend}</p>
                <p>Labels: {myfriend.labels.join(', ')}</p>
                <DeleteFriend friendid={myfriend.friendid} />
                <LabelFriends friendid={myfriend.friendid} />
            </li>
        ))}
        </ul>
        <CreateGroup friendlist={friendlist} />
        <GroupList />
        </div>
        
    );
};
export default ListFriends;