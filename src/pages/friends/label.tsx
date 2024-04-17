import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface LabelFriendProps {
    friend: string;
}
function LabelFriends(props: LabelFriendProps){
    const username = useSelector((state: RootState) => state.auth.name);
    const token = useSelector((state: RootState) => state.auth.token);
    //const [friend, setFriend] = useState("");
    const [label, setLabel] = useState("");

    const handleLabelFriend =() =>{
        fetch(`${BACKEND_URL}/api/friends/label`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization : `${token}`
            },
            body: JSON.stringify({
                username,
                friend: props.friend,
                label,
            }),
        })
        .then((res) => res.json())
        .then((res) => {
            if (Number(res.code) === 0) {
                alert(res.info);
            }
            else{
                alert(res.info);
            }
        })
        .catch((error) => {
            alert("An error occurred while labeling friend.");
        });
    };

    return (
        <div>
            <h2>Label Friend</h2>
            {/* <br />
            <label>
            Friend's Username:
            <input type="text" value={friend} onChange={(e) => setFriend(e.target.value)} />
            </label>
            <br /> */}
            <label>
            Label:
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} />
            </label>
            <br />
            <button onClick={handleLabelFriend}>Label Friend</button>
        </div>
    );
};
export default LabelFriends;