import { useState } from "react";
import { BACKEND_URL, FAILURE_PREFIX} from "../../constants/string";
import { useRouter } from "next/router";
import { setName, setToken } from "../../redux/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

function ListFriendRequests() {
    const [username, setUsername] = useState("");
    const [requestsSent, setRequestsSent] = useState([]);
    const [requestsReceived, setRequestsReceived] = useState([]);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/friend/list_friend_request`, {
                    method: "POST",
                    body: JSON.stringify({ username: username })
                });
                const data = await response.json();
                setRequestsSent(data.requests_sent);
                setRequestsReceived(data.requests_received);
            } catch (error) {
                alert(FAILURE_PREFIX + error);
            }
        };

        fetchFriendRequests();
    }, [username]);

    return (
        <div>
            <h2>List Friend Requests</h2>
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <h3>Sent Requests:</h3>
            <ul>
                {requestsSent.map(request => (
                    <li key={request.id}>
                        Sender: {request.sender}<br />
                        Receiver: {request.receiver}<br />
                        Timestamp: {request.timestamp}
                    </li>
                ))}
            </ul>
            <h3>Received Requests:</h3>
            <ul>
                {requestsReceived.map(request => (
                    <li key={request.id}>
                        Sender: {request.sender}<br />
                        Receiver: {request.receiver}<br />
                        Timestamp: {request.timestamp}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListFriendRequests;