import React, { useState } from "react";
import {
    View,
    Modal,
    Text,
    Pressable,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from "react-native";
import { useColors } from "../../styles/Colors";
import { launchCamera } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { CameraIcon } from "../../../assets/icons/CameraIcon";
import useToast from "../../hooks/use-toast";
import { AuthData } from "../../types/auth.types";

interface PhotoButtonProps {
    onMessageReceived: (message: string) => void;
    onInputPressed: () => void;
    loading?: boolean;
}

const PhotoButton: React.FC<PhotoButtonProps> = ({
    onMessageReceived,
    onInputPressed,
    loading,
}) => {
    const toast = useToast();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const { main } = useColors();

    const searchForToken = async () => {
        const token = await AsyncStorage.getItem("@AuthData");
        if (token) {
            const _authData: AuthData = JSON.parse(token);
            return _authData.token;
        }
        return "";
    };

    const requestPermissions = async () => {
        try {
            let permission;
            if (Platform.OS === "android") {
                permission = PERMISSIONS.ANDROID.CAMERA;
            } else if (Platform.OS === "ios") {
                permission = PERMISSIONS.IOS.CAMERA;
            } else {
                console.error("Unsupported platform");
                return;
            }

            const result = await request(permission);
            return result;
        } catch (error) {
            console.error("Error requesting permissions:", error);
        }
    };

    const handleLanguageSelection = (language: string) => {
        setSelectedLanguage(language);
        setModalVisible(false);
        takePhoto();
    };

    const handleTakePhoto = () => {
        setModalVisible(true);
    };

    const takePhoto = () => {
        requestPermissions().then((result) => {
            if (result === RESULTS.GRANTED) {
                launchCamera({ mediaType: "photo" }, (response) => {
                    if (response.didCancel) {
                        console.log("User cancelled image picker");
                    } else if (response.errorMessage) {
                        console.log(
                            "ImagePicker Error: ",
                            response.errorMessage,
                        );
                    } else if (response.assets && response.assets.length > 0) {
                        const source = { uri: response.assets[0].uri };
                        sendAttachmentToAPI(source);
                        onInputPressed();
                        displayInfoToast();
                    }
                });
            } else if (result === RESULTS.BLOCKED) {
                toast({
                    type: "error",
                    title: "Permission Blocked",
                    message:
                        "Permission to access the camera is blocked. Please enable it in the app settings.",
                });
            } else {
                toast({
                    type: "error",
                    title: "Permission Denied",
                    message: "Permission to access the camera was denied.",
                });
            }
        });
    };

    const displayInfoToast = () => {
        toast({
            type: "info",
            title: "Analysis",
            message: "Analyzing your photo. Please wait...",
        });
    };

    const sendAttachmentToAPI = async (attachment: any) => {
        const formData = new FormData();
        formData.append("attachment", {
            uri: attachment.uri,
            type: "image/jpeg",
            name: "photo.jpg",
        });

        // Append the selected language to the formData
        formData.append("language", selectedLanguage);

        try {
            const token = await searchForToken();
            await axios
                .post(
                    `${process.env.EXPO_PUBLIC_BACKEND_URL}/analyze/blood-analysis`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    },
                )
                .then(({ data }) => {
                    onMessageReceived(data);
                    displaySuccessToast();
                })
                .catch((error) => {
                    console.log(error.message);
                    toast({
                        type: "error",
                        title: "Error",
                        message: "An error occurred. Please re-send.",
                    });
                });
        } catch (error) {
            console.error("Error uploading file: ", error);
        }
    };

    const displaySuccessToast = () => {
        toast({
            type: "success",
            title: "Success",
            message: "Photo successfully analyzed.",
        });
    };

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Select Language:</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => handleLanguageSelection("eng")}
                        >
                            <Text style={styles.textStyle}>English</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => handleLanguageSelection("fre")}
                        >
                            <Text style={styles.textStyle}>French</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => handleLanguageSelection("spa")}
                        >
                            <Text style={styles.textStyle}>Spanish</Text>
                        </Pressable>
                        {/* Add more languages as needed */}
                    </View>
                </View>
            </Modal>
            <TouchableOpacity
                onPress={handleTakePhoto}
                style={styles.button}
                disabled={loading}
            >
                <CameraIcon color={loading ? "#AAAFB4" : main.primary} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    buttonClose: {
        backgroundColor: "#003366",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        marginVertical: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    textStyle: {
        color: "white",
        fontWeight: "600",
        textAlign: "center",
        fontSize: 16,
    },
    modalText: {
        marginBottom: 20,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
});

export default PhotoButton;
