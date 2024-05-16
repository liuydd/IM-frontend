import React from 'react';
import styles from './MessageBubble.module.css';
import { useState } from 'react';
import { Popover, Button } from 'antd';

export type MessageBubbleProps = {
  sender: string; // 消息发送者
  content: string; // 消息内容
  timestamp: number; // 消息时间戳
  isMe: boolean; // 判断消息是否为当前用户发送
  isRead: boolean; // 判断消息是否已读（针对私聊）
  readBy: string[]; // 已读该消息的成员列表（针对群聊）
  conversationType?: 'private_chat' | 'group_chat';
  onReply? : (data: { messagecontent: string }) => void;
  responseCount?: number;
};

// 消息气泡组件
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  sender,
  content,
  timestamp,
  isMe,
  isRead,
  readBy,
  conversationType,
  onReply,
  responseCount,
}) => {
  // 格式化时间戳为易读的时间格式
  const formattedTime = new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const hide = () => {
    setClicked(false);
    setHovered(false);
  };

  const handleHoverChange = (open: boolean) => {
    setHovered(open);
    setClicked(false);
  };

  const handleClickChange = (open: boolean) => {
    setHovered(false);
    setClicked(open);
  };

  const handleReply = () => {
    if (onReply) {
      onReply({ messagecontent: content });
    }
  };

  return (
    <div className={`${styles.container} ${isMe ? styles.me : styles.others}`}>
      {/* 根据消息发送者显示不同的气泡样式 */}
      <div className={styles.sender}>
        {sender} @ {formattedTime} {/* 显示发送者和消息时间 */}
        {conversationType === 'private_chat' && !isMe && (
          <span>({isRead ? '已读' : '未读'})</span>
        )}
        {conversationType === 'group_chat' && !isMe && (
          <span>
            ({readBy.length > 0 ? readBy.join(', ') + ' 已读' : '尚未有人已读'})
          </span>
        )}
        {!isMe && (
          <span>({responseCount ? responseCount : 0 + ' 条回复'})</span>
        )}
      </div>
      <div
        className={`${styles.bubble} ${
          isMe ? styles.meBubble : styles.othersBubble
        }`}
      >
        {/* {content}  */}
        {!isMe && (
          <Popover
          style={{ width: 500 }}
          title="回复"
          trigger="hover"
          open={hovered}
          onOpenChange={handleHoverChange}
        >
          <Popover
            title="回复"
            trigger="contextMenu"
            open={clicked}
            onOpenChange={handleClickChange}
          >
            {content} {/* 显示消息内容 */}
          </Popover>
        </Popover>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
