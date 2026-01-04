import styles from './Button.module.css';

// שים לב לשינוי: מחקתי את onClick והוספתי את ...props בסוף
const Button = ({ children, variant = 'primary', className = '', ...props }) => {

    return (
        <button
            // שומרים על הקלאסים שלנו
            className={`${styles.btn} ${styles[variant]} ${className}`}

            {...props}
        >
            {children}
        </button>
    );
};

export default Button;