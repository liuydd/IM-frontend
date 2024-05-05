import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX, LOGIN_FAILED, LOGIN_SUCCESS_PREFIX } from "../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../redux/auth";
import { useDispatch } from "react-redux";
import { Input, Select, Button, Typography } from 'antd';
const { Title } = Typography;
const { Option } = Select;
import FriendRequest from "./friend/send_friend_request";

interface SearchResult {
    code: number;
    info: string;
    targetInfo: {
        userid: number;
        username: string;
        email: string;
        phoneNumber: string;
    };
}

function SearchUser() {
    const [method, setMethod] = useState("");
    const [targetname, setTargetName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

    const searchUser = () => {
        let url = `/api/search_target_user?method=${method}`;

        if (method === 'targetname') {
            url += `&targetname=${targetname}`;
        }
        else if (method === 'email') {
            url += `&email=${email}`;
        }
        else if (method === 'phoneNumber') {
            url += `&phoneNumber=${phoneNumber}`;
        }
        fetch(url)
            .then((res) => res.json())
            .then((res) => {
                if (Number(res.code) === 0) {
                    setSearchResult(res);
                }
                else {
                    alert(res.info);
                }
            })
    };

    return (
        <div>
            <Title level={3}>Search User</Title>
            <label>
                Method:
                <Select value={method} onChange={value => setMethod(value)} style={{ width: 150, marginLeft: 8 }}>
                    <Option value="">Select Method</Option>
                    <Option value="targetname">Username</Option>
                    <Option value="email">Email</Option>
                    <Option value="phoneNumber">Phone Number</Option>
                </Select>
            </label>
            {method && (
                <div style={{ marginTop: 16 }}>
                    {method === 'targetname' && (
                        <label>
                            Username:
                            <Input type="text" value={targetname} onChange={e => setTargetName(e.target.value)} style={{ marginLeft: 8 }} />
                        </label>
                    )}
                    {method === 'email' && (
                        <label>
                            Email:
                            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ marginLeft: 8 }} />
                        </label>
                    )}
                    {method === 'phoneNumber' && (
                        <label>
                            Phone Number:
                            <Input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} style={{ marginLeft: 8 }} />
                        </label>
                    )}
                    <Button type="primary" onClick={searchUser} style={{ marginLeft: 8 }}>Search</Button>
                </div>
            )}
            {searchResult && (
                <div>
                    <p>Username: {searchResult.targetInfo.username}</p>
                    <p>Email: {searchResult.targetInfo.email}</p>
                    <p>Phone Number: {searchResult.targetInfo.phoneNumber}</p>
                    <FriendRequest friend = {searchResult.targetInfo.username} />
                </div>
            )}
        </div>
    );
};
export default SearchUser;