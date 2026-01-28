import { useState, useEffect } from 'react';
import {UserContext} from "./context/UserContext.js";
// שים לב: הנתיב כאן מניח ששני הקבצים נמצאים באותה תיקייה (src/context)

// --- פונקציית עזר (מחוץ לקומפוננטה) ---
// תפקידה: לקבל אובייקט יוזר ולוודא שיש לו תמונה תקינה
const normalizeUser = (userData) => {
    if (!userData) return null;

    // יוצרים עותק כדי לא לשנות את המקור ישירות
    const updatedUser = { ...userData };

    // הלוגיקה: אם אין URL או שהוא ריק, מייצרים רובוט לפי האות הראשונה של השם משתמש
    if (!updatedUser.pictureUrl || updatedUser.pictureUrl.trim() === "") {
        const firstChar = updatedUser.username ? updatedUser.username : "U";
        updatedUser.pictureUrl = `https://robohash.org/${firstChar}`;
    }

    return updatedUser;
};

export const UserProvider = ({ children }) => {

    // 1. אתחול ה-State (רץ פעם אחת בעלייה)
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        try {
            const parsed = savedUser ? JSON.parse(savedUser) : null;
            // מפעילים את הנרמול מיד בטעינה מהזיכרון
            return normalizeUser(parsed) || {
                firstName: "",
                lastName: "",
                username: "",
                id: 0,
                description: "",
                pictureUrl: "",
                city: "",
                country: ""
            };
        } catch (e) {
            // במקרה של שגיאה ב-JSON, מחזירים יוזר ריק
            return {
                firstName: "",
                lastName: "",
                username: "",
                id: 0,
                description: "",
                pictureUrl: "",
                city: "",
                country: ""
            };
        }
    });

    // 2. פונקציית עדכון חכמה (מחליפה את ה-setUser הרגיל)
    const setUser = (userData) => {
        // בודקים אם קיבלנו פונקציה (למשל: prev => ...) או אובייקט רגיל
        if (typeof userData === 'function') {
            setCurrentUser(prev => {
                const newData = userData(prev);
                return normalizeUser(newData);
            });
        } else {
            setCurrentUser(normalizeUser(userData));
        }
    };

    // 3. אפקט ששומר ל-LocalStorage בכל שינוי
    useEffect(() => {
        if (currentUser && currentUser.username && currentUser.username !== "") {
            localStorage.setItem("user", JSON.stringify(currentUser));
        }
    }, [currentUser]);

    return (
        <UserContext.Provider value={{ user: currentUser, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;