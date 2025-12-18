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

interface ToastPromiseOptions {
    loading: string;
    success: string;
    error: string;
}

export const useToastPromise = () => {
    return <T>(
        promise: Promise<T>,
        messages: ToastPromiseOptions,
    ): Promise<T> => {
        // Show loading toast
        Toast.show({
            type: "info",
            text1: messages.loading,
            autoHide: false,
        });

        return new Promise((resolve, reject) => {
            promise
                .then((result) => {
                    resolve(result);
                    Toast.hide();
                    Toast.show({
                        type: "success",
                        text1: messages.success,
                        visibilityTime: 3000,
                        autoHide: true,
                    });
                })
                .catch((error) => {
                    reject(error);
                    Toast.hide();
                    Toast.show({
                        type: "error",
                        text1: messages.error,
                        visibilityTime: 3000,
                        autoHide: true,
                    });
                });
        });
    };
};

export default useToast;
