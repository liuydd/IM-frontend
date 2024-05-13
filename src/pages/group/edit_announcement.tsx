import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken, setUserid } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, Modal, Input } from "antd";

function EditAnnouncement({ groupid }: { groupid: number }) {
    const username = useSelector((state: RootState) => state.auth.name);
    const userid = useSelector((state: RootState) => state.auth.userid);
    const token = useSelector((state: RootState) => state.auth.token);
    const [content, setContent] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const editannouncement = () =>{
        fetch(`${BACKEND_URL}/api/group/edit_announcement`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
            body: JSON.stringify({
                userid,
                groupid,
                content,
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
        editannouncement();
        setIsModalOpen(false);
        };
    
        const handleCancel = () => {
        setIsModalOpen(false);
        };

    return (
        <div>
            <Button type="primary" onClick={showModal}>
                编辑群公告
            </Button>
            <Modal
                title="编辑群公告"
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input.TextArea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="请输入群公告内容"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                />
            </Modal>
        </div>
    );

};
export default EditAnnouncement;