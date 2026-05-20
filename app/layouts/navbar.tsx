import { StyleSheet, View } from "react-native";

import { CoinIcon } from "@assets/icons/CoinIcon";
import { Text } from "@components/ui/text";
import { useColorTheme } from "@hooks/use-color-theme";
import { useUserStore } from "@stores/users";

export type NavBarProps = {
    navigationTo?: string;
    title?: string;
    onAvatarPress?: () => void;
};

export function NavBar({ navigationTo, title, onAvatarPress }: NavBarProps) {
    const colors = useColorTheme();
    const user = useUserStore((state) => state.user);

    return (
        <View style={styles.container}>
            <View style={{ rowGap: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text fontSize={21} weight="600">
                        {title}
                    </Text>
                </View>
                <View style={[styles.row]}>
                    {/* <View style={[styles.row, { marginRight: 16 }]}>
                        <StarIcon
                            width={20}
                            height={20}
                            color={colors.blue[200]}
                        />
                        <Text
                            style={{ marginLeft: 8, color: colors.blue[200] }}
                        >
                            Free
                        </Text>
                    </View> */}
                    <View style={[styles.row, { marginRight: 16 }]}>
                        <CoinIcon
                            width={20}
                            height={20}
                            color={colors.yellow[500]}
                        />
                        <Text
                            weight="600"
                            style={{ marginLeft: 8, color: colors.yellow[500] }}
                        >
                            {user?.chat_tokens || 0}
                        </Text>
                    </View>
                </View>
            </View>
            {/* {user?.avatar && (
                <Avatar
                    rounded
                    source={{
                        uri: user.avatar as string,
                    }}
                    onPress={onAvatarPress}
                />
            )} */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
});
