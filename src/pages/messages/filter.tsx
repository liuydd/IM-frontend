import React, { useRef, useState } from 'react';
import { db } from '../../api/db';
import { Conversation, Message } from '../../api/types';
import { DatePicker, Space, Button, Select, Radio, Modal, TimePicker } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
import { getMessages } from '../../api/chat';
import { BACKEND_URL, FAILURE_PREFIX } from "../../constants/string";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useLocalStorageState, useRequest } from 'ahooks';

// interface GroupMembers{
//     name: string;
//     id: number;
// }

const Filterchat = ({conversationId, groupmemberslist}: {conversationId: number, groupmemberslist: string[]}) => {
    // const [start, setStartDate] = useState('');
    // const [end, setEndDate] = useState('');
    const [start, setStartDate] = useState<number | null>(null);
    const [end, setEndDate] = useState<number | null>(null);
    // const [senderid, setSenderid] = useState(0);
    const [sendername, setSendername] = useState('');
    const [username, setUsername] = useLocalStorageState('me', { defaultValue: 'test' });
    // const userid = useSelector((state: RootState) => state.auth.userid);

    const [messages, setMessages] = useState<Message[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFilter = () => {
        let url = `${BACKEND_URL}/api/messages/filter?username=${username}&conversationId=${conversationId}`;
        if(sendername !== ''){
            url += `&sendername=${sendername}`
        }
        if(start !== null){
            url += `&start=${start}`
        }
        if(end !== null){
            url += `&end=${end}`
        }
        fetch(url)
            .then((res)=>res.json())
            .then((res)=>{
                if (Number(res.code) === 0) {
                    setMessages(res.messages);
                    alert("success")
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
    
    const formattime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
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
            {/* <RangePicker 
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
            /> */}
            <TimePicker
                format="HH:mm:ss"
                onChange={(time) => {
                // setStartDate(time ? time.format('HH:mm:ss') : '');
                setStartDate(time ? time.valueOf() : null);
                }}
            />
          <TimePicker
                format="HH:mm:ss"
                onChange={(time) => {
                // setEndDate(time ? time.format('HH:mm:ss') : '');
                setEndDate(time ? time.valueOf() : null);
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
                {messages.map((message, index) => (
                    <li key={index}>
                        <p>发送者: {message.sender}</p>
                        <p>发送时间: {formattime(message.timestamp)}</p>
                        <p>{message.content}</p>
                    </li>
                ))}
                </ul>
        </Modal>
        </div>
    );
};
export default Filterchat;
