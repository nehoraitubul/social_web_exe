import styles from './Comment.module.css';
import { formatTimeAgo } from '../../utils/timeUtils.js';

const Comment = ({ data }) => {

    const timeAgo = formatTimeAgo(data.createdAt);

    const profileImage = data.authorProfileImage ? data.authorProfileImage : `https://robohash.org/${data.authorUsername}?set=set4`;

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
                    <p className={styles.commentUser}>{data.authorFirstName + " " + data.authorLastName}</p>
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