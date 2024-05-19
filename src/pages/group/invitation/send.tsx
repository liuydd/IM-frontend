import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken, setUserid } from "../../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Button, Modal, Radio, message } from "antd";
import { db } from '../../../api/db';
import { joinConversation } from "../../../api/chat";
import { RadioChangeEvent } from 'antd/lib/radio';

interface Friend{
  friendid: number;
  friend: string;
  labels: string[];
}

function InviteMember({ groupid, conversationId }: { groupid: number, conversationId: number }) {
    const username = useSelector((state: RootState) => state.auth.name);
    const userid = useSelector((state: RootState) => state.auth.userid);
    const token = useSelector((state: RootState) => state.auth.token);
    const [friendid, setFriendid] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [friendlist, setFriendlist] = useState<Friend[]>([]);
    const [targetname, setTargetName] = useState("");

    const invitemember = async function invitemember(){
      try{
        const res = await fetch(`${BACKEND_URL}/api/group/invitation/send`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
            body: JSON.stringify({
                userid,
                friendid,
                groupid,
            }),
        });
        const ress = await res.json();
        if (Number(ress.code) === 0) {
          // setTargetName(ress.target)
          alert(ress.info);
          // alert(targetname+" "+conversationId);
          if(targetname!==""){
            try {
              await joinConversation({
                conversationId: conversationId,
                me: targetname,
              });
              await db.pullMessagesFromConversation(conversationId);
              await db.pullConversations([conversationId]);
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

    const showModal = () => {
        fetchFriend();
        setIsModalOpen(true);
      };
    
      const handleOk = () => {
        invitemember();
        setIsModalOpen(false);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };
    
      const handleRadioChange = (e: RadioChangeEvent) => {
        const memberId = parseInt(e.target.value);
        setFriendid(memberId);
    
        // 更新目标用户的名字
        const selectedFriend = friendlist.find(friend => friend.friendid === memberId);
        // alert(selectedFriend?.friend)
        if(selectedFriend) {
            setTargetName(selectedFriend.friend);
        }
      }
    
      return (
        <div>
          <Button type="primary" onClick={showModal}>
            邀请好友
        </Button>
          <Modal
            title="选择想要邀请的好友"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            {/* <Radio.Group onChange={(e) => setFriendid(e.target.value)} value={friendid}>
              {friendlist? (friendlist.map((member, index) => (
                <Radio key={index} value={member.friendid}>
                  {member.friend}
                </Radio>
              ))): (
                <p>Loading friend list...</p>
              )}
            </Radio.Group> */}
            <Radio.Group onChange={(e: RadioChangeEvent) => handleRadioChange(e)} value={friendid}>
              {friendlist? (friendlist.map((member, index) => (
                <Radio key={index} value={member.friendid}>
                  {member.friend}
                </Radio>
              ))): (
                <p>Loading friend list...</p>
              )}
            </Radio.Group>
          </Modal>
        </div>
      );
};
export default InviteMember;