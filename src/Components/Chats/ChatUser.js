import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBTypography,
    MDBCardHeader,
    MDBIcon,
    MDBTextArea,
    MDBBtn
} from "mdb-react-ui-kit";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, fetchMessages } from "../../Store/messages";
import io from "socket.io-client";
import moment from 'moment'
import { Link, useParams } from "react-router";


function ChatUser() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const access_token = localStorage.getItem("access_token");
    const state = useSelector((state) => state.messages);
    const [messagesUser, setMessagesUser] = useState([]);
    const [input, setInput] = useState("");
    const socketRef = useRef(null);
    const stateUsers = useSelector((state) => state.Users.users);
    const userData = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io('https://chat-server-0vlq.onrender.com', { query: { token: access_token } });

            socketRef.current.on("receive_message", (message) => {
                if (message.senderId === id || message.receiverId === id) {
                    dispatch(addMessage(message));
                }
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [dispatch, access_token, id]);

    useEffect(() => {
        dispatch(fetchMessages(access_token));
    }, [dispatch, access_token, id]);


    useEffect(() => {
        if (state.messages && id) {
            const messageUsers = state.messages.filter(
                (message) => message.senderId === id || message.receiverId === id
            );
            setMessagesUser(messageUsers);
        }
    }, [state.messages, id]);
    const sendMessage = () => {
        if (input.trim() !== "") {
            socketRef.current.emit("send_message", { receiverId: id, content: input });
            setInput("");
        }
    };
    return (
        <>
            <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
                <MDBRow>
                    <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0 members_users" style={{ maxHeight: "100vh", overflowY: "scroll" }}>
                        <h5 className="font-weight-bold mb-3 text-center text-lg-start">
                            Member
                        </h5>
                        <MDBCard>
                            <MDBCardBody>
                                <MDBTypography listUnStyled className="mb-0">
                                    {stateUsers?.map((user) => {
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
                    <MDBCol md="6" lg="7" xl="8" className="messages__class" style={{ maxHeight: "100vh", overflowY: "scroll" }}>
                        <MDBTypography listUnStyled>
                            {messagesUser.map((message) => {
                                return <li className={`d-flex mb-4 ${message.senderId === userData._id ? "justify-content-end" : "justify-content-start"}`}>
                                    <MDBCard>
                                        <MDBCardHeader className="d-flex justify-content-between p-3">
                                            <p className="text-muted small mb-0">
                                                <MDBIcon far icon="clock" /> {moment(message.createdAt)?.format("hh:mm A")}
                                            </p>
                                        </MDBCardHeader>
                                        <MDBCardBody>
                                            <p className="mb-0">
                                                {message.content}
                                            </p>
                                        </MDBCardBody>
                                    </MDBCard>
                                </li>
                            })}
                            <li className="bg-white mb-3">
                                <MDBTextArea label="Message" value={input} id="textAreaExample" rows={4} onChange={(e) => setInput(e.target.value)} />
                            </li>
                            <MDBBtn color="info" rounded className="float-end" onClick={sendMessage}>
                                Send
                            </MDBBtn>
                        </MDBTypography>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

        </>
    )
}

export default ChatUser
