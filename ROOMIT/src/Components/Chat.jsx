import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './css/Chat.css';

const Chat = () => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [otherUser, ] = useState(null);
    const messagesEndRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const myId = currentUser?.userId;


    const fetchMessages = async () => {
        try {
            const res = await axios.get(`/api/chat/room/${roomId}/messages`);
            setMessages(res.data || []);
        } catch (err) {
            console.error('채팅 메시지 불러오기 실패:', err);
        }
    };


    useEffect(() => {
        fetchMessages(); // 초기 1회 호출

        const interval = setInterval(() => {
            fetchMessages();
        }, 3000); // 3초마다 메시지 새로고침

        return () => clearInterval(interval); // 언마운트 시 정리
    }, [roomId]);


    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async () => {
        if (input.trim() === '') return;

        try {
            await axios.post(`/api/chat/room/${roomId}/message`,
                { content: input },
                { params: { userId: myId } }
            );
            setInput('');
            await fetchMessages();
        } catch (err) {
            console.error('메시지 전송 실패:', err.response?.data || err);
        }
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
                        src={otherUser?.avatar || '/vite.svg'}
                        alt={`${otherUser?.name}의 아바타`}
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            marginRight: '8px',
                            marginTop: '4px'
                        }}
                    />
                    {otherUser?.name || `채팅방 ${roomId}`}
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
                            <small>{formatTime(msg.sentAt)}</small>
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
