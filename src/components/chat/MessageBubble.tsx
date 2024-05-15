import React from 'react';
import styles from './MessageBubble.module.css';
import { useState } from 'react';

export type MessageBubbleProps = {
  sender: string; // 消息发送者
  content: string; // 消息内容
  timestamp: number; // 消息时间戳
  isMe: boolean; // 判断消息是否为当前用户发送
  isRead: boolean; // 判断消息是否已读（针对私聊）
  readBy: string[]; // 已读该消息的成员列表（针对群聊）
  conversationType?: 'private_chat' | 'group_chat';
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
}) => {
  // 格式化时间戳为易读的时间格式
  const formattedTime = new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

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
      </div>
      <div
        className={`${styles.bubble} ${
          isMe ? styles.meBubble : styles.othersBubble
        }`}
      >
        {content} {/* 显示消息内容 */}
      </div>
    </div>
  );
};

export default MessageBubble;
