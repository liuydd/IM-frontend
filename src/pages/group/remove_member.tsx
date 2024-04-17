import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, Checkbox, Form, Input, Modal } from "antd";

interface GroupMembers{
    memberName: string,
}

function RemoveMember({ groupmemberslist }: { groupmemberslist: GroupMembers[] }) {
    const username = useSelector((state: RootState) => state.auth.name);
    const token = useSelector((state: RootState) => state.auth.token);
    const [targetmembers, setTargetMembers] = useState<string[]>([]);
    //若需要得到groupid，可能需要改redux/auth.ts
    const [isModalOpen, setIsModalOpen] = useState(false);

    const removeMember = ()=>{
        fetch(`${BACKEND_URL}/api/group/remove_member`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
            body: JSON.stringify({
                username,
                targetmembers,
            })
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
        removeMember();
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
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
            <Checkbox.Group
                onChange={(selectedValues: string[]) => setTargetMembers(selectedValues)}
                value={targetmembers}
            >
            {groupmemberslist? (groupmemberslist.map((member, index) => (
                <Checkbox key={index} value={member.memberName}>
                {member.memberName}
                </Checkbox>
            ))):(
                <p>Loading group members list...</p>
              )}
            </Checkbox.Group>
          </Modal>
        </div>
      );
};
export default RemoveMember;