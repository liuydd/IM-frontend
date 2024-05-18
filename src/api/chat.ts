import { useEffect } from 'react';
import axios from 'axios';
import { getUrl } from './utils';
import { Conversation, Message } from './types';

export type AddMessageArgs = {
  // userid: number;
  me: string;
  conversation: Conversation;
  content: string;
  target?: number;
};

export type DeleteMessageArgs = {
  // userid: number;
  me: string;
  // conversation: Conversation;
  message_id : number;
};

export type GetMessagesArgs = {
  // userid: number;
  me?: string;
  conversationId?: number;
  cursor?: number;
  limit?: number;
};

export type AddConversationArgs = {
  type: 'private_chat' | 'group_chat';
  members: string[];
};

export type GetConversationsArgs = {
  idList: number[];
};

export type JoinConversationsArgs = {
  conversationId: number;
  me: string;
};

export type LeaveConversationsArgs = {
  conversationId: number;
  me: string;
};

// 向服务器添加一条消息
export async function addMessage({
  // userid,
  me,
  conversation,
  content,
  target,
}: AddMessageArgs) {
  const { data } = await axios.post(getUrl('messages'), {
    // userid: userid,
    username: me, // 发送者的用户名
    conversation_id: conversation.id, // 会话ID
    content: content, // 消息内容
    target: target, //回复的对象名
  });
  return data;
}

//向服务器中删除一条消息
export async function deleteMessage({
  me,
  // conversation,
  message_id,
}: DeleteMessageArgs){
  try {
    const res = await axios.delete(getUrl('messages'), {
      params: {
        username: me,
        // conversation_id: conversation.id,
        message_id: message_id,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Message deleted successfully');
    return res.data; // 如果需要返回删除操作的结果，可以根据需要进行处理
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error; // 将错误继续向上抛出，以便上层代码处理
  }
  
}

// 从服务器获取消息列表
export async function getMessages({
  // userid,
  me,
  conversationId,
  cursor,
  limit,
}: GetMessagesArgs) {
  const messages: Message[] = [];
  while (true) {
    // 使用循环来处理分页，直到没有下一页
    const { data } = await axios.get(getUrl('messages'), {
      params: {
        // userid: userid,
        username: me, // 查询消息的用户名
        conversation_id: conversationId, // 查询消息的会话 ID
        after: cursor || 0, // 用于分页的游标，表示从此时间戳之后的消息
        limit: limit || 100, // 每次请求的消息数量限制
      },
    });
    data.messages.forEach((item: Message) => {
      messages.push(item);
      alert("回复数为" + item.responseCount+",\n发送者为"+item.sender);}
      // console.log(item.responseCount);
    ); // 将获取到的消息添加到列表中
    if (!data.has_next) break; // 如果没有下一页，则停止循环
    cursor = messages[messages.length - 1].timestamp; // 更新游标为最后一条消息的时间戳，用于下轮查询
  }
  return messages;
}

// 向服务器添加一个新会话 (私聊/群聊)
export async function addConversation({ type, members }: AddConversationArgs) {
  const { data } = await axios.post(getUrl('conversations'), {
    type,
    members,
  });
  return data as Conversation;
}

// 从服务器查询指定会话信息
export async function getConversations({ idList }: GetConversationsArgs) {
  const params = new URLSearchParams();
  idList.forEach((id) => params.append('id', id.toString()));
  const { data } = await axios.get(getUrl('conversations'), {
    params,
  });
  return data.conversations as Conversation[];
}

export async function joinConversation({
  me,
  conversationId,
}: JoinConversationsArgs) {
  await axios.post(getUrl(`conversations/${conversationId}/join`), {
    username: me,
  });
}

//将某个聊天会话的消息全标记为已读
// export async function markMessagesAsRead(me: string, conversationId: number) {
//   await axios.post(getUrl(`conversations/${conversationId}/read`), {username: me});
// }

//得到某条消息的已读未读状态
export async function getMessageReadStatus(me: string, messageId: number) {
  const response = await axios.get(getUrl(`messages/${messageId}/read`), {
    params: { username: me },
  });
  return response.data; //后端传来的数据
}

export async function leaveConversation({
  me,
  conversationId,
}: JoinConversationsArgs) {
  await axios.post(getUrl(`conversations/${conversationId}/leave`), {
    username: me,
  });
}

// 使用React的useEffect钩子来监听WebSocket消息
export const useMessageListener = (fn: () => void, me: string) => {
  useEffect(() => {
    let ws: WebSocket | null = null;
    let closed = false;

    const connect = () => {
      ws = new WebSocket(
        getUrl(`ws/?username=${me}`).replace('https://', 'wss://') // 将http协议替换为ws协议，用于WebSocket连接
        // getUrl(`ws/?username=${me}`).replace('http://', 'ws://')
      );

      ws.onopen = () => {
        console.log('WebSocket Connected');
      };

      ws.onmessage = async (event) => {
        if (event.data) {
          const data = JSON.parse(event.data);
          if (data.type == 'notify') fn(); // 当接收到通知类型的消息时，执行回调函数
        }
      };

      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        if (!closed) {
          console.log('Attempting to reconnect...');
          setTimeout(() => {
            connect(); // 当WebSocket连接关闭时，尝试重新连接
          }, 1000);
        }
      };
    };

    connect();

    return () => {
      if (ws) {
        closed = true;
        ws.close(); // 组件卸载时关闭WebSocket连接
      }
    };
  }, [me, fn]); // 当前用户(me)或回调函数(fn)变化时，重新执行Effect
};
