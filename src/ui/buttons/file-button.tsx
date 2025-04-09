import React, { useEffect, useState } from "react";
import {
    TouchableOpacity,
    StyleSheet,
    Platform,
    View,
    Text,
    Modal,
    Pressable,
} from "react-native";
import { useColors } from "../../styles/Colors";
import DocumentPicker, {
    DocumentPickerResponse,
} from "react-native-document-picker";
import axios from "axios";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { AddIcon } from "../../../assets/icons/AddIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useToast from "../../hooks/use-toast";
import { AuthData } from "../../types/auth.types";

interface FileButtonProps {
    onMessageReceived: (message: string) => void;
    onInputPressed: () => void;
    loading?: boolean;
}

const FileButton: React.FC<FileButtonProps> = ({
    onMessageReceived,
    onInputPressed,
    loading,
}) => {
    const toast = useToast();
    const [modalVisible, setModalVisible] = useState(false);
    const { main } = useColors();

    useEffect(() => {
        const askPermission = async () => {
            try {
                if (Platform.OS === "android") {
                    const storagePermissionResult = await request(
                        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                    );
                    if (storagePermissionResult !== RESULTS.GRANTED) {
                        console.warn("Storage permission not granted");
                    }
                }
            } catch (error) {
                console.error("Error asking for permissions:", error);
            }
        };
        askPermission();
    }, []);

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
            let permissions: string[] = [];
            if (Platform.OS === "android") {
                permissions = [];
            } else if (Platform.OS === "ios") {
                permissions = [PERMISSIONS.IOS.MEDIA_LIBRARY];
            } else {
                console.error("Unsupported platform");
                return RESULTS.UNAVAILABLE;
            }

            const results = await Promise.all(
                // TODO: Check type Permission for IOS media library
                permissions.map((permission) => request(permission)),
            );
            if (results.some((result) => result === RESULTS.BLOCKED)) {
                return RESULTS.BLOCKED;
            }
            if (results.some((result) => result !== RESULTS.GRANTED)) {
                return RESULTS.DENIED;
            }
            return RESULTS.GRANTED;
        } catch (error) {
            console.error("Error requesting permissions:", error);
            return RESULTS.UNAVAILABLE;
        }
    };

    const handleChooseFile = () => {
        setModalVisible(true); // Show the language selection modal
    };

    const handleLanguageSelection = (language: string) => {
        setModalVisible(false);
        requestPermissions().then((result) => {
            if (result === RESULTS.GRANTED) {
                chooseFile(language);
            }
        });
    };

    const chooseFile = async (language: string) => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });
            sendAttachmentToAPI(res, language);
            onInputPressed();
            displayInfoToast();
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log("User cancelled document picker");
            } else {
                console.log("DocumentPicker Error: ", err);
            }
        }
    };

    const displayInfoToast = () => {
        toast({
            type: "info",
            title: "Analysis",
            message: "Analyzing file. Please wait...",
        });
    };

    const sendAttachmentToAPI = async (
        attachment: DocumentPickerResponse[],
        language: string,
    ) => {
        const formData = new FormData();
        formData.append("attachment", {
            uri: attachment[0].uri,
            type: "application/pdf",
            name: `${attachment[0].name || "document"}.pdf`,
        });

        formData.append("language", language);

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
                .catch(() => {
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
            message: "File successfully analyzed.",
        });
    };

    return (
        <View>
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
                        <Text style={styles.modalText}>
                            Select the language of your file:
                        </Text>
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
                    </View>
                </View>
            </Modal>
            <TouchableOpacity
                onPress={handleChooseFile}
                style={styles.button}
                disabled={loading}
            >
                <AddIcon color={loading ? "#AAAFB4" : main.primary} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
    },
    buttonEnabled: {
        color: "red",
    },
    buttonDisabled: {
        color: "blue",
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

export default FileButton;
