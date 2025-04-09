import React from "react";
import { Image, StyleSheet } from "react-native";
import DoctorIcon from "../../../../assets/images/doctor-icon.jpeg";

interface MessageAvatarProps {
    isSendByUser: boolean;
}

// MessageAvatar Component
export const MessageAvatar: React.FC<MessageAvatarProps> = ({
    isSendByUser,
}) => {
    if (isSendByUser) return null;
    return <Image source={DoctorIcon} style={styles.avatar} />;
};

// Styles
const styles = StyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
});
