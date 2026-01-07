import { createContext, useState , useEffect } from 'react';

export const UserContext = createContext(null);

// הרכיב שעוטף (הספק)
export const UserProvider = ({ children }) => {
    // כאן נשמר המידע של היוזר!
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : {
            firstName: "",
            lastName: "",
            username: "",
            id: 0,
            description: "",
            imageUrl: "",
            city: "",
            country: ""
        };
    });

    // שלב 2: שמירה אוטומטית
    // בכל פעם שהמשתנה user משתנה (למשל אחרי לוגין או עריכת פרופיל),
    // אנחנו שומרים אותו גם ב-LocalStorage
    useEffect(() => {
        // שומרים רק אם יש שם משתמש (כדי לא לדרוס עם אובייקט ריק סתם)
        if (user && user.username !== "") {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};