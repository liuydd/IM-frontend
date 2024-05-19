import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken, setUserid } from "../../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Button, Modal, List, message } from "antd";
import { db } from '../../../api/db';
import { joinConversation } from "../../../api/chat";

interface RespondProps {
    id: number;
    conversationId: number;
  }

const ProcessInvitation = (props: RespondProps) =>{
    const username = useSelector((state: RootState) => state.auth.name);
    const userid = useSelector((state: RootState) => state.auth.userid);
    const token = useSelector((state: RootState) => state.auth.token);
    const [response, setResponse] = useState("");
    const [targetname, setTargetName] = useState("");

    const processinvitation = async function processinvitation() {
      try{
        const res = await fetch(`${BACKEND_URL}/api/group/invitation/process`, {
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
          });
          const ress = await res.json();
          
          if (Number(ress.code) === 0) {
            setTargetName(ress.target)
            alert(ress.info);
            // alert(targetname);
            if(targetname!==""){
              try {
                await joinConversation({
                  conversationId: props.conversationId,
                  me: targetname,
                });
                await db.pullMessagesFromConversation(props.conversationId);
                await db.pullConversations([props.conversationId]);
                message.success('加入成功');
              }
              catch (err) {
                alert("加入失败");
            }
            }
          }
          else {
            alert("操作失败" + ress.info);
          }
      }
      catch (err) {
        alert(FAILURE_PREFIX);
    }
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