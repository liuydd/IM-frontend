import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken, setUserid } from "../../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Button, Modal, List } from "antd";
import ProcessInvitation from "./process";

interface Invitation{
    id: number;
    sender: string;
    senderid: number;
    receiver: string;
    receiverid: number;
    timestamp: string;
  }

const GetInvitation = ({ groupid }: { groupid: number }) => {
    const username = useSelector((state: RootState) => state.auth.name);
    const userid = useSelector((state: RootState) => state.auth.userid);
    const token = useSelector((state: RootState) => state.auth.token);
    const [invitation, setInvitation] = useState<Invitation[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getinvitation = () =>{
        fetch(`${BACKEND_URL}/api/group/invitation/get`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
            body: JSON.stringify({
                userid,
                groupid,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (Number(res.code) === 0) {
                    setInvitation(res.invitations);
                    alert(res.info);
                }
                else {
                    alert(res.info);
                }
            })
            .catch((err) => alert(FAILURE_PREFIX + err));
    };

    const showModal = () => {
        setIsModalOpen(true);
      };
    
      const handleOk = () => {
        getinvitation();
        setIsModalOpen(false);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };


      return (
        <div>
          <Button type="primary" onClick={showModal}>
            入群请求
          </Button>
          <Modal
            title="收到的邀请请求"
            visible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <List
              dataSource={invitation}
              renderItem={(item: Invitation) => (
                <List.Item>
                  <List.Item.Meta
                    title={`邀请来自 ${item.sender}`}
                    description={`时间：${item.timestamp}`}
                  />
                  <div><ProcessInvitation id = {item.id} /></div>
                </List.Item>
              )}
            />
          </Modal>
        </div>
      );
};
export default GetInvitation;