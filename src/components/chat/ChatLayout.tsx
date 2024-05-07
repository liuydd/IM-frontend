import { useState } from "react";
import { Layout, Input, Button, List } from "antd";

const { Content, Footer } = Layout;

const ChatPage = ({chat}: {chat: string}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  if (chat === "") {
    return(
        <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '16px' }}>
        请选择一个对话
      </Content>
    </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '16px' }}>
        <List
          dataSource={messages}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Content>
      <Footer style={{ borderTop: '1px solid #ddd', padding: '16px' }}>
        <Input
          value={message}
          onChange={handleInputChange}
          onPressEnter={handleSendMessage}
          placeholder="Type a message..."
          style={{ marginRight: '8px' }}
        />
        <Button type="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Footer>
    </Layout>
  );
};

export default ChatPage;