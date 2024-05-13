import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken, setUserid } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, Modal, List } from "antd";

interface Announcement {
    author: string;
    content: string;
    timestamp: string;
}

function ListAnnouncement({ groupid }: { groupid: number }) {
    const username = useSelector((state: RootState) => state.auth.name);
    const userid = useSelector((state: RootState) => state.auth.userid);
    const token = useSelector((state: RootState) => state.auth.token);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    const listannouncement = () =>{
        fetch(`${BACKEND_URL}/api/group/list_announcement`, {
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
                    // alert(res.info);
                    setAnnouncements(res.announcements);
                    // setIsModalOpen(true);
                }
                else {
                    alert(res.info);
                }
            })
            .catch((err) => alert(FAILURE_PREFIX + err));
    };

    const showModal = () => {
        listannouncement();
        setIsModalOpen(true);
    }

    const handleOk = () => {
        setIsModalOpen(false);
        };
    
        const handleCancel = () => {
        setIsModalOpen(false);
        };

    return(
        <div>
            <Button type="primary" onClick={showModal}>
                历史群公告
            </Button>
            <Modal
                title="历史群公告"
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                {/* <List
                    dataSource={announcements}
                    renderItem={(item: any) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.author}
                                description={item.content}
                            />
                        </List.Item>
                    )}
                /> */}
                <ul>
                {announcements.map((announcement, index) => (
                    <li key={index}>
                        <p>创建者: {announcement.author}</p>
                        <p>创建时间：{announcement.timestamp}</p>
                        <p>{announcement.content}</p>
                    </li>
                ))}
                </ul>
            </Modal>
        </div>
    );
};
export default ListAnnouncement;