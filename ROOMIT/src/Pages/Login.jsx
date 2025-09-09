    import React, { useState, useEffect } from 'react';
    import { useLocation, useNavigate } from "react-router-dom";
    import { User, Lock, Mail } from 'lucide-react';
    import { loginUser as loginAPI, registerUser } from '../services/auth';
    import './css/Login.css';
    import { fetchProfile } from '../services/user';  // 추가

    const Login = ({ setCurrentUser }) => {
        const location = useLocation();
        const navigate = useNavigate();

        const [isActive, setIsActive] = useState(location.state?.register ?? false);
        const [loginUsername, setLoginUsername] = useState('');
        const [loginPassword, setLoginPassword] = useState('');
        const [registerData, setRegisterData] = useState({
            username: '',
            email: '',
            password: ''
        });

        useEffect(() => {
            setIsActive(location.state?.register ?? false);
        }, [location.state]);

        const handleRegisterClick = () => setIsActive(true);
        const handleLoginClick = () => setIsActive(false);

        const handleRegister = async (e) => {
            e.preventDefault();

            try {
                const { username, email, password } = registerData;

                const result = await registerUser({ userId: username, email, password });

                console.log('회원가입 성공:', result);
                alert('회원가입 성공! 로그인 해주세요.');
                navigate('/login', { state: { register: false } });
            } catch (error) {
                const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다. 서버 오류가 발생했습니다.';
                alert(errorMessage);
                console.error('회원가입 오류:', error);
            }
        };

        const handleLogin = async (e) => {
            e.preventDefault();

            try {
                const response = await loginAPI({
                    userId: loginUsername,
                    password: loginPassword
                });

                // console.log("✅ loginAPI 응답 확인:", response);

                const { token, userId } = response;

                const profile = await fetchProfile(userId);

                // console.log("✅ fetchProfile 응답:", profile);

                // ✅ 수정 → profile 자체 저장
                localStorage.setItem('accessToken', token);
                localStorage.setItem('currentUser', JSON.stringify(profile));

                setCurrentUser(profile);

                alert('로그인 성공!');
                navigate('/');
            } catch  {
                const errorMessage =  '❌ 로그인에 실패했습니다. 아이디나 비밀번호를 확인해주세요.';
                alert(errorMessage);
                // console.error('로그인 에러:', error);
            }
        };




        const handleRegisterChange = (e) => {
            const { name, value } = e.target;
            setRegisterData(prev => ({ ...prev, [name]: value }));
        };

        return (
            <div className="container_main">
                <div className={`login_container ${isActive ? 'active' : ''}`}>
                    {/* 로그인 폼 */}
                    <div className="form-box login">
                        <form onSubmit={handleLogin}>
                            <h1>로그인</h1>
                            <div className="input-box">
                                <input
                                    type="text"
                                    placeholder="사용자 이름"
                                    value={loginUsername}
                                    onChange={(e) => setLoginUsername(e.target.value)}
                                    required
                                />
                                <User className="icon" />
                            </div>
                            <div className="input-box">
                                <input
                                    type="password"
                                    placeholder="비밀번호"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                />
                                <Lock className="icon" />
                            </div>
                            <div className="forgot-link">
                                <a href="#">비밀번호를 잊으셨나요?</a>
                            </div>
                            <button type="submit" className="btn">로그인</button>
                        </form>
                    </div>

                    {/* 회원가입 폼 */}
                    <div className="form-box register">
                        <form onSubmit={handleRegister}>
                            <h1>회원가입</h1>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="사용자 이름"
                                    value={registerData.username}
                                    onChange={handleRegisterChange}
                                    required
                                />
                                <User className="icon" />
                            </div>
                            <div className="input-box">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="이메일"
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    required
                                />
                                <Mail className="icon" />
                            </div>
                            <div className="input-box">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="비밀번호"
                                    value={registerData.password}
                                    onChange={handleRegisterChange}
                                    required
                                />
                                <Lock className="icon" />
                            </div>
                            <button type="submit" className="btn">가입하기</button>
                        </form>
                    </div>

                    <div className="toggle-box">
                        <div className="toggle-panel toggle-left">
                            <h1>안녕하세요!</h1>
                            <p>아직 계정이 없으신가요?</p>
                            <button className="btn register-btn" onClick={handleRegisterClick}>
                                회원가입
                            </button>
                        </div>

                        <div className="toggle-panel toggle-right">
                            <h1>다시 오신 걸 환영해요!</h1>
                            <p>이미 계정이 있으신가요?</p>
                            <button className="btn login-btn" onClick={handleLoginClick}>
                                로그인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    export default Login;
