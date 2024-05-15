import React from 'react';
import type { MenuProps } from 'antd';
import { Popover, Button } from 'antd';

function expandOperation({messageId, content}: {messageId: number, content: string}){
    
    const handleReply = () => { //待改，可能需要用到Chatbox的逻辑
        // 处理回复功能
        console.log('回复消息ID为：', messageId);
    };
    
    return (
    <Popover
        content={
        <Button type="link" onClick={handleReply}>
            回复
        </Button>
        }
        trigger="contextMenu" // 触发右键菜单
    >
        <div className="message-content">{content}</div>
    </Popover>
    );
};
export default expandOperation;