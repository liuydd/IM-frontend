export type Message = {
  id: number; // 消息ID
  avatar: string; // 发送者头像
  conversation: number; // 会话 ID
  sender: string; // 发送者
  content: string; // 消息内容
  timestamp: number; // 时间戳
  isRead: boolean; // 判断消息是否已读（针对私聊）
  readBy: string[]; // 已读该消息的成员列表（针对群聊）
  responseCount: number;
  conversationType?: 'private_chat' | 'group_chat';
  reply_to: number;
};

export type Conversation = {
  id: number; // 会话ID
  type: 'group_chat' | 'private_chat'; // 会话类型：群聊或私聊
  members: string[]; // 会话成员列表
  unreadCount?: number; // 未读计数
};
