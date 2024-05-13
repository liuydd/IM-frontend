import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken, setUserid } from "../../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Button, Modal, Radio } from "antd";

interface Friend{
  friendid: number;
  friend: string;
  labels: string[];
}

function InviteMember({ groupid }: { groupid: number }) {
    const username = useSelector((state: RootState) => state.auth.name);
    const userid = useSelector((state: RootState) => state.auth.userid);
    const token = useSelector((state: RootState) => state.auth.token);
    const [friendid, setFriendid] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [friendlist, setFriendlist] = useState<Friend[]>([]);

    const invitemember = () =>{
        fetch(`${BACKEND_URL}/api/group/invitation/send`, {
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
        })
            .then((res) => res.json())
            .then((res) => {
                if (Number(res.code) === 0) {
                    alert(res.info);
                }
                else {
                    alert(res.info);
                }
            })
            .catch((err) => alert(FAILURE_PREFIX + err));
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
            <Radio.Group onChange={(e) => setFriendid(e.target.value)} value={friendid}>
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