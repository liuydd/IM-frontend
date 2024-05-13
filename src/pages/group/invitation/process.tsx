import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken, setUserid } from "../../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Button, Modal, List } from "antd";

interface RespondProps {
    id: number;
  }

const ProcessInvitation = (props: RespondProps) =>{
    const username = useSelector((state: RootState) => state.auth.name);
    const userid = useSelector((state: RootState) => state.auth.userid);
    const token = useSelector((state: RootState) => state.auth.token);
    const [response, setResponse] = useState("");

    const processinvitation = () => {
    fetch(`${BACKEND_URL}/api/group/invitation/process`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
        },
        body: JSON.stringify({
            userid: userid,
            invitationid: props.id,
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
          <h2>入群申请处理</h2>
          <div>
            <label>Response:</label>
            <select value={response} onChange={e => setResponse(e.target.value)}>
              <option value="">Select</option>
              <option value="Accept">Accept</option>
              <option value="Reject">Reject</option>
            </select>
          </div>
          <button onClick={processinvitation}>Respond</button>
        </div>
      );
};
export default ProcessInvitation;