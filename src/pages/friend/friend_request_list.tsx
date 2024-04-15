import { useState, useEffect } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface FriendRequests {
    sender: string;
    receiver: string;
    timestamp: string;
    responseStatus: string;
  }

function ListFriendRequests() {
    const [friendRequests, setFriendRequests] = useState<{ requestsSent: FriendRequests[]; requestsReceived: FriendRequests[] }>({ requestsSent: [], requestsReceived: [] });
    //const [loading, setLoading] = useState(true);
    const username = useSelector((state: RootState) => state.auth.name);
    const token = useSelector((state: RootState) => state.auth.token);
  
    // useEffect(() => {
    //   fetchFriendRequests();
    // }, []);
  
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/friend/friend_request_list`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization : `${token}`
          },
          body: JSON.stringify({ username })
        });
        const data = await response.json();
        setFriendRequests(data);
        //setLoading(false);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };
  
    // if (loading) {
    //   return <div>Loading...</div>;
    // }
  
    return (
      <div>
        <h2>Friend Requests</h2>
        <button onClick={fetchFriendRequests}>Fetch Friend Requests</button>
        <h3>Sent Requests:</h3>
        <ul>
          {friendRequests.requestsSent.map((request, index) => (
            <li key={index}>
              <p>Sender: {request.sender}</p>
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
              <p>Receiver: {request.receiver}</p>
              <p>Timestamp: {request.timestamp}</p>
              <p>Response Status: {request.responseStatus}</p>
            </li>
          ))}
        </ul>
      </div>
    );
};

export default ListFriendRequests;