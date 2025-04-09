import { useNavigation } from "@react-navigation/native";
import { Avatar } from "@rneui/themed";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BackArrowIcon } from "../../../../assets/icons/BackArrowIcon";
import { CoinIcon } from "../../../../assets/icons/CoinIcon";
import { StarIcon } from "../../../../assets/icons/StarIcon";
import { useAuth } from "../../../contexts/auth-context";
import { useColors } from "../../../styles/Colors";
import { row } from "../../../styles/global-style";
import { MoodComponent } from "../../../ui/mood-component";
import { TextComponent } from "../../../ui/text-component";

type NavBarProps = {
    navigationTo?: string;
    title: string;
    onAvatarPress?: () => void;
};

function NavBar({ navigationTo, title, onAvatarPress }: NavBarProps) {
    const navigation = useNavigation();
    const { main } = useColors();
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <View style={{ rowGap: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={() =>
                            navigationTo
                                ? navigation.navigate(navigationTo as never)
                                : navigation.goBack()
                        }
                    >
                        <BackArrowIcon
                            width={18}
                            height={18}
                            style={{ marginRight: 16 }}
                        />
                    </TouchableOpacity>
                    <TextComponent fontSize={20}>{title}</TextComponent>
                </View>
                <View style={{ ...row.row }}>
                    <View style={{ ...row.row, marginRight: 16 }}>
                        <StarIcon
                            width={20}
                            height={20}
                            color={main.blueGray}
                        />
                        <TextComponent
                            fontSize={16}
                            color={main.blueGray}
                            style={{ marginLeft: 8 }}
                        >
                            Free
                        </TextComponent>
                    </View>
                    <View style={{ ...row.row, marginRight: 16 }}>
                        <CoinIcon width={20} height={20} color={main.magenta} />
                        <TextComponent
                            fontSize={16}
                            color={main.magenta}
                            style={{ marginLeft: 8 }}
                        >
                            775
                        </TextComponent>
                    </View>
                    <MoodComponent mood="overjoyed" />
                </View>
            </View>
            {user?.avatar && (
                <Avatar
                    size="medium"
                    rounded
                    source={{
                        uri: user.avatar as string,
                    }}
                    onPress={onAvatarPress}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
});

export default NavBar;
