import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX } from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface RespondProps {
  friend: string;
}

function Respond2FriendRequest(props: RespondProps) {
  const userid = useSelector((state: RootState) => state.auth.userid);
  const token = useSelector((state: RootState) => state.auth.token);
  //const [friend, setFriend] = useState("");
  const [response, setResponse] = useState("");

  const respondToFriendRequest = () => {
    fetch(`${BACKEND_URL}/api/friend/respond_friend_request`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`
      },
      body: JSON.stringify({
        userid: userid,
        friend: props.friend,
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
      {/* <div>
            <label>好友申请信息提示: </label>
            <input type="text" value={friend} onChange={e => setFriend(e.target.value)} />
          </div> */}
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