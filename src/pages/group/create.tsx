import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setPassword, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button, Checkbox, Form, Input } from "antd";
import { addConversation } from "../../api/chat";
import { db } from '../../api/db';

// interface GroupMembers{
//     memberid: number,
// }
interface Friend{
    friendid: number;
    friend: string;
    labels: string[];
}

function CreateGroup({ friendlist }: { friendlist: Friend[] }) {
    const userid = useSelector((state: RootState) => state.auth.userid);
    const token = useSelector((state: RootState) => state.auth.token);
    const username = useSelector((state: RootState) => state.auth.name);
    // const [members, setGroupMembers] = useState<GroupMembers[]>([]);
    const [members, setGroupMembers] = useState<number[]>([]);
    const [membersname, setGroupMembersname] = useState<string[]>([]);
    const [groupid, setGroupid] = useState<number>(0);
    const [conversation_id, setConversationId] = useState<number>(0);

    // const handleMemberChange = (checkedValues: number[]) => {
    //   setGroupMembers(checkedValues);
    // };
    const handleMemberChange = (checkedValues: number[], checkedNames: string[]) => {
      setGroupMembers(checkedValues);
      setGroupMembersname(checkedNames);
    };

    const createGroup = async function createGroup() {
      try {
          const response = await fetch(`${BACKEND_URL}/api/group/create`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `${token}`,
              },
              body: JSON.stringify({
                  userid,
                  members,
              }),
          });
          
          const res = await response.json();
          alert(res.info);
          setGroupid(res.groupid);
          const newGroupid = res.groupid;
          
          const conv = await addConversation({ type: 'group_chat', members: [...membersname, username] });
          setConversationId(conv.id);
          const newConversationId = conv.id;
          await db.pullConversations([newConversationId]);

          const ress = await fetch(`${BACKEND_URL}/api/group/bind`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
            body: JSON.stringify({
                groupid: newGroupid,
                conversation_id: newConversationId,
            }),
        });
      } catch (err) {
          alert(FAILURE_PREFIX);
      }

    };

    return (
        <Form onFinish={createGroup}>
          <Form.Item label="选择群成员">
            {friendlist ? (
              friendlist.map((friend, index) => (
                <Checkbox
                  key={index}
                  value={friend.friendid}
                  onChange={(e) =>
                    // handleMemberChange(
                    //   e.target.checked
                    //     ? [...members, e.target.value]
                    //     : members.filter((member) => member !== e.target.value)
                    // )
                    handleMemberChange(
                      e.target.checked
                        ? [...members, e.target.value]
                        : members.filter((member) => member !== e.target.value),
                      e.target.checked
                        ? [...membersname, friend.friend]
                        : membersname.filter((name) => name !== friend.friend)
                    )
                  }
                  // onChange={(e) => {
                  //   if (e.target.checked) {
                  //     setGroupMembers([...members, {memberid : friend.friendid }]);
                  //   } else {
                  //     setGroupMembers(members.filter((m) => m.memberid !== friend.friendid));
                  //   }
                  // }}
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