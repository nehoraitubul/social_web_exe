import styles from './Comment.module.css';
import { formatTimeAgo } from '../../utils/timeUtils.js';
import {useNavigate} from "react-router-dom";

const Comment = ({ data , onClose}) => {
    const navigate = useNavigate()

    const timeAgo = formatTimeAgo(data.createdAt);

    const profileImage = data.authorProfileImage ? data.authorProfileImage : `https://robohash.org/${data.authorUsername}?set=set4`;

    const handleProfileClick = (e) => {
        e.stopPropagation();
        onClose()
        navigate(`/profile/${data.authorUsername}`);
    };


    return (
        <div className={styles.commentRow}>

            {/* תמונת פרופיל */}
            <img
                src={profileImage}
                alt={data.authorUsername}
                className={styles.commentAvatar}
            />

            <div className={styles.commentContent}>

                {/* הבועה עם השם והתוכן */}
                <div className={styles.commentBubble}>
                    <p
                        className={`${styles.commentUser} ${styles.clickable}`}
                        onClick={handleProfileClick}
                    >
                        {data.authorFirstName + " " + data.authorLastName}
                    </p>
                    <p className={styles.commentText}>{data.content}</p>
                </div>

                {/* שורת הפעולות למטה (זמן, לייק, הגב) */}
                <div className={styles.commentMeta}>
                    <span className={styles.metaItem}>{timeAgo}</span>
                </div>
            </div>
        </div>
    );
};

export default Comment;