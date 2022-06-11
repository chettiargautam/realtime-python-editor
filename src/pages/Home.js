import {React, useState} from "react";
import {v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setRoomId(id);
        toast.success("Created a new room!");
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('Room ID & Username is required');
            return;
        }

        // Redirect
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <p className="typewriter">
                    Shareable Python Code Compiler
                </p>
                <h4 className="mainLabel">
                    Paste invitation Room ID
                </h4>
                <div className="inputGroup">
                    <input 
                        type="text" 
                        className="inputBox" 
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Room ID"
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
                    <input 
                        type="text" 
                        className="inputBox" 
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <button className="btn joinBtn" onClick={joinRoom}>Join</button>
                    <span className="createInfo">
                        If you don't have an invite then create a&nbsp;
                        <a onClick={createNewRoom} href="" className="createNewBtn">new room</a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>Built with ❤️ by <a href="https://www.linkedin.com/in/gautam-chettiar-a0bb861b3/">Gautam</a>
                </h4>
            </footer>
        </div>
    );
};

export default Home