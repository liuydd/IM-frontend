import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken, setUserid } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, Modal, Radio } from "antd";

// interface GroupMembers{
//     memberName: string,
// }

function AssignManager({ groupmemberslist, groupid }: { groupmemberslist: string[], groupid: number }) {
    const username = useSelector((state: RootState) => state.auth.name);
    const userid = useSelector((state: RootState) => state.auth.userid);
    const token = useSelector((state: RootState) => state.auth.token);
    // const groupid = useSelector((state: RootState) => state.group.groupid);
    const [newManager, setNewManager] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const assignManager = () =>{
        fetch(`${BACKEND_URL}/api/group/assign_manager`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
            body: JSON.stringify({
                userid,
                // username,
                newManager,
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

    const showModal = () => {
        setIsModalOpen(true);
      };
    
      const handleOk = () => {
        assignManager();
        setIsModalOpen(false);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };
    
    
      return (
        <div>
          <Button type="primary" onClick={showModal}>
            设置管理员
        </Button>
          <Modal
            title="选择管理员"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Radio.Group onChange={(e) => setNewManager(e.target.value)} value={newManager}>
              {groupmemberslist? (groupmemberslist.map((member, index) => (
                <Radio key={index} value={member}>
                  {member}
                </Radio>
              ))): (
                <p>Loading group members list...</p>
              )}
            </Radio.Group>
          </Modal>
        </div>
      );
};
export default AssignManager;