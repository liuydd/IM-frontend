import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX } from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, Modal, Radio } from "antd";

interface GroupMembers {
  memberName: string,
}

function TransferMonitor({ groupmemberslist }: { groupmemberslist: GroupMembers[] }) {
  const userid = useSelector((state: RootState) => state.auth.userid);
  const token = useSelector((state: RootState) => state.auth.token);
  const groupid = useSelector((state: RootState) => state.group.groupid);
  const [newMonitor, setNewMonitor] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const transferMonitor = () => {
    fetch(`${BACKEND_URL}/api/group/transfer_monitor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        userid,
        //newMonitor是userid，不是username
        newMonitor,
        groupid
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
    transferMonitor();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  return (
    <div>
      <Button type="primary" onClick={showModal}>
        群主转让
      </Button>
      <Modal
        title="选择新群主"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Radio.Group onChange={(e) => setNewMonitor(e.target.value)} value={newMonitor}>
          {groupmemberslist ? (groupmemberslist.map((member, index) => (
            <Radio key={index} value={member.memberName}>
              {member.memberName}
            </Radio>
          ))) : (
            <p>Loading group members list...</p>
          )}
        </Radio.Group>
      </Modal>
    </div>
  );


};
export default TransferMonitor;