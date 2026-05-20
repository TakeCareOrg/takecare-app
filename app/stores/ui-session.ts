import { create } from "zustand";

/**
 * Session-only UI state (NOT persisted). Resets on every app launch by
 * design — used for dismissals that should re-appear next time the user
 * opens the app, like the AI chat prompt card on the Home screen.
 */
interface UiSessionState {
    aiChatPromptDismissed: boolean;
    dismissAiChatPrompt: () => void;
    resetSession: () => void;
}

export const useUiSessionStore = create<UiSessionState>((set) => ({
    aiChatPromptDismissed: false,
    dismissAiChatPrompt: () => set({ aiChatPromptDismissed: true }),
    resetSession: () => set({ aiChatPromptDismissed: false }),
}));
