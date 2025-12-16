import * as SecureStore from "expo-secure-store";

const secureStorage = {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) =>
        SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

describe("Storage Utils", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getItem", () => {
        it("should retrieve item from secure storage", async () => {
            const mockValue = "stored-value";
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
                mockValue,
            );

            const result = await secureStorage.getItem("test-key");

            expect(SecureStore.getItemAsync).toHaveBeenCalledWith("test-key");
            expect(result).toBe(mockValue);
        });

        it("should return null when item does not exist", async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

            const result = await secureStorage.getItem("non-existent-key");

            expect(result).toBeNull();
        });

        it("should handle errors from SecureStore", async () => {
            const error = new Error("Storage read error");
            (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(error);

            await expect(secureStorage.getItem("test-key")).rejects.toThrow(
                "Storage read error",
            );
        });
    });

    describe("setItem", () => {
        it("should store item in secure storage", async () => {
            (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(
                undefined,
            );

            await secureStorage.setItem("test-key", "test-value");

            expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
                "test-key",
                "test-value",
            );
        });

        it("should handle errors from SecureStore", async () => {
            const error = new Error("Storage write error");
            (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(error);

            await expect(
                secureStorage.setItem("test-key", "value"),
            ).rejects.toThrow("Storage write error");
        });
    });

    describe("removeItem", () => {
        it("should delete item from secure storage", async () => {
            (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(
                undefined,
            );

            await secureStorage.removeItem("test-key");

            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
                "test-key",
            );
        });

        it("should handle errors from SecureStore", async () => {
            const error = new Error("Storage delete error");
            (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(error);

            await expect(secureStorage.removeItem("test-key")).rejects.toThrow(
                "Storage delete error",
            );
        });
    });
});
