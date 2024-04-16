import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX, LOGIN_FAILED, LOGIN_SUCCESS_PREFIX } from "../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../redux/auth";
import { useDispatch } from "react-redux";

interface SearchResult {
    code: number;
    info: string;
    targetInfo: {
      username: string;
      email: string;
      phoneNumber: string;
    };
}

function SearchUser(){
    const [method, setMethod] = useState("");
    const [targetname, setTargetName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

    const searchUser = () => {
        let url = `/api/search_user?method=${method}`;

        if(method === 'targetname'){
            url += `&targetname=${targetname}`;
        }
        else if(method === 'email'){
            url += `&email=${email}`;
        }
        else if(method === 'phoneNumber'){
            url += `&phoneNumber=${phoneNumber}`;
        }
        fetch(url)
        .then((res) => res.json())
        .then((res) => {
            if (Number(res.code) === 0) {
                setSearchResult(res);
            }
            else{
                alert(res.info);
            }
        })
    };

    return (
        <div>
        <h1>Search User</h1>
        {searchResult &&(
            <div>
            <p>Username: {searchResult.targetInfo.username}</p>
            <p>Email: {searchResult.targetInfo.email}</p>
            <p>Phone Number: {searchResult.targetInfo.phoneNumber}</p>
            </div>
        )}
        <label>
            Method:
            <select value={method} onChange={e => setMethod(e.target.value)}>
            <option value="">Select Method</option>
            <option value="targetname">Username</option>
            <option value="email">Email</option>
            <option value="phoneNumber">Phone Number</option>
            </select>
        </label>
        {method && (
            <div>
            {method === 'targetname' && (
                <label>
                Username:
                <input type="text" value={targetname} onChange={e => setTargetName(e.target.value)} />
                </label>
            )}
            {method === 'email' && (
                <label>
                Email:
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
            )}
            {method === 'phoneNumber' && (
                <label>
                Phone Number:
                <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                </label>
            )}
            <button onClick={searchUser}>Search</button>
            </div>
        )}
        </div>
    );
};
export default SearchUser;