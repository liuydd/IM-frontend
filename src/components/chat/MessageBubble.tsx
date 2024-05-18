import React from 'react';
import styles from './MessageBubble.module.css';
import { useState } from 'react';
import { Popover, Button } from 'antd';
import { deleteMessage } from '../../api/chat';
import { db } from '../../api/db';
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";

export type MessageBubbleProps = {
  sender: string; // 消息发送者
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
      {/* 根据消息发送者显示不同的气泡样式 */}
      <div className={styles.sender}>
        {sender} @ {formattedTime} {/* 显示发送者和消息时间 */}
        {
        // readStatus()
        /* {conversationType === 'private_chat' && !isMe && (
          <span>({isRead ? '已读' : '未读'})</span>
        )}
        {conversationType === 'group_chat' && !isMe && (
          <span>
            ({readBy.length > 0 ? readBy.join(', ') + ' 已读' : '尚未有人已读'})
          </span>
        )}
        {!isMe && (
          <span>({responseCount ? responseCount : 0 + ' 条回复'})</span>
        )} */}
      </div>
      <div
        className={`${styles.bubble} ${
          isMe ? styles.meBubble : styles.othersBubble
        }`}
        id = {String(message_id)}
        onClick={() => {
          // alert("点击成功");
          // alert(response_count);
          onScrollToMessage(reply_id);
          // alert("点击成功" + reply_id);
        }}
      >
        {/* {content}  */}
        {/* {( */}
          <Popover
          style={{ width: 500 }}
          // title="回复"
          content = {<div>
            <Button onClick={handleDelete}>删除</Button>
            <Button onClick={handleReply}>回复</Button>
            {/* <Button onClick={getResponseCount}>查看</Button> */}
            <p><span>({response_count ? response_count + ' 条回复' : 0 + ' 条回复'})</span></p>
            <p>{readStatus()}</p>
          </div>}
          trigger="hover"
          open={hovered}
          onOpenChange={handleHoverChange}
        >
          <Popover
            // title="回复"
            content = {<div>
              <Button onClick={handleDelete}>删除</Button>
              <Button onClick={handleReply}>回复</Button>
            </div>}
            trigger="contextMenu"
            open={clicked}
            onOpenChange={handleClickChange}
          >
              {content}
          </Popover>
        </Popover>
        {/* // )} */}
      </div>
      <div className={styles.sender}>
        {/* {
          <span>({response_count ? response_count : 0 + ' 条回复'})</span>
        } */}
      </div>
    </div>
  );
};

export default MessageBubble;
