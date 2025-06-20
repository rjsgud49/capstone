import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './css/Chat.css';

const Chat = ({ userData = [] }) => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    // 샘플 사용자 정보

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const myId = currentUser?.id;

    const getOtherUserId = (roomId) => {
        const [id1, id2] = roomId.split('-').map(Number);
        const otherUserId = id1 === myId ? id2 : id1;
        return otherUserId;
    };
    const otherUserId = parseInt(getOtherUserId(roomId));

    // 상대방 정보 찾기
    const otherUserInfo = userData.find(user => user.id === otherUserId) || {
        name: `채팅방 ${roomId}`,
        avatar: '👤'
    };
    useEffect(() => {
        // 로컬 스토리지에서 메시지 불러오기
        const saved = localStorage.getItem(`chat_${roomId}`);
        const parsedMessages = saved ? JSON.parse(saved) : [];
        setMessages(parsedMessages);
    }, [roomId]);


    // 메시지가 추가될 때마다 스크롤 맨 아래로 이동
    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    // Chat.jsx 안 useEffect 추가
    useEffect(() => {
        const now = new Date().toISOString();
        localStorage.setItem(`read_${roomId}_${myId}`, now);
    }, [roomId, myId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = () => {
        if (input.trim() === '') return;

        const newMessage = {
            senderId: myId,
            content: input,
            timestamp: new Date().toISOString(),
        };


        const updated = [...messages, newMessage];
        setMessages(updated);
        localStorage.setItem(`chat_${roomId}`, JSON.stringify(updated));
        setInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-room">
            <div className="chat-header" style={{ alignItems: 'flex-start' }}>

                <h3 className="other-user-name">
                    <img
                        src={otherUserInfo.avatar}
                        alt={`${otherUserInfo.name}의 아바타`}
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            marginRight: '8px',
                            marginTop: '4px'
                        }}

                    />
                    {otherUserInfo.name}
                </h3>

                <div className="chat-actions">
                    <button aria-label="정보">ℹ️</button>
                </div>
            </div>

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <span>💬</span>
                        <p>대화를 시작해보세요!</p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`chat-message ${msg.senderId === myId ? 'right' : 'left'}`}
                        >
                            <div className="bubble">{msg.content}</div>
                            <small>{formatTime(msg.timestamp)}</small>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
                <div className="chat-input">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="메시지를 입력하세요"
                    />
                    <button onClick={sendMessage} aria-label="전송">
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;