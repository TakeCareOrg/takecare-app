import { Platform } from "react-native";

export interface HealthData {
    steps: number;
    flights: number;
    distance: number;
}

const useHealthData = Platform.select({
    ios: () => require("./use-health-data.ios").default,
    android: () => require("./use-health-data.android").default,
    default: () => {
        throw new Error("Health data is not supported on this platform");
    },
})();

export default useHealthData;
