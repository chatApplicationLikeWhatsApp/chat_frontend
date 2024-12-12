import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBTypography,
} from "mdb-react-ui-kit";
import { useEffect,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../Store/user";
import { addMessage, fetchMessages, setSocket } from "../Store/messages";
import { Link } from "react-router";
import io from "socket.io-client";

export default function Chat() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.Users);
  const access_token = localStorage.getItem("access_token");
  const socketRef = useRef(null); // Maintain one socket connection
  
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io('https://chat-server-0vlq.onrender.com', { query: { token: access_token } });

      socketRef.current.on("connect", () => {
        console.log(`Connected to the server with the id : ${socketRef.current.id}`);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from the server");
        dispatch(setSocket(null));
      });

      socketRef.current.on("receive_message", (message) => {
        console.log("Received message:", message);
        dispatch(addMessage(message)); // Dispatch the new message to Redux
      });
    }

    dispatch(fetchUsers(access_token));
    dispatch(fetchMessages(access_token));

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [dispatch, access_token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
      <MDBRow>
        <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
          <h5 className="font-weight-bold mb-3 text-center text-lg-start">
            Member
          </h5>

          <MDBCard>
            <MDBCardBody>
              <MDBTypography listUnStyled className="mb-0">
                {users?.map((user) => {
                  return <li
                    className="p-2 border-bottom"

                  >
                    <Link className="d-flex justify-content-between" to={`/chat/${user?._id}`}>
                      <div className="d-flex flex-row">
                        <img
                          src={user.profilePicture}
                          alt="avatar"
                          className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                          width="60"
                        />
                        <div className="pt-1">
                          <p className="fw-bold mb-0">{user.firstName}  {user.lastName}</p>
                          <p className="small text-muted">
                            Hello, Are you there?
                          </p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <p className="small text-muted mb-1">Just now</p>
                        <span className="badge bg-danger float-end">1</span>
                      </div>
                    </Link>
                  </li>
                })}


              </MDBTypography>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

      </MDBRow>
    </MDBContainer>
  );
}