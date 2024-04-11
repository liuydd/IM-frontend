import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

function Respond2FriendRequest() {
    const username = useSelector((state: RootState) => state.auth.name);
    const [friend, setFriend] = useState("");
    const [response, setResponse] = useState("");

    const respondToFriendRequest = () => {
        fetch(`${BACKEND_URL}/friend/respond_friend_request`, {
            method: "POST",
            body: JSON.stringify({
                username: username,
                friend: friend,
                response: response
            })
        })
        .then(res => res.json())
        .then((res) => {
            if (Number(res.code) === 0) {
                alert(res.info);
            }
            else {
                alert("操作失败" + res.info);
            }
        })
        .catch((err) => alert(FAILURE_PREFIX + err));
    };

    return (
        <div>
          <h2>Respond to Friend Request</h2>
          <div>
            <label>好友申请信息提示: </label>
            <input type="text" value={friend} onChange={e => setFriend(e.target.value)} />
          </div>
          <div>
            <label>Response:</label>
            <select value={response} onChange={e => setResponse(e.target.value)}>
              <option value="">Select</option>
              <option value="Accept">Accept</option>
              <option value="Reject">Reject</option>
            </select>
          </div>
          <button onClick={respondToFriendRequest}>Respond</button>
        </div>
      );
};

export default Respond2FriendRequest;