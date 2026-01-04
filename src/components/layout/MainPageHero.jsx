import styles from './Hero.module.css';
import Button from '../ui/Button'; // ה-Import של הכפתור שלנו

const MainPageHero = () => {
    return (
        <section className={styles.hero}>

            {/* צד שמאל: טקסטים וכפתורים */}
            <div className={styles.content}>

                <h1 className={styles.title}>
                    Connect deeply. <br />
                    <span className={styles.highlight}>Share freely.</span>
                </h1>

                <p className={styles.description}>
                    The modern social platform designed for real conversations and vibrant communities.
                    Experience the future of social networking.
                </p>

                <div className={styles.buttons}>
                    <Button variant="primary">
                        Get Started Free
                    </Button>

                    <Button variant="secondary">
                        Watch Demo
                    </Button>
                </div>

            </div>

            {/* צד ימין: תמונה */}
            <div className={styles.imageContainer}>
                <img
                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
                    alt="Social App Dashboard"
                    className={styles.heroImage}
                />
            </div>

        </section>
    );
};

export default MainPageHero;