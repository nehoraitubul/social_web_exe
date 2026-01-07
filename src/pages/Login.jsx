import {Link, useNavigate} from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './Login.module.css';
import {useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL, LOGIN_ENDPOINT, PROFILE_ENDPOINT} from "../config/config.js";

const Login = () => {

    const [username, setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [passwordVisibility, setPasswordVisibility] = useState("visibility_off")
    const [passwordInputType, setPasswordInputType] = useState("password")
    const [errorCode, setErrorCode] = useState(null)
    const [ngrokHeaders, setNgrokHeaders] = useState({})

    const navigate = useNavigate();

    useEffect(() => {
        if (BASE_URL.includes("ngrok")){
            setNgrokHeaders({"ngrok-skip-browser-warning": "true"})
        }
    }, []);

    const loginRequest = () =>{
        axios.get(BASE_URL + LOGIN_ENDPOINT, {
            headers: ngrokHeaders,
            params: {
                username: username,
                password: password
            }
        })
            .then((res) =>{
                if(res.data.success){
                    setTimeout(() => {
                        navigate(`/profile/${username}`);
                    }, 1000);
                }
                else{
                    setErrorCode(res.data.errorCode)
                }
            })
            .catch((err)=>{
                console.error(err)
            })
    }

    const errorCodeMessage = () => {
        if(errorCode === 1002){
            return "Missing username."
        }
        if(errorCode === 1003){
            return "Missing password."
        }
        if(errorCode === 1005){
            return "Invalid username or password."
        }
    }

    const handlePasswordVisibilityClick = () => {
        if (passwordVisibility === "visibility_off"){
            setPasswordVisibility("visibility")
        } else {
            setPasswordVisibility("visibility_off")
        }

        if (passwordInputType === "password"){
            setPasswordInputType("text")
        } else {
            setPasswordInputType("password")
        }
    }


    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                {/* === צד שמאל: תמונה (Hero) === */}
                <div className={styles.leftSide}>
                    <div className={styles.heroImage}></div>
                    <div className={styles.heroOverlay}>
                        <div className={styles.accentLine}></div>
                        <h2 className={styles.heroTitle}>Connect with the future.</h2>
                        <p className={styles.heroText}>
                            Join a community of creators and developers building the next generation.
                        </p>
                    </div>
                </div>

                {/* === צד ימין: טופס === */}
                <div className={styles.rightSide}>

                    <div className={styles.header}>
                        <h1 className={styles.title}>Welcome Back</h1>
                        <p className={styles.subtitle}>Enter your details below to access your feed.</p>
                    </div>

                    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>

                        {/* Username Field */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Username</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    value={username}
                                    type="text"
                                    placeholder="Enter your username"
                                    className={styles.input}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <span className={`material-symbols-outlined ${styles.inputIcon}`}>mail</span>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className={styles.inputGroup}>
                            <div className={styles.labelRow}>
                                <label className={styles.label}>Password</label>
                                <a href="#" className={styles.forgotLink}>Forgot Password?</a>
                            </div>

                            <div className={styles.inputWrapper}>
                                <input
                                    type={passwordInputType}
                                    placeholder="Enter your password"
                                    className={styles.input}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                    }}
                                />
                                <button type="button"
                                        className={styles.eyeBtn}
                                        onClick={handlePasswordVisibilityClick}>
                                    <span className="material-symbols-outlined">{passwordVisibility}</span>
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <div style={{ marginTop: '8px' }}>
                            <Button variant="primary"
                                    style={{ width: '100%', height: '56px' }}
                                    onClick={loginRequest} >
                                Log In
                            </Button>
                        </div>

                        <>
                            {errorCode != null && (
                                <div className={styles.errorAlert}>
                                            <span className="material-symbols-outlined" style={{fontSize: '20px'}}>
                                                error
                                            </span>
                                    {errorCodeMessage()}
                                </div>
                            )}
                        </>

                    </form>

                    {/* Footer */}
                    <div className={styles.footer}>
                        Don't have an account?
                        <Link to="/register" className={styles.link}>Sign up for free</Link>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Login;