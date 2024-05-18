import React, { useRef, useState, useEffect } from 'react';
import { Input, Button, Divider, message } from 'antd';
import { useRequest } from 'ahooks';
import styles from './Chatbox.module.css';
import MessageBubble from './MessageBubble';
import { Conversation, Message } from '../../api/types';
import { addMessage, deleteMessage } from '../../api/chat';
import { getConversationDisplayName } from '../../api/utils';
import { db } from '../../api/db';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Filterchat from '../../pages/messages/filter';

export type ChatboxProps = {
  me: string; // 当前用户
  conversation?: Conversation; // 当前选中的会话 (可能为空)
  lastUpdateTime?: number; // 本地消息数据最后更新时间，用于触发该组件数据更新
  // onDeleteMessage?: (message_id: number) => void; // 删除消息的回调函数
  onUpdateLastUpdateTime?: () => void; // 更新 lastUpdateTime 的回调函数
};

// 聊天框组件
const Chatbox: React.FC<ChatboxProps> = ({
  me,
  conversation,
  lastUpdateTime,
  onUpdateLastUpdateTime,
}) => {
  const cachedMessagesRef = useRef<Message[]>([]); // 使用ref存储组件内缓存的消息列表
  const [sending, setSending] = useState(false); // 控制发送按钮的状态
  const [inputValue, setInputValue] = useState(''); // 控制输入框的值
  const messageEndRef = useRef<HTMLDivElement>(null); // 指向消息列表末尾的引用，用于自动滚动
  const userid = useSelector((state: RootState) => state.auth.userid);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [scrollToMessage, setScrollToMessage] = useState<number | null>(null); //被回复消息的id

  // 使用ahooks的useRequest钩子从IndexedDB异步获取消息数据，依赖项为lastUpdateTime
  const { data: messages } = useRequest(
    async () => {
      if (!conversation) return [];
      const curMessages = cachedMessagesRef.current;
      const newMessages = await db.getMessages(conversation); // 从本地数据库获取当前会话的所有消息
      cachedMessagesRef.current = newMessages;
      // 设置定时器以确保滚动操作在数据更新后执行
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({
          behavior: curMessages.length > 0 ? 'smooth' : 'instant', // 根据消息数量选择滚动方式 (平滑滚动 / 瞬间跳转)
        });
      }, 10);
      return cachedMessagesRef.current; // 返回更新后的消息列表
    },
    { refreshDeps: [conversation, lastUpdateTime] }
  );

  // 发送消息的函数
  const sendMessage = () => {
    if (!inputValue) {
      message.error('消息内容不能为空');
      return;
    }
    let content = inputValue.trim();
    if (replyingTo) {
      // content = `回复 ${replyingTo}:\n${content}`;
      setReplyingTo(null);
    }
    setSending(true);
    addMessage({ me, content, conversation: conversation! }) // 调用API发送消息
      .then(() => {
        setInputValue('');
        if (onUpdateLastUpdateTime) {
          // alert('hello');
          onUpdateLastUpdateTime(); // 调用回调函数通知父组件更新 lastUpdateTime
        }
      })
      .catch(() => message.error('消息发送失败'))
      .finally(() => setSending(false));
  };

  const handleDeleteMessage = (message_id: number) => {
    try {
      deleteMessage({me: me, message_id : message_id})
      .then(() => {
        db.removeMessage(message_id);
        if (onUpdateLastUpdateTime) {
          onUpdateLastUpdateTime(); // 调用回调函数通知父组件更新 lastUpdateTime
        }
      })
    } catch (error) {
      console.error('Error deleting message:', error);
      message.error('消息删除失败');
    }
  };

  const handleReply = (messagecontent: string ) => {
    setInputValue(`回复 ${messagecontent}:\n`);
    setReplyingTo(messagecontent);
  };

  const handleScrollToMessage = (message_id: number) => {
    setScrollToMessage(message_id); // 设置要滚动到的消息的 message_id
  };

  useEffect(() => {
    if (scrollToMessage !== null) {
      // 使用 DOM 操作滚动到消息处
      const messageElement = document.getElementById(`message-${scrollToMessage}`);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        setScrollToMessage(null);
      }
    }
  }, [scrollToMessage]);

  return (
    <div className={styles.container}>
      {conversation && (
        <>
          <div className={styles.titleContainer}>
            <div className={styles.title}>
              {getConversationDisplayName(conversation)}
            </div>
            <Filterchat conversationId={conversation.id} groupmemberslist={conversation.members} />
        </div>
          <Divider className={styles.divider} />
        </>
      )}

      <div className={styles.messages}>
        {/* 消息列表容器 */}
        {messages?.map((item) => ( //这里后续要传isRead和ReadBY（？
          // <MessageBubble key={item.id} isMe={item.sender == me} onReply={() => handleReply({ messagecontent: item.content })} {...item} /> // 渲染每条消息为MessageBubble组件
          <MessageBubble key={item.id} isMe={item.sender == me} message_id={item.id} onDelete={handleDeleteMessage} 
          onReply={handleReply}
          onScrollToMessage={handleScrollToMessage}
          conversationType={conversation.type}
          readBy={item.readBy}
          {...item} /> // 渲染每条消息为MessageBubble组件
        ))}
        <div ref={messageEndRef} /> {/* 用于自动滚动到消息列表底部的空div */}
      </div>
      {conversation && (
        <>
          <Input.TextArea
            className={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={(e) => {
              // 按下Enter键时发送消息，除非同时按下了Shift或Ctrl
              if (!e.shiftKey && !e.ctrlKey) {
                e.preventDefault(); // 阻止默认事件
                e.stopPropagation(); // 阻止事件冒泡
                sendMessage();
              }
            }}
            rows={3}
            autoSize={false} // 关闭自动调整大小
            readOnly={sending} // 当正在发送消息时，设置输入框为只读
          />
          <Button
            className={styles.submitButton}
            type="primary"
            disabled={sending} // 当正在发送消息时，禁用按钮
            loading={sending} // 显示加载中状态
            onClick={sendMessage} // 点击时调用发送消息函数
          >
            发送 (Enter)
          </Button>
        </>
      )}
    </div>
  );
};

export default Chatbox;
