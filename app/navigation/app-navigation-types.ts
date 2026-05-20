export type MainStackParamList = {
    Steps: undefined;
    Heart: undefined;
    Sleep: undefined;
    /** Withings-only detail screens. Only navigable when the user has connected Withings. */
    BodyComposition: undefined;
    Vitals: undefined;
    Tabs: undefined;
} & BottomTabParamList;

export type BottomTabParamList = {
    Home: undefined;
    Chat: undefined;
    Profile: undefined;
};

/**
 * Stack hosted inside the Profile tab. Lets us push the "Connected
 * devices" screen on top of the Profile root without polluting the
 * Home-tab navigation history.
 */
export type ProfileStackParamList = {
    ProfileMain: undefined;
    ConnectedDevices: undefined;
};
