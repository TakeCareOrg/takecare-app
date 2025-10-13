/* eslint-disable @typescript-eslint/no-empty-object-type */
import { MainStackParamList } from "@navigation/app-navigation-types";

// Define your navigation parameter list
declare global {
    namespace ReactNavigation {
        interface RootParamList extends MainStackParamList {}
    }
}

// This export is important to make it a module
export {};
