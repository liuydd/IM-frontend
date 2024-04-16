import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, Checkbox, Form, Input } from "antd";

interface GroupMembers{
    memberName: string,
}
interface Friend{
    friend: string;
    labels: string[];
}

function CreateGroup({ friendlist }: { friendlist: Friend[] }) {
    const username = useSelector((state: RootState) => state.auth.name);
    const token = useSelector((state: RootState) => state.auth.token);
    const [members, setGroupMembers] = useState<GroupMembers[]>([]);

    const createGroup = () =>{
        fetch(`${BACKEND_URL}/api/group/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
            body: JSON.stringify({
                username,
                members,
            })
        })
        .then((res)=>res.json())
        .then((res)=>{
            alert(res.info);
        })
        .catch((err)=>{
            alert(FAILURE_PREFIX);
        });
    };
    return (
        <Form onFinish={createGroup}>
          <Form.Item label="选择群成员">
            {friendlist ? (
              friendlist.map((friend, index) => (
                <Checkbox
                  key={index}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setGroupMembers([...members, { memberName: friend.friend }]);
                    } else {
                      setGroupMembers(members.filter((m) => m.memberName !== friend.friend));
                    }
                  }}
                >
                  {friend.friend}
                </Checkbox>
              ))
            ) : (
              <p>Loading friend list...</p>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              创建群聊
            </Button>
          </Form.Item>
        </Form>
      );
};
export default CreateGroup;