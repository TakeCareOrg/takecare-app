import React from "react";
import { IconType } from "../../../types/icon.types";
import { View, Image } from "react-native";

//? We need to have a png for the moment because of the incompatibility of the svg with the react-native-svg library
interface IlluProps {
    width: number | string;
    height: number | string;
}

const Illu: React.FC<IlluProps> = () => {
    return (
        <View style={{ width: "100%", height: 80 }}>
            <Image
                source={require("./SleepIllu3.png")}
                style={{ width: "100%", height: "100%" }}
            />
        </View>
    );
};

export const SleepIllu3: React.FC<IconType> = ({
    height = 80,
    width = "100%",
}) => <Illu width={width} height={height} />;
