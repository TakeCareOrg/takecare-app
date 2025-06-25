import Toast from "react-native-toast-message";

interface ToastOptions {
    type: "success" | "error" | "info";
    title: string;
    message?: string;
    visibilityTime?: number;
    autoHide?: boolean;
}

const useToast = () => {
    return ({
        type,
        title,
        message,
        visibilityTime = 3000,
        autoHide = true,
    }: ToastOptions) => {
        Toast.show({
            type: type,
            text1: title,
            text2: message,
            visibilityTime: visibilityTime,
            autoHide: autoHide,
        });
    };
};

export default useToast;
