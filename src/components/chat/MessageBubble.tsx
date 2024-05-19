import React from 'react';
import styles from './MessageBubble.module.css';
import { useState } from 'react';
import { Popover, Button } from 'antd';
import { deleteMessage } from '../../api/chat';
import { db } from '../../api/db';
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { Avatar } from 'antd';
import faye from "../../avatars/faye.jpg";
import spike from "../../avatars/spike.jpg";
import asuka from "../../avatars/asuka.jpg";
import fuu from "../../avatars/fuu.jpg";
import jin from "../../avatars/jin.jpg";
import mugen from "../../avatars/mugen.jpg";
import Rei from "../../avatars/Rei.jpg";
import ritsuko from "../../avatars/ritsuko.jpg";
import { StaticImageData } from "next/image";

const avatarMap: { [key: string]:  StaticImageData} = {
  "faye": faye,
  "spike": spike,
  "asuka": asuka,
  "fuu": fuu,
  "jin": jin,
  "mugen": mugen,
  "Rei": Rei,
  "ritsuko": ritsuko,
};

export type MessageBubbleProps = {
  sender: string; // 消息发送者
  avatar: string; // 发送者头像
  content: string; // 消息内容
  timestamp: number; // 消息时间戳
  isMe: boolean; // 判断消息是否为当前用户发送
  message_id : number;
  reply_id: number;
  response_count: number;
  onDelete: (message_id: number) => void; // 删除消息的回调函数
  onReply: (messagecontent: string, message_id: number) => void; // 回复消息的回调函数
  onScrollToMessage: (message_id: number) => void; // 滚动到指定消息的回调函数
  // isRead: boolean; // 判断消息是否已读（针对私聊）
  readBy: string[]; // 已读该消息的成员列表（针对群聊）
  conversationType?: 'private_chat' | 'group_chat';
  // onReply? : (data: { messagecontent: string }) => void;
};

// 消息气泡组件
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  sender,
  avatar,
  content,
  timestamp,
  isMe,
  message_id,
  reply_id,
  // response_count,
  onDelete,
  onReply,
  onScrollToMessage,
  // isRead,
  // readBy,
  conversationType,
  // onReply,
}) => {
  // 格式化时间戳为易读的时间格式
  const formattedTime = new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [response_count, setResponseCount] = useState(0);
  const [readBy, setReadBy] = useState([]);

  const hide = () => {
    setClicked(false);
    setHovered(false);
  };

  const getResponseCount = () => {
    fetch(`${BACKEND_URL}/api/messages/detail?message_id=${message_id}`)
      .then((response) => response.json())
      .then((res) => {
        if (Number(res.code) === 0) {
          setResponseCount(res.responseCount);
          setReadBy(res.readBy);
      }
      else {
          alert(res.info);
      }
      })
  }

  const handleHoverChange = (open: boolean) => {
    setHovered(open);
    setClicked(false);
    getResponseCount();
  };

  const handleClickChange = (open: boolean) => {
    setHovered(false);
    setClicked(open);
    getResponseCount();
  };

  const handleReply = () => {
    onReply(content, message_id);
    
    // onScrollToMessage(message_id);
  };

  const handleDelete = () =>{
    onDelete(message_id); // 通知父组件删除消息
  }

  const readStatus = () => {
    // 确保 readBy 已定义，如果未定义则赋予一个空数组
    const safeReadBy = readBy || [];
  
    if (conversationType === 'private_chat') {
      let status = "未读";
      if (safeReadBy.length === 2) {
        status = "已读";
      }
      return status;
    } else {
      const result = `${safeReadBy.join(", ")} 已读`;
      return result;
    }
  };
  
  return (
    <div className={`${styles.container} ${isMe ? styles.me : styles.others}`}>
      <div className={styles.sender}>
        {sender} @ {formattedTime}
      </div>
      <div className={`${styles.messageWrapper} ${isMe ? styles.meWrapper : styles.othersWrapper}`}>
        {!isMe && <Avatar size={48} src={avatarMap[avatar].src} className={styles.avatar} />}
        <div
          className={`${styles.bubble} ${isMe ? styles.meBubble : styles.othersBubble}`}
          id={String(message_id)}
          onClick={() => onScrollToMessage(reply_id)}
        >
          <Popover
            style={{ width: 500 }}
            content={
              <div>
                <Button onClick={handleDelete}>删除</Button>
                <Button onClick={handleReply}>回复</Button>
                <p><span>({response_count ? response_count + ' 条回复' : 0 + ' 条回复'})</span></p>
                <p>{readStatus()}</p>
              </div>
            }
            trigger="hover"
            open={hovered}
            onOpenChange={handleHoverChange}
          >
            <Popover
              content={
                <div>
                  <Button onClick={handleDelete}>删除</Button>
                  <Button onClick={handleReply}>回复</Button>
                </div>
              }
              trigger="contextMenu"
              open={clicked}
              onOpenChange={handleClickChange}
            >
              {content}
            </Popover>
          </Popover>
        </div>
        {isMe && <Avatar size={48} src={avatarMap[avatar].src} className={styles.avatar} />}
      </div>
    </div>
  );
};

export default MessageBubble;
