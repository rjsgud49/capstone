import React from 'react';
import { useLocation } from 'react-router-dom';
import '../Pages/css/ChatRoom.css';
import Chat from '../Components/Chat';
import RoomList from '../Components/RoomList.jsx';

const ChatRoom = ({ userData }) => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const hasRoomId = pathSegments.length > 2 && pathSegments[2]; // /chat/:roomId

    return (
        <div>
            <div className="chatcontainer">
                <div className="room-list">
                    <RoomList />
                </div>
                <div className="chat-room-container">
                    {hasRoomId ? (
                        <Chat userData={userData} />
                    ) : (
                        <div className="empty-chat">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.76 9.76 0 01-4-.84l-4 1 1-3.7A7.999 7.999 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p>채팅방을 선택해주세요!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
