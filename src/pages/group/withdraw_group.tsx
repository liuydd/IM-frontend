import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, message } from "antd";
import { db } from '../../api/db';
import { leaveConversation } from "../../api/chat";
import { useLocalStorageState, useRequest } from 'ahooks';

function WithdrawGroup({ groupid, conversationId }: { groupid: number, conversationId: number }){
    const userid = useSelector((state: RootState) => state.auth.userid);
    // const groupid = useSelector((state: RootState) => state.group.groupid);
    const token = useSelector((state: RootState) => state.auth.token);
    const [me, setMe] = useLocalStorageState('me', { defaultValue: 'test' });

    // const withdrawGroup = ()=>{
    //     fetch(`${BACKEND_URL}/api/group/withdraw_group`, {
    //         method: "DELETE",
    //         headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `${token}`,
    //         },
    //         body: JSON.stringify({
    //             userid,
    //             groupid
    //         }),
    //     })
    //     .then((res) => res.json())
    //     .then((res) => {
    //         if (Number(res.code) === 0) {
    //             alert(res.info);
    //         }
    //         else {
    //             alert(res.info);
    //         }
    //     })
    //     .catch((err) => alert(FAILURE_PREFIX + err));
    // };
    const withdrawGroup = async function withdrawGroup() {
        try {
            const response = await fetch(`${BACKEND_URL}/api/group/withdraw_group`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
                },
                body: JSON.stringify({
                    userid,
                    groupid
                }),
            });
            
            const res = await response.json();
            alert(res.info);
            alert(conversationId);
            try {
                await leaveConversation({
                  conversationId: conversationId,
                  me: me!,
                });
                await db.removeConversations([conversationId]);
                message.success('退出成功');
              } catch (err) {
                const resp = (err as any).response || {};
                if (resp.status == 404) {
                  message.error('会话不存在');
                } else if (resp.status == 403) {
                  message.error('会话不是群聊');
                }
            }

        } catch (err) {
            alert(FAILURE_PREFIX);
        }
      };

    return (
        <Button type="primary" danger onClick={withdrawGroup}>
          退出当前群聊
        </Button>
    );
};
export default WithdrawGroup;