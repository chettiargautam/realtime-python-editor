import {React, useState, useRef, useEffect} from "react";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";


const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const {roomId} = useParams();

    const reactNavigator = useNavigate();


    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log("socket error", e);
                toast.error("Socket connection failed, try again later,");
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            socketRef.current.on(ACTIONS.JOINED,
                 ({clients, username, socketId}) => {
                     if (username!= location.state?.username){
                         toast.success(`${username} joined the room.`)
                         console.log(`${username} joined the room.`)
                     }
                     setClients(clients);
                     socketRef.current.emit(ACTIONS.SYNC_CODE, {
                         code: codeRef.current,
                         socketId,
                     })
                 })

            socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username}) => {
                toast.success(`${username} left the room.`)
                setClients((prev) => {
                    return prev.filter(
                        (client) => client.socketId != socketId)
                })
            })

        };
        init();
        return () => {
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
            socketRef.current.disconnect();
        }
    }, []);


    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID copied to clipboard!")
        } catch(err){
            toast.error("Couldn't copy Room ID")
            console.log(err)
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }


    const [clients, setClients] = useState([]);

    if (!location.state) {
        return <Navigate to='/' />;
    }

    <Navigate />

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="typewriter">
                        Shareable Code
                    </div>
                    <hr></hr>
                    <h3 className="connected">Connected</h3>
                    <div className="clientsList">
                        {clients.map(client => (
                        <Client
                        key={client.socketId}
                        username={client.username}
                    />))}
                </div>
                </div>
                <button onClick={copyRoomId} className="btn copyBtn" >
                    Copy Room ID
                </button>
                <button onClick={leaveRoom} className="btn leaveBtn" >
                    Leave
                </button>

            </div>
            <div className="editorWrap">
                <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => {codeRef.current = code}}/>
            </div>
        </div>
    )
}

export default EditorPage