import styles from './FollowModal.module.css';
import UserFollowModal from "../ui/UserFollowModal.jsx";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL, GET_FOLLOWERS_USERS, GET_FOLLOWING_USERS} from "../../config/config.js";
import {UserContext} from "../../context/UserContext.js";

const FollowModal = ({ onClose, isFollowingModal, targetUserId, onSuccess, isFollowModalOwnProfile, isLoggedUserProfile }) => {
    const { user, setUser } = useContext(UserContext)

    const [users, setUsers] = useState([])
    const [search, setSearch] = useState("")

    const reqUrl = isFollowingModal ? GET_FOLLOWING_USERS : GET_FOLLOWERS_USERS;


    useEffect(() => {
        const requestHeaders = {};
        if (BASE_URL.includes("ngrok")) {
            requestHeaders["ngrok-skip-browser-warning"] = "true";
        }
        axios.get(BASE_URL + reqUrl, {
            headers: requestHeaders,
            params: {
                currentUserId: user.id,
                targetUserId: targetUserId
            }
        })
            .then((res) => {
                if (res.data.success){
                    setUsers(res.data.userWithStatus)
                }
            })
            .catch((err)=>{
                console.error(err)
            })
    }, []);

    const filterUsers = users.filter((user) =>{
        if (!user.user) return false

        const lowerCseUsername = user.user.username.toLowerCase()
        const lowerCaseName = `${user.user.firstName} ${user.user.lastName}`.toLowerCase();
        const lowerCaseSearch = search.toLowerCase()
        return lowerCseUsername.includes(lowerCaseSearch) || lowerCaseName.includes(lowerCaseSearch)
    })

    return (
        // ה-Overlay השחור מסביב
        <div className={styles.overlay} onClick={onClose}>

            {/* המודל עצמו - stopPropagation מונע סגירה כשלוחצים בפנים */}
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                {/* כותרת */}
                <div className={styles.header}>
                    <h2 className={styles.title}>{reqUrl === GET_FOLLOWING_USERS ? "Following" : "Followers"}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* חיפוש */}
                <div className={styles.searchSection}>
                    <div className={styles.searchWrapper}>
                        <span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '20px' }}>search</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={`Search ${reqUrl === GET_FOLLOWING_USERS ? "following" : "followers"}...`}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                {/* רשימת המשתמשים */}
                <div className={styles.listContainer}>

                    {
                        filterUsers.map((user) => {
                            return(
                                <UserFollowModal
                                    firstName ={user.user.firstName}
                                    lastName = {user.user.lastName}
                                    image = {user.user.pictureUrl ? user.user.pictureUrl : "https://robohash.org/" + user.user.username}
                                    username = {user.user.username}
                                    isFollow = {user.isFollowing}
                                    onClose = {onClose}
                                    isFollowModalOwnProfile = {isFollowModalOwnProfile}
                                    isLoggedUserProfile = {isLoggedUserProfile}
                                    isFollowingModal = {isFollowingModal}
                                    onSuccess = {onSuccess}
                                    id = {user.user.id}
                                    key = {user.id}/>
                            )
                        })
                    }

                </div>

                {/* פוטר קטן */}
                <div className={styles.footer}>
                    Scroll for more
                </div>

            </div>
        </div>
    );
};

export default FollowModal;