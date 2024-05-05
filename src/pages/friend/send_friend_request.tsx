import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Input, Select, Button, Typography } from 'antd';

function FriendRequest() {
    //const [username, setUsername] = useState("");
    const userid = useSelector((state: RootState) => state.auth.userid);
    const token = useSelector((state: RootState) => state.auth.token);
    const [friend, setFriend] = useState("");
  
    const sendFriendRequest = () => {
        fetch(`${BACKEND_URL}/api/friend/send_friend_request`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `${token}`
            },
            body : JSON.stringify({
                userid,
                friend,
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (Number(res.code) === 0) {
                alert(res.info);
            }
            else {
                alert("好友申请失败" + res.info);
            }
        })
        .catch((err) => alert(FAILURE_PREFIX + err));
    };
  
    return (
      <div>
        <h2>Send Friend Request</h2>
        <div>
          <label>Friend's Username:</label>
          <input type="text" value={friend} onChange={e => setFriend(e.target.value)} />
        </div>
        <Button onClick={sendFriendRequest}>Send Request</Button>
      </div>
    );
  }
  
  export default FriendRequest;