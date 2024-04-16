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
  }

function ListFriendRequests() {
    const [friendRequests, setFriendRequests] = useState<{ requests_sent: FriendRequests[]; requests_received: FriendRequests[] }>({ requests_sent: [], requests_received: [] });
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetchFriendRequests();
    }, []);
  
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch('/api/list_friend_request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: 'your_username_here' }) // Replace 'your_username_here' with actual username
        });
        const data = await response.json();
        setFriendRequests(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h2>Friend Requests</h2>
        <h3>Sent Requests:</h3>
        <ul>
          {friendRequests.requests_sent.map((request, index) => (
            <li key={index}>
              <p>Sender: {request.sender}</p>
              <p>Receiver: {request.receiver}</p>
              <p>Timestamp: {request.timestamp}</p>
            </li>
          ))}
        </ul>
        <h3>Received Requests:</h3>
        <ul>
          {friendRequests.requests_received.map((request, index) => (
            <li key={index}>
              <p>Sender: {request.sender}</p>
              <p>Receiver: {request.receiver}</p>
              <p>Timestamp: {request.timestamp}</p>
            </li>
          ))}
        </ul>
      </div>
    );
};

export default ListFriendRequests;