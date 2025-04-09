import React, { useState } from "react";
import { FunctionComponent } from "react";
import {
    Modal,
    Platform,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";
import { margin, padding, row } from "../../styles/global-style";
import { useColors } from "../../styles/Colors";
import { TextComponent } from "../text-component";
import { StarIcon } from "../../../assets/icons/StarIcon";
import { CoinIcon } from "../../../assets/icons/CoinIcon";
import { Avatar } from "@rneui/themed";
import { BackArrowIcon } from "../../../assets/icons/BackArrowIcon";
import { useNavigation } from "@react-navigation/native";
import { MoodComponent } from "../mood-component";
import { Setting } from "../../types/settings.types";
import { useAuth } from "../../contexts/auth-context";
import PopUpMenu from "../pop-up-menu";
import { useTranslation } from "react-i18next";

type PageContainerProps = {
    children: React.ReactNode;
    style?: object;
    title?: string;
    settings?: Setting[] | undefined;
    back?: boolean;
    isHome?: boolean;
    showProfile?: boolean;
};

export const PageContainer: FunctionComponent<PageContainerProps> = ({
    children,
    style,
    title,
    settings,
    back = true,
    isHome = false,
    showProfile = false,
}) => {
    const { main } = useColors();
    const { signOut } = useAuth();

    const navigation = useNavigation();

    const [isPopUpVisible, setIsPopUpVisible] = useState(false);
    const { t } = useTranslation();

    if (showProfile && settings) {
        console.error(
            "Error: Both 'showProfile' and 'settings' cannot be provided simultaneously. Please provide only one of them.",
        );
        return null;
    }

    const handleClosePopUp = () => {
        setIsPopUpVisible(false);
    };

    const logoutAction = () => {
        console.log("Log Out");
        signOut();
        handleClosePopUp();
    };

    return (
        <>
            <View
                style={{
                    flex: 1,
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    ...padding(15),
                    ...style,
                    paddingTop: Platform.OS === "ios" ? 30 : 0,
                }}
            >
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        ...margin(15, 0, 0, 0),
                    }}
                >
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                display: "flex",
                                flexDirection: isHome ? "column" : "row",
                            }}
                        >
                            {!isHome && back && (
                                <TouchableOpacity
                                    onPress={() => navigation.goBack()}
                                >
                                    <BackArrowIcon
                                        width={30}
                                        height={30}
                                        style={{
                                            marginRight: 15,
                                        }}
                                    />
                                </TouchableOpacity>
                            )}
                            {title && (
                                <TextComponent fontSize={24}>
                                    {title}
                                </TextComponent>
                            )}
                            {isHome && (
                                <View
                                    style={{
                                        ...padding(10, 0),
                                        ...row.row,
                                    }}
                                >
                                    <View
                                        style={{
                                            ...row.row,
                                            marginRight: 15,
                                        }}
                                    >
                                        <StarIcon
                                            width={20}
                                            height={20}
                                            color={main.blueGray}
                                        />
                                        <TextComponent
                                            fontSize={16}
                                            color={main.blueGray}
                                            style={{
                                                marginLeft: 5,
                                            }}
                                        >
                                            {/* Free */}
                                            {t("GLOBAL.FREE")}
                                        </TextComponent>
                                    </View>
                                    <View
                                        style={{
                                            ...row.row,
                                            marginRight: 15,
                                        }}
                                    >
                                        <CoinIcon
                                            width={20}
                                            height={20}
                                            color={main.magenta}
                                        />
                                        <TextComponent
                                            fontSize={16}
                                            color={main.magenta}
                                            style={{
                                                marginLeft: 5,
                                            }}
                                        >
                                            775
                                        </TextComponent>
                                    </View>
                                    <MoodComponent mood="overjoyed" />
                                </View>
                            )}
                        </View>
                    </View>
                    <View>
                        {settings && (
                            <PopUpMenu
                                settings={settings}
                                top={Platform.OS === "ios" ? 60 : 20}
                                right={15}
                            />
                        )}
                    </View>
                    {showProfile && (
                        <>
                            <TouchableOpacity
                                onPress={() => {
                                    //TODO: Navigate AS NEVER
                                    navigation.navigate("Profile" as never);
                                }}
                            >
                                <Avatar
                                    size="medium"
                                    rounded
                                    source={{
                                        uri: "https://cdn.discordapp.com/attachments/766380707164848148/1225569090056360017/Avatar_.jpeg?ex=66219b29&is=660f2629&hm=876c753290f671ec3e05f49eb71f48af5c24a40835f6bcbba37c021109757731&",
                                    }}
                                />
                            </TouchableOpacity>
                            <Modal
                                transparent
                                visible={isPopUpVisible}
                                animationType="fade"
                                onRequestClose={handleClosePopUp}
                            >
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    activeOpacity={1}
                                    onPressOut={handleClosePopUp}
                                >
                                    <View
                                        style={{
                                            position: "absolute",
                                            top:
                                                Platform.OS === "ios" ? 90 : 20,
                                            right: 15,
                                            backgroundColor:
                                                main.menuBackground,
                                            borderRadius: 10,
                                            padding: 10,
                                            elevation: 5,
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                logoutAction();
                                            }}
                                            style={{ padding: 10 }}
                                        >
                                            <TextComponent
                                                fontSize={16}
                                                color={main.primary}
                                            >
                                                {t("GLOBAL.LOGOUT")}
                                            </TextComponent>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            </Modal>
                        </>
                    )}
                </View>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ flex: 1, marginBottom: 80 }}>
                        {children}
                    </View>
                </ScrollView>
            </View>
        </>
    );
};
