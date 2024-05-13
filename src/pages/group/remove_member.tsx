import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, Checkbox, Form, Input, Modal, Radio } from "antd";

// interface GroupMembers{
//     memberName: string,
// }

interface GroupMembers{
  name: string;
  id: number;
}

function RemoveMember({ groupmemberslist, groupid }: { groupmemberslist: GroupMembers[], groupid: number }) {
    const userid = useSelector((state: RootState) => state.auth.userid);
    // const groupid = useSelector((state: RootState) => state.group.groupid);
    const token = useSelector((state: RootState) => state.auth.token);
    // const [targetid, setTargetMembers] = useState<number[]>([]);
    const [targetid, setTargetMembers] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const removeMember = ()=>{
        fetch(`${BACKEND_URL}/api/group/remove_member`, {
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
            {/* <Checkbox.Group
                onChange={(selectedValues: number[]) => setTargetMembers(selectedValues)}
                value={targetid}
            >
            {groupmemberslist? (groupmemberslist.map((member, index) => (
                <Checkbox key={index} value={Number(member)}>
                {member}
                </Checkbox>
            ))):(
                <p>Loading group members list...</p>
              )}
            </Checkbox.Group> */}
            <Radio.Group onChange={(e) => setTargetMembers(e.target.value)} value={targetid}>
              {groupmemberslist? (groupmemberslist.map((member, index) => (
                <Radio key={index} value={member.id}>
                  {member.name}
                </Radio>
              ))): (
                <p>Loading group members list...</p>
              )}
            </Radio.Group>
          </Modal>
        </div>
      );
};
export default RemoveMember;