import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/RoomList.css';

const RoomList = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (storedUser && storedUser.userId) {
            setUserId(storedUser.userId);
        } else {
            console.warn('유저 ID를 찾을 수 없습니다.');
        }
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchRooms = async () => {
            try {
                const res = await axios.get(`/api/chat/rooms?userId=${encodeURIComponent(userId)}`);

                // ✅ 1단계: 중복 방 제거 (room.id 기준)
                const uniqueRoomsMap = new Map();
                res.data.forEach(room => {
                    uniqueRoomsMap.set(room.id, room);
                });
                const uniqueRooms = Array.from(uniqueRoomsMap.values());

                // ✅ 2단계: 상대방 찾기 + 가공
                const processedRooms = uniqueRooms.map(room => {
                    // members 중 나 아닌 상대방 찾기
                    const otherMember = room.members.find(member => member.user.userId !== userId);
                    if (!otherMember) return null; // 상대방 없으면 제외

                    const otherUser = otherMember.user;
                    const lastMessageObj = room.messages[room.messages.length - 1];
                    const lastMessage = lastMessageObj ? lastMessageObj.content : '메시지가 없습니다.';
                    const lastTimestamp = lastMessageObj ? lastMessageObj.sentAt : room.createdAt;

                    return {
                        id: room.id,
                        otherUser,
                        lastMessage,
                        lastTimestamp
                    };
                }).filter(room => room !== null); // ✅ null 방 제거

                setChatRooms(processedRooms);

            } catch (err) {
                console.error('채팅방 목록 불러오기 실패:', err);
            }
        };

        fetchRooms();
    }, [userId]);

    const formatReadTime = (timestamp) => {
        if (!timestamp) return '';
        const now = new Date();
        const readDate = new Date(timestamp);
        const diff = now - readDate;
        const diffMinutes = Math.floor(diff / 60000);
        const diffHours = Math.floor(diff / 3600000);
        const diffDays = Math.floor(diff / 86400000);

        if (diffMinutes < 1) return "방금";
        if (diffMinutes < 60) return `${diffMinutes}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        if (diffDays === 1) return "어제";
        if (diffDays < 7) return `${diffDays}일 전`;
        return "오래전";
    };

    return (
        <div className="room-list">
            {chatRooms.length === 0 ? (
                <p className="no-rooms">채팅방이 없습니다.</p>
            ) : (
                chatRooms.map((room) => (
                    <Link to={`/chat/${room.id}`} key={room.id} className="room-item">
                        <div className="room-avatar">
                            {/* <img
                                src={'/vite.svg'}
                                alt={`${room.otherUser?.userId} avatar`}
                                className="room-avatar-image"
                            /> */}
                        </div>
                        <div className="room-content">
                            <div className="room-header">
                                <div className="room-name-container">
                                    <h3 className="room-name">
                                        {room.otherUser?.userId.substring(0, 7)}
                                    </h3>
                                </div>
                                <span className="room-time">{formatReadTime(room.lastTimestamp)}</span>
                            </div>
                            <p className="room-last-message">{room.lastMessage}</p>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
};

export default RoomList;
