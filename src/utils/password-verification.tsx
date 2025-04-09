import { useEffect, useState } from "react";

interface PasswordVerificationProps {
    password: string;
    confirmPassword?: string;
}

export const PasswordVerification = ({
    password,
    confirmPassword,
}: PasswordVerificationProps) => {
    const [hasCapitalLetter, setHasCapitalLetter] = useState<boolean>(false);
    const [hasNumber, setHasNumber] = useState<boolean>(false);
    const [hasSpecialCharacter, setHasSpecialCharacter] =
        useState<boolean>(false);
    const [hasLength, setHasLength] = useState<boolean>(false);
    const [passwordMatch, setPasswordMatch] = useState<boolean>(false);

    useEffect(() => {
        const hasCapital = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialCharacter =
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
        const hasLength = password.length >= 8;
        const passwordMatch = password === confirmPassword;

        setHasCapitalLetter(hasCapital);
        setHasNumber(hasNumber);
        setHasSpecialCharacter(hasSpecialCharacter);
        setHasLength(hasLength);
        setPasswordMatch(passwordMatch);

        if (
            !hasCapital ||
            !hasNumber ||
            !hasSpecialCharacter ||
            !hasLength ||
            !passwordMatch
        ) {
            return;
        }
    }, [password, confirmPassword]);

    return {
        hasCapitalLetter,
        hasNumber,
        hasSpecialCharacter,
        hasLength,
        passwordMatch,
    };
};
