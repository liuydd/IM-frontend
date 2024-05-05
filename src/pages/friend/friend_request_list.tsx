import { useState, useEffect } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Respond2FriendRequest from "./respond_friend_request";
import { Input, Select, Button, Typography } from 'antd';

interface FriendRequests {
    sender: string;
    receiver: string;
    timestamp: string;
    responseStatus: string;
  }

function ListFriendRequests() {
    const [friendRequests, setFriendRequests] = useState<{ requestsSent: FriendRequests[]; requestsReceived: FriendRequests[] }>({ requestsSent: [], requestsReceived: [] });
    //const [loading, setLoading] = useState(true);
    const userid = useSelector((state: RootState) => state.auth.userid);
    const token = useSelector((state: RootState) => state.auth.token);
  
    // useEffect(() => {
    //   fetchFriendRequests();
    // }, []);
  
    const fetchFriendRequests = () => {
      
        fetch(`${BACKEND_URL}/api/friend/friend_request_list`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization : `${token}`
          },
          body: JSON.stringify({ userid })
        })
        .then((res) => res.json())
        .then((res) => {
            if (Number(res.code) === 0) {
              setFriendRequests(res);
            }
            else{
                alert(res.info);
            }
        })
        .catch((error) => {
          alert("An error occurred while fetching friends.");
      });
    };
  
    // if (loading) {
    //   return <div>Loading...</div>;
    // }
  
    return (
      <div>
        <h2>Friend Requests</h2>
        <Button onClick={fetchFriendRequests}>Fetch Friend Requests</Button>
        <h3>Sent Requests:</h3>
        <ul>
          {friendRequests.requestsSent.map((request, index) => (
            <li key={index}>
              {/* <p>Sender: {request.sender}</p> */}
              <p>Receiver: {request.receiver}</p>
              <p>Timestamp: {request.timestamp}</p>
              <p>Response Status: {request.responseStatus}</p>
            </li>
          ))}
        </ul>
        <h3>Received Requests:</h3>
        <ul>
          {friendRequests.requestsReceived.map((request, index) => (
            <li key={index}>
              <p>Sender: {request.sender}</p>
              {/* <p>Receiver: {request.receiver}</p> */}
              <p>Timestamp: {request.timestamp}</p>
              <p>Response Status: {request.responseStatus}</p>
              <Respond2FriendRequest friend = {request.sender} />
            </li>
          ))}
        </ul>
      </div>
    );
};

export default ListFriendRequests;