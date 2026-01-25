import styles from './EditProfile.module.css';
import {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import {BASE_URL, EDIT_PROFILE_ENDPOINT} from "../config/config.js";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext.js";

const EditProfile = () => {
    const { user, setUser } = useContext(UserContext)

    const [id, setId] = useState(user.id)
    const [firstName, setFirstName] = useState(user.firstName)
    const [lastName, setLastName] = useState(user.lastName)
    const [city, setCity] = useState(user.city)
    const [country, setCountry] = useState(user.country)
    const [imageUrl, setImageUrl] = useState(user.pictureUrl)
    const [description, setDescription] = useState(user.description)
    const [bioLength, setBioLength] = useState(250 - (user.description || "").length);

    const [profileImageFile, setProfileImageFile] = useState(null);
    const fileInputRef = useRef(null);

    const navigate = useNavigate();


    useEffect(() => {
        setId(user.id)
        setFirstName(user.firstName)
        setLastName(user.lastName)
        setCity(user.city)
        setCountry(user.country)
        setImageUrl(user.pictureUrl)
        setDescription(user.description)
    }, [user]);


    const editProfile = () =>{
        const requestHeaders = {
            "Content-Type": "multipart/form-data"
        };

        if (BASE_URL.includes("ngrok")) {
            requestHeaders["ngrok-skip-browser-warning"] = "true";
        }

        const formData = new FormData();
        formData.append("userId", id)
        formData.append("firstName", firstName)
        formData.append("lastName", lastName)
        formData.append("description", description)
        formData.append("city", city)
        formData.append("country", country)
        if (profileImageFile){
            formData.append("file", profileImageFile)
        }

        axios.post(BASE_URL + EDIT_PROFILE_ENDPOINT , formData,
            {
            headers: requestHeaders,
            })
            .then((res) =>{
                if(res.data.success){
                    setUser(prev => ({
                        ...prev,
                        userId: res.data.user.userId,
                        firstName: res.data.user.firstName,
                        lastName: res.data.user.lastName,
                        city: res.data.user.city,
                        country: res.data.user.country,
                        pictureUrl: res.data.user.pictureUrl ? res.data.user.pictureUrl : "https://robohash.org/" + res.data.user.username.charAt(0),
                        description: res.data.user.description
                    }));
                    navigate(`/profile/${user.username}`)
                }
            })
            .catch((err)=>{
                console.error(err)
            })
        }


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImageUrl(previewUrl);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    }


    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>

                {/* כותרת */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Edit Profile</h1>
                    <p className={styles.subtitle}>Update your personal details and public profile information.</p>
                </div>

                {/* הכרטיס הראשי */}
                <div className={styles.card}>

                    {/* באנר עליון */}
                    <div className={styles.banner}></div>

                    <div className={styles.cardContent}>

                        {/* אזור התמונה */}
                        <div className={styles.avatarSection}>

                            {/* 1. הוספנו onClick שעושה טריגר לאינפוט הנסתר */}
                            <div className={styles.avatarWrapper} onClick={handleAvatarClick}>
                                <img
                                    src={imageUrl}
                                    alt="Profile"
                                    className={styles.avatar}
                                />

                                <div className={styles.editOverlay}>
                                    <span className="material-symbols-outlined" style={{fontSize: '32px', color: 'white'}}>photo_camera</span>
                                </div>

                                <div className={styles.pencilBtn}>
                                    <span className="material-symbols-outlined" style={{fontSize: '16px'}}>edit</span>
                                </div>
                            </div>

                            {/* 2. האינפוט הנסתר - זה הטריק! */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                accept="image/*"
                            />

                        </div>

                        {/* טופס */}
                        <form className={styles.formGrid} onSubmit={(e) => e.preventDefault()}>

                            {/* First Name */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>First Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter first name"
                                    className={styles.input}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}/>
                            </div>

                            {/* Last Name */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter last name"
                                    className={styles.input}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}/>
                            </div>

                            {/* City */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>City</label>
                                <input
                                    type="text"
                                    placeholder="Enter city"
                                    value={city}
                                    className={styles.input}
                                    onChange={(e) => setCity(e.target.value)}/>
                            </div>

                            {/* Country */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Country</label>
                                <input
                                    type="text"
                                    placeholder="Enter country"
                                    value={country}
                                    className={styles.input}
                                    onChange={(e) => setCountry(e.target.value)}/>
                            </div>

                            {/* Bio (Full Width) */}
                            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                                    <label className={styles.label}>Bio</label>
                                    <span className={styles.charCount}>{bioLength} characters left</span>
                                </div>
                                <textarea
                                    className={styles.textarea}
                                    value={description}
                                    placeholder="Tell us a little about yourself..."
                                    onChange={(e) =>{
                                        if (e.target.textLength <= 250) {
                                            setDescription(e.target.value)
                                            setBioLength((250 - e.target.textLength))
                                        }
                                    }}
                                ></textarea>
                            </div>

                        </form>

                        <div className={styles.divider}></div>

                        {/* כפתורים */}
                        <div className={styles.actions}>
                            <button className={styles.cancelBtn}
                                    onClick={() =>
                                        navigate(`/profile/${user.username}`)}>Cancel</button>
                            <button className={styles.saveBtn}
                            onClick={editProfile}>
                                <span className="material-symbols-outlined" style={{fontSize: '20px'}}>save</span>
                                Save Changes
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
};

export default EditProfile;