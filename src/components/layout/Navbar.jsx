import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import styles from './Navbar.module.css';

const Navbar = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>

                {/* צד שמאל: לוגו */}
                <Link to="/" className={styles.logoLink}>
                    {/* הריבוע הצבעוני הקטן */}
                    <div className={styles.logoIcon}>S</div>
                    <span className={styles.logoText}>SocialApp</span>
                </Link>

                {/* צד ימין: כפתורים */}
                <div className={styles.actions}>

                    {/* כפתור התחברות - משני */}
                    <Link to="/login" className={styles.linkWrapper}>
                        <Button variant="secondary">
                            Log In
                        </Button>
                    </Link>

                    {/* כפתור הרשמה - ראשי */}
                    <Link to="/register" className={styles.linkWrapper}>
                        <Button variant="primary">
                            Join Now
                        </Button>
                    </Link>

                </div>

            </div>
        </header>
    );
};

export default Navbar;