import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, message } from "antd";

function WithdrawGroup(){
    const username = useSelector((state: RootState) => state.auth.name);
    const token = useSelector((state: RootState) => state.auth.token);

    const withdrawGroup = ()=>{
        fetch(`${BACKEND_URL}/group/withdraw_group`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // groupid,
                // userid
                username, //暂时传这个，后面根据后端需要的消息再修改
            }),
        })
        .then((res) => res.json())
        .then((res) => {
            if (Number(res.code) === 0) {
                alert(res.info);
            }
            else {
                alert(res.info);
            }
        })
        .catch((err) => alert(FAILURE_PREFIX + err));
    };

    return (
        <Button type="primary" danger onClick={withdrawGroup}>
          退出当前群聊
        </Button>
    );
};
export default WithdrawGroup;