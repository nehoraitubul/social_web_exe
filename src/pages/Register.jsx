import Button from '../components/ui/Button';
import styles from './Register.module.css';
import { Link } from 'react-router-dom';
import { useState } from "react";
import axios from "axios";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [passwordVisibility, setPasswordVisibility] = useState("visibility_off")
    const [passwordInputType, setPasswordInputType] = useState("password")
    const [repeatPasswordVisibility, setRepeatPasswordVisibility] = useState("visibility_off")
    const [repeatPasswordInputType, setRepeatPasswordInputType] = useState("password")

    const enableRegister =
        username.trim().length === 0 ||
        firstName.trim().length === 0 ||
        lastName.trim().length === 0 ||
        password.trim().length === 0 ||
        password !== confirmPassword;

    const registerRequest = () => {
        axios.get("http://localhost:8080/add-user", {
            params: {
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: password
            }
        })
            .then((res) => {
                if (res.data.success) {
                    alert("יופי")
                } else {
                    alert("סוקה")
                }
            })
            .catch((err) => {
                console.error(err);
                alert("שגיאת תקשורת");
            });
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
    const handleRepeatPasswordVisibilityClick = () => {
        if (repeatPasswordVisibility === "visibility_off"){
            setRepeatPasswordVisibility("visibility")
        } else {
            setRepeatPasswordVisibility("visibility_off")
        }

        if (repeatPasswordInputType === "password"){
            setRepeatPasswordInputType("text")
        } else {
            setRepeatPasswordInputType("password")
        }
    }

    return (
        <div className={styles.pageWrapper}>

            <div className={styles.ambientBg}>
                <div className={styles.blob1}></div>
                <div className={styles.blob2}></div>
            </div>

            <div className={styles.container}>

                {/* === צד שמאל (רק דסקטופ) === */}
                <div className={styles.leftSide}>
                    <div>
                        <h1 className={styles.title}>
                            Join the <br />
                            <span className={styles.gradientText}>Community</span>
                        </h1>
                        <p className={styles.subtitle}>
                            Connect, share, and discover. Start your journey with us today.
                        </p>
                    </div>

                    <div className={styles.socialProof}>
                        <div className={styles.avatars}>
                            <img src="https://i.pravatar.cc/100?img=1" className={styles.avatar} alt="User" />
                            <img src="https://i.pravatar.cc/100?img=2" className={styles.avatar} alt="User" />
                            <img src="https://i.pravatar.cc/100?img=3" className={styles.avatar} alt="User" />
                            <div className={styles.avatar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>+2k</div>
                        </div>
                        <div className={styles.subtitle} style={{ fontSize: '14px' }}>Joined recently</div>
                    </div>

                    <div className={styles.infoCard}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>verified_user</span>
                            <h3 style={{ fontWeight: 'bold', color: 'white' }}>Secure & Private</h3>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                            Your data is encrypted and safe with us. We prioritize your privacy.
                        </p>
                    </div>
                </div>

                {/* === צד ימין - הטופס === */}
                <div className={styles.rightSide}>
                    <div className={styles.formCard}>
                        <div className={styles.topAccent}></div>

                        <div className={styles.formContent}>
                            <div className={styles.formHeader}>
                                <h2 className={styles.formTitle}>Get Started</h2>
                                <p className={styles.formSubtitle}>It's free and takes less than a minute.</p>
                            </div>

                            <form onSubmit={(e) => e.preventDefault()}>

                                {/* First Name */}
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>First Name</label>
                                    <div className={styles.inputWrapper}>
                                        <input type="text"
                                               placeholder="Enter first name"
                                               className={styles.input}
                                               value={firstName}
                                               onChange={(e) => setFirstName(e.target.value)} />

                                        <span className={`material-symbols-outlined ${styles.inputIcon}`}>id_card</span>
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>First Name</label>
                                    <div className={styles.inputWrapper}>
                                        <input type="text"
                                               placeholder="Enter last name"
                                               className={styles.input}
                                               value={lastName}
                                               onChange={(e) => setLastName(e.target.value)} />

                                        <span className={`material-symbols-outlined ${styles.inputIcon}`}>badge</span>
                                    </div>
                                </div>

                                {/* Username */}
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Username</label>
                                    <div className={styles.inputWrapper}>
                                        <input type="text"
                                               placeholder="Pick a unique username"
                                               className={styles.input}
                                               value={username}
                                               onChange={(e) => setUsername(e.target.value)} />

                                        <span className={`material-symbols-outlined ${styles.inputIcon}`}>person</span>
                                    </div>
                                </div>

                                {/* Password */}
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Password</label>
                                    <div className={styles.inputWrapper}>
                                        <input type={passwordInputType}
                                               placeholder="Create a password"
                                               className={styles.input}
                                               value={password}
                                               onChange={(e) => setPassword(e.target.value)} />

                                        <button type="button"
                                                className={styles.eyeBtn}
                                                onClick={handlePasswordVisibilityClick}>
                                            <span className="material-symbols-outlined">{passwordVisibility}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Verify Password */}
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Password</label>
                                    <div className={styles.inputWrapper}>
                                        <input type={repeatPasswordInputType}
                                               placeholder="Reapet your password"
                                               className={styles.input}
                                               value={confirmPassword}
                                               onChange={(e) => setConfirmPassword(e.target.value)} />

                                        <button type="button"
                                                className={styles.eyeBtn}
                                                onClick={handleRepeatPasswordVisibilityClick}>
                                            <span className="material-symbols-outlined">{repeatPasswordVisibility}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* כפתור Submit */}
                                <div style={{ marginTop: '24px' }}>
                                    <Button variant="primary"
                                            style={{ width: '100%' }}
                                            disabled={enableRegister}
                                            onClick={registerRequest}>

                                        Create Account
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                                    </Button>
                                </div>

                            </form>
                        </div>

                        {/* חלק תחתון - כבר יש לך חשבון? */}
                        <div className={styles.formFooter}>
                            Already have an account? <Link to="/login" className={styles.link}>Log In</Link>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;