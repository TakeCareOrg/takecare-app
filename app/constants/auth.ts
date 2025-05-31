export const passwordRegex =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}#[\]:;<>,.?/~_+\-=|\\]).{8,32}$/ as RegExp;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ as RegExp;
