import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
} from "react";
import {
    AuthContextData,
    AuthData,
    LoginProps,
    RegisterProps,
    userHealthProps,
    userProps,
    userStateProps,
} from "../types/auth.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import useToast from "../hooks/use-toast";
import { track } from "@amplitude/analytics-react-native";
import { QuizUserResponse } from "../types/quiz.types";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { toast as newToast } from "@backpackapp-io/react-native-toast";
import {
    AppleRequestResponseFullName,
    appleAuth,
} from "@invertase/react-native-apple-authentication";

const passwordRegex =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}#[\]:;<>,.?/~_+\-=|\\]).{8,32}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authData, setAuthData] = useState<AuthData>();
    const [user, setUser] = useState<userStateProps | undefined>(undefined);
    const toast = useToast();

    //The loading part will be explained in the persist step session
    const [loading, setLoading] = useState(true);

    // Add this hook to initialize Google authentication
    const [, , promptAsync] = Google.useAuthRequest({
        iosClientId: process.env.EXPO_PUBLIC_APPLE_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_WEBCLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEBCLIENT_ID,
    });

    useEffect(() => {
        WebBrowser.warmUpAsync();
        return () => {
            WebBrowser.coolDownAsync();
        };
    }, []);

    async function signIn({ email, password }: LoginProps): Promise<void> {
        const data = {
            email,
            password,
        };

        if (!email.match(emailRegex)) {
            toast({
                type: "error",
                title: "Error",
                message:
                    "Invalid email address. Please enter a valid email address.",
            });
            return;
        }

        if (!password.match(passwordRegex)) {
            toast({
                type: "error",
                title: "Error",
                message:
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
            });
            return;
        }

        axios
            .post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/login`, data)
            .then((res) => {
                const _authData: AuthData = {
                    token: res.data.token,
                };

                // Persist the data in the Async Storage
                // to be recovered in the next user session.
                AsyncStorage.setItem(
                    "@AuthData",
                    JSON.stringify(_authData),
                ).then(() => {
                    setAuthData(_authData);

                    getUserData(res.data.token).then(() => {
                        toast({
                            type: "success",
                            title: "Success",
                            message: "Welcome!",
                        });
                    });
                });
            })
            .catch((err) => {
                console.log(err);
                toast({
                    type: "error",
                    title: "Error",
                    message: "An error occurred. Please try again.",
                });
            });
    }

    async function signUp({
        email,
        password,
        confirmPassword,
    }: RegisterProps): Promise<void> {
        const data = {
            email,
            password,
            confirmPassword,
        };
        if (!email.match(emailRegex)) {
            toast({
                type: "error",
                title: "Error",
                message:
                    "Invalid email address. Please enter a valid email address.",
            });
            return;
        }

        if (password.length < 8) {
            toast({
                type: "error",
                title: "Error",
                message: "Password must be at least 8 characters long.",
            });
            return;
        }

        if (!password.match(passwordRegex)) {
            toast({
                type: "error",
                title: "Error",
                message:
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                type: "error",
                title: "Error",
                message: "Passwords do not match.",
            });
            return;
        }

        axios
            .post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/signup`, data)
            .then((res) => {
                const _authData: AuthData = {
                    token: res.data.token,
                };

                // Persist the data in the Async Storage
                // to be recovered in the next user session.
                AsyncStorage.setItem(
                    "@AuthData",
                    JSON.stringify(_authData),
                ).then(() => {
                    setAuthData(_authData);
                    getUserData(res.data.token).then(() => {
                        toast({
                            type: "success",
                            title: "Success",
                            message: "Welcome!",
                        });
                    });
                    // track("User Registered", { email: email });
                    // getUserData(res.data.token).then(() => {
                    //     toast({
                    //         type: "success",
                    //         title: "Success",
                    //         message: "Welcome!",
                    //     });
                    // });
                });
            })
            .catch((err) => {
                toast({
                    type: "error",
                    title: "Error",
                    message: "An error occurred. Please try again.",
                });

                console.log(err);
            });
    }

    const appleSignIn = async () => {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        // get current authentication state for user
        // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
        const credentialState = await appleAuth.getCredentialStateForUser(
            appleAuthRequestResponse.user,
        );

        if (credentialState === appleAuth.State.AUTHORIZED) {
            appleRegistration(
                appleAuthRequestResponse.user,
                appleAuthRequestResponse.email!,
                appleAuthRequestResponse.fullName,
                appleAuthRequestResponse.identityToken,
            );
        }
    };

    async function appleRegistration(
        user: any,
        email: string,
        fullName: AppleRequestResponseFullName | null,
        identityToken: string | null,
    ) {
        try {
            const data = {
                email: email,
                user: user,
                fullName: fullName,
                identityToken: identityToken,
            };
            console.log(data);
            const res = await axios.post(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/apple`,
                data,
            );
            const _authData: AuthData = { token: res.data.token };
            await AsyncStorage.setItem("@AuthData", JSON.stringify(_authData));
            setAuthData(_authData);
            track("User Registered", { email: email });
        } catch (e) {
            console.log(e);
            toast({
                type: "error",
                title: "Error",
                message: "An error occurred. Please try again.",
            });
        }
    }

    // async function googleSignIn(): Promise<void> {
    //     try {
    //         await GoogleSignin.hasPlayServices();
    //         const result = await GoogleSignin.signIn();
    //         console.log("Google Signin result", result);
    //         googleRegistration(result.user.email, result.user.name);
    //     } catch (error: any) {
    //         if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //             toast({
    //                 message: "User cancelled the login flow !",
    //                 title: "Error",
    //                 type: "error",
    //             });
    //         } else if (error.code === statusCodes.IN_PROGRESS) {
    //             toast({
    //                 message: "Sign in in progress !",
    //                 title: "Error",
    //                 type: "error",
    //             });
    //         } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //             toast({
    //                 message: "Play services not available or outdated !",
    //                 title: "Error",
    //                 type: "error",
    //             });
    //         } else {
    //             console.log(error);
    //         }
    //     }
    // }

    // Replace your googleSignIn function with this:
    async function googleSignIn(): Promise<void> {
        try {
            const result = await promptAsync();
            if (result.type === "success") {
                // You will need to exchange this authorization code for tokens
                const { authentication } = result;

                // Use the token to register/login the user
                if (authentication?.accessToken) {
                    // Get user info
                    const userInfoResponse = await fetch(
                        "https://www.googleapis.com/userinfo/v2/me",
                        {
                            headers: {
                                Authorization: `Bearer ${authentication.accessToken}`,
                            },
                        },
                    );
                    const userInfo = await userInfoResponse.json();

                    // Now use this info to call your backend
                    googleRegistration(userInfo.email, userInfo.name);
                }
            } else {
                toast({
                    message: "Sign in was cancelled or failed",
                    title: "Error",
                    type: "error",
                });
            }
        } catch (error) {
            console.log("Google Sign-In Error:", error);
            toast({
                type: "error",
                title: "Error",
                message: "An error occurred during Google sign-in.",
            });
        }
    }

    const googleRegistration = async (email: string, name: string | null) => {
        try {
            const data = {
                email: email,
            };
            const res = await axios.post(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/google-signin`,
                data,
            );
            const _authData: AuthData = { token: res.data.token };
            await AsyncStorage.setItem("@AuthData", JSON.stringify(_authData));
            setAuthData(_authData);
            if (name) {
                toast({
                    message: `Welcome ${name} !`,
                    title: "Success",
                    type: "success",
                });
            }
            track("User Registered", { email: email });
        } catch (e) {
            console.log(e);
            toast({
                type: "error",
                title: "Error",
                message: "An error occurred. Please try again.",
            });
        }
    };

    const signOut = async () => {
        //Remove the data from Async Storage
        //to NOT be recovered in next session.
        await AsyncStorage.removeItem("@AuthData");

        //Remove the data from the state
        setAuthData(undefined);
        setUser(undefined);

        toast({
            type: "info",
            title: "Info",
            message: "You have been logged out.",
        });
    };

    async function loadStorageData(): Promise<void> {
        try {
            //Try get the data from Async Storage
            const authDataSerialized = await AsyncStorage.getItem("@AuthData");
            if (authDataSerialized) {
                //If there are data, it's converted to an Object and the state is updated.
                const _authData: AuthData = JSON.parse(authDataSerialized);
                setAuthData(_authData);
            }
        } catch {
            //If an error occurs, a message is shown
            toast({
                type: "error",
                title: "Error",
                message: "An error occurred. Please try again.",
            });
        }
    }

    async function getUserData(token?: string): Promise<void> {
        axios
            .get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/user`, {
                headers: {
                    Authorization: `Bearer ${token || authData?.token}`,
                },
            })
            .then(({ data }) => {
                const _user: userStateProps = data;
                if (_user.health.age) {
                    const age = _user.health.age;
                    const date = new Date(age);
                    _user.health.age = date;
                }
                setUser(_user);
                setLoading(false);
            })
            .catch(async (error) => {
                await AsyncStorage.removeItem("@AuthData");
                //Remove the data from the state
                setAuthData(undefined);
                setUser(undefined);
                toast({
                    type: "error",
                    title: "Error",
                    message: "An error occurred. Please re-login.",
                });
            });
    }

    async function signInQuiz(userResponse: QuizUserResponse): Promise<void> {
        const data = { ...userResponse, quiz_finished: true };

        axios
            .post(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/health-quiz`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${authData?.token}`,
                    },
                },
            )
            .then((res) => {
                track("Quiz Completed", { email: user?.email });
                setUser((prev) => {
                    const email = prev?.email || "";
                    return {
                        ...prev,
                        ...data,
                        email,
                    } as userStateProps; // Explicitly typecast to userStateProps
                });
                console.log("success", user);
                toast({
                    type: "success",
                    title: "Success",
                    message: res.data.message,
                });
            })
            .catch((error) => {
                console.log(error);

                toast({
                    type: "error",
                    title: "Error",
                    message: "An error occurred. Please try again.",
                });
            });
    }

    async function forgotPassword(email: string): Promise<void> {
        const data = {
            email,
        };

        if (!email.match(emailRegex)) {
            toast({
                type: "error",
                title: "Error",
                message:
                    "Invalid email address. Please enter a valid email address.",
            });
            return;
        }

        await axios
            .post(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/forgot-password`,
                data,
            )
            .then((res) => {
                toast({
                    type: "success",
                    title: "Success",
                    message: res.data.message,
                });
            });
    }

    async function changePassword(
        email: string,
        resetCode: string,
        newPassword: string,
    ): Promise<void> {
        const data = {
            email,
            resetCode,
            newPassword,
        };

        if (!email.match(emailRegex)) {
            toast({
                type: "error",
                title: "Error",
                message:
                    "Invalid email address. Please enter a valid email address.",
            });
            return;
        }

        if (newPassword.length < 8) {
            toast({
                type: "error",
                title: "Error",
                message: "Password must be at least 8 characters long.",
            });
            return;
        }

        if (!newPassword.match(passwordRegex)) {
            toast({
                type: "error",
                title: "Error",
                message:
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
            });
            return;
        }

        await axios
            .post(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/change-password`,
                data,
            )
            .then((res) => {
                toast({
                    type: "success",
                    title: "Success",
                    message: res.data.message,
                });
            });
    }

    async function updateUserData(
        data: Omit<userProps, "user_id" | "email">,
    ): Promise<void> {
        makeAPICall("POST", "/auth/update-user", data)
            .then(() => {
                setUser((prev) => {
                    return {
                        ...prev,
                        ...data,
                    } as userStateProps; // Explicitly typecast to userStateProps
                });
                toast({
                    type: "success",
                    title: "Success",
                });
            })
            .catch(() => {
                toast({
                    type: "error",
                    title: "Error",
                    message: "An error occurred. Please try again.",
                });
            });
    }

    async function updateUserHealthData(data: userHealthProps): Promise<void> {
        await newToast
            .promise(makeAPICall("PUT", "/auth/update-user-health", data), {
                loading: "Updating your health data...",
                success: "Health data updated successfully!",
                error: "An error occurred. Please try again.",
            })
            .then(() => {
                setUser((prev) => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        health: {
                            ...prev.health,
                            ...data,
                        },
                    };
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const makeAPICall = async (
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
        url: string,
        data: Record<string, unknown>,
    ) => {
        if (!authData) {
            throw new Error("USER_NOT_AUTHENTICATED");
        }

        if (!authData.token) {
            throw new Error("USER_NOT_AUTHENTICATED");
        }

        // return a promise
        return new Promise((resolve, reject) => {
            // make a request
            axios({
                url: `${process.env.EXPO_PUBLIC_BACKEND_URL}${url}`,
                method,
                data,
                headers: {
                    Authorization: `Bearer ${authData?.token}`,
                },
            })
                .then((res) => {
                    // if success, resolve the promise
                    resolve(res);
                })
                .catch((err) => {
                    // if error, reject the promise
                    console.log(err.response.data);
                    reject(err.response.data);
                });
        });
    };

    useEffect(() => {
        //Every time the App is opened, this provider is rendered
        //and call de loadStorageData function.
        loadStorageData();
    }, []);

    useEffect(() => {
        //Every time the authData is updated, this effect is called
        if (authData) {
            getUserData();
        }
    }, [authData]);

    return (
        //This component will be used to encapsulate the whole App,
        //so all components will have access to the Context
        <AuthContext.Provider
            value={{
                authData,
                user,
                setUser,
                loading,
                setLoading,
                signIn,
                signUp,
                signOut,
                signInQuiz,
                forgotPassword,
                changePassword,
                makeAPICall,
                updateUserData,
                googleSignIn,
                updateUserHealthData,
                appleSignIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}

export { AuthProvider, useAuth };
