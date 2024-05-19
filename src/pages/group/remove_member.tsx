import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, Checkbox, Form, Input, Modal, Radio, message } from "antd";
import { db } from '../../api/db';
import { leaveConversation } from "../../api/chat";
import { useLocalStorageState, useRequest } from 'ahooks';
import { RadioChangeEvent } from 'antd/lib/radio';

// interface GroupMembers{
//     memberName: string,
// }

interface GroupMembers{
  name: string;
  id: number;
}

function RemoveMember({ groupmemberslist, groupid, conversationId }: { groupmemberslist: GroupMembers[], groupid: number, conversationId: number }) {
    const userid = useSelector((state: RootState) => state.auth.userid);
    // const groupid = useSelector((state: RootState) => state.group.groupid);
    const token = useSelector((state: RootState) => state.auth.token);
    // const [targetid, setTargetMembers] = useState<number[]>([]);
    const [targetid, setTargetMembers] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [me, setMe] = useLocalStorageState('me', { defaultValue: 'test' });
    const [targetname, setTargetMembersName] = useState('');

    // const removeMember = ()=>{
    //     fetch(`${BACKEND_URL}/api/group/remove_member`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `${token}`,
    //         },
    //         body: JSON.stringify({
    //             userid,
    //             groupid,
    //             targetid,
    //         })
    //     })
    //     .then((res) => res.json())
    //     .then((res) => {
    //         if (Number(res.code) === 0) {
    //             alert(res.info);
    //         }
    //         else {
    //             alert(res.info);
    //         }
    //     })
    //     .catch((err) => alert(FAILURE_PREFIX + err));
    // };
    const removeMember = async function removeMember() {
      try {
          const response = await fetch(`${BACKEND_URL}/api/group/remove_member`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
            body: JSON.stringify({
                userid,
                groupid,
                targetid,
            })
          });
          
          const res = await response.json();
          alert(res.info);
          // alert(conversationId);
          try {
              await leaveConversation({
                conversationId: conversationId,
                me: targetname,
              });
              await db.removeConversations([conversationId]);
              message.success('移出成员成功');
            } catch (err) {
              const resp = (err as any).response || {};
              if (resp.status == 404) {
                message.error('会话不存在');
              } else if (resp.status == 403) {
                message.error('会话不是群聊');
              }
          }

      } catch (err) {
          alert(FAILURE_PREFIX);
      }
    };

    const showModal = () => {
        setIsModalOpen(true);
      };
    
    const handleOk = () => {
        removeMember();
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleRadioChange = (e: RadioChangeEvent) => {
      const memberId = parseInt(e.target.value);
      setTargetMembers(memberId);
  
      // 更新目标用户的名字
      const selectedMember = groupmemberslist.find(member => member.id === memberId);
      if (selectedMember) {
          setTargetMembersName(selectedMember.name);
      }
  };
    
    return (
        <div>
          <Button type="primary" onClick={showModal}>
            移除群员
        </Button>
          <Modal
            title="选择想要移除的群成员"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            {/* <Radio.Group onChange={(e) => setTargetMembers(e.target.value)} value={targetid}>
              {groupmemberslist? (groupmemberslist.map((member, index) => (
                <Radio key={index} value={member.id}>
                  {member.name}
                </Radio>
              ))): (
                <p>Loading group members list...</p>
              )}
            </Radio.Group> */}
            <Radio.Group onChange={(e: RadioChangeEvent) => handleRadioChange(e)} value={targetid}>
              {groupmemberslist ? groupmemberslist.map((member, index) => (
                <Radio key={index} value={member.id}>
                  {member.name}
                </Radio>
              )) : (
                <p>Loading group members list...</p>
              )}
            </Radio.Group>
          </Modal>
        </div>
      );
};
export default RemoveMember;