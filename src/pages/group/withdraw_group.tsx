import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, message } from "antd";

function WithdrawGroup({ groupid }: { groupid: number }){
    const userid = useSelector((state: RootState) => state.auth.userid);
    // const groupid = useSelector((state: RootState) => state.group.groupid);
    const token = useSelector((state: RootState) => state.auth.token);

    const withdrawGroup = ()=>{
        fetch(`${BACKEND_URL}/api/group/withdraw_group`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
            },
            body: JSON.stringify({
                userid,
                groupid
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