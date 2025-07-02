import { Platform } from "react-native";

import { HealthData } from "@app/types/health-data-types";

type HealthDataProps = {
    startDate: string | Date;
    endDate: string | Date;
};

const useHealthData = (props: HealthDataProps): HealthData => {
    
    if (Platform.OS === "ios") {
        return require("./use-health-data.ios").default(props);
    } else if (Platform.OS === "android") {
        return require("./use-health-data.android").default(props);
    } else {
        throw new Error("Health data is not supported on this platform");
    }
};

export default useHealthData;
