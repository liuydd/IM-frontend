import React, { useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import { db } from '../../api/db';
import { Conversation, Message } from '../../api/types';
import { DatePicker, Space, Button, Select, Radio, Modal } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
import { getMessages } from '../../api/chat';
import { BACKEND_URL, FAILURE_PREFIX } from "../../constants/string";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// interface GroupMembers{
//     name: string;
//     id: number;
// }

const Filterchat = ({conversationId, groupmemberslist}: {conversationId: number, groupmemberslist: string[]}) => {
    const [start, setStartDate] = useState('');
    const [end, setEndDate] = useState('');
    // const [senderid, setSenderid] = useState(0);
    const [sendername, setSendername] = useState('');
    const userid = useSelector((state: RootState) => state.auth.userid);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFilter = () => {
        fetch(`${BACKEND_URL}/api/messages/filter?userid=${userid}&conversationId=${conversationId}&sendername=${sendername}&start=${start}&end=${end}`)
        .then((res)=>res.json())
        .then((res)=>{
            if (Number(res.code) === 0) {
                setMessages(res.messages);
            }
            else {
                alert(res.info);
            }
        })
    };

    const showModal = () => {
        setIsModalOpen(true);
      };

      const handleOk = () => {
        setIsModalOpen(false);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };

    return(
        <div>
            <Button type="primary" onClick={showModal}>
            筛选聊天记录
        </Button>
        <Modal
            title="筛选聊天记录"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Space direction="vertical" size={12}>
            <RangePicker 
                showTime
                onChange={(dates) => {
                    if (dates && dates.length === 2) {
                        setStartDate(dates[0] ? dates[0].format('YYYY-MM-DD HH:mm:ss') : '');
                        setEndDate(dates[1] ? dates[1].format('YYYY-MM-DD HH:mm:ss') : '');
                    } else {
                        setStartDate('');
                        setEndDate('');
                    }
                }}
            />
            <Radio.Group onChange={(e) => setSendername(e.target.value)} value={sendername}>
              {groupmemberslist? (groupmemberslist.map((member, index) => (
                <Radio key={index} value={member}>
                  {member}
                </Radio>
              ))): (
                <p>Loading group members list...</p>
              )}
            </Radio.Group>
            <Button type="primary" onClick={handleFilter}>Filter</Button>
        </Space>
            <ul>
                {messages.map((v, index) => (
                    <li key={index}>
                        <p>发送者: message.sender</p>
                        <p>发送时间: message.timestamp</p>
                        <p>message.content</p>
                    </li>
                ))}
                </ul>
        </Modal>
        </div>
    );
};
export default Filterchat;
