.PHONY: help start ios android web reinstall clean-ios clean-android rebuild-ios rebuild-android reset-all doctor logs-ios logs-android

# Variables
PROJECT := takecare-app
IOS_DIR := ios
ANDROID_DIR := android

## --------------------------------------------------
## Help
## --------------------------------------------------
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

## --------------------------------------------------
## Expo lifecycle
## --------------------------------------------------
start: install ## Start Expo in dev client mode
	npm run start

ios: install ## Run the iOS app (fast)
	npm run ios

android: install ## Run the Android app (fast)
	npm run android

web: install ## Run the web app
	npm run web

## --------------------------------------------------
## Dependencies & cleaning
## --------------------------------------------------
install:
	npm install

reinstall: ## Remove node_modules and reinstall dependencies
	rm -rf node_modules
	npm install

clean-ios: ## Clean iOS (Pods, DerivedData, Podfile.lock)
	rm -rf $(IOS_DIR)/Pods
	rm -f $(IOS_DIR)/Podfile.lock
	rm -rf ~/Library/Developer/Xcode/DerivedData
	cd $(IOS_DIR) && pod install --repo-update

clean-android: ## Clean Android (build directories + Gradle cache)
	rm -rf android/app/.cxx
	rm -rf android/app/build
	rm -rf android/build
	rm -rf android/.gradle
	echo "$(GREEN)Android Cleaned run make android$(NC)"

## --------------------------------------------------
## Full rebuilds
## --------------------------------------------------
rebuild-ios: reinstall clean-ios ## Full rebuild for iOS (reinstall + clean + run)
	cd $(IOS_DIR) && xcodebuild clean
	npx expo run:ios

rebuild-android: reinstall clean-android ## Full rebuild for Android (reinstall + clean + run)
	npx expo run:android

reset-all: reinstall clean-ios clean-android ## Full reset: reinstall + clean iOS/Android + clear Metro cache
	cd $(IOS_DIR) && xcodebuild clean
	npm run start -- --clear

## --------------------------------------------------
## Diagnostics & logs
## --------------------------------------------------
doctor: ## Run Expo and React Native environment checks
	npx expo-doctor
	npx react-native doctor

logs-ios: ## Tail logs from iOS simulator
	xcrun simctl spawn booted log stream --level=debug --style=compact --predicate 'process == "takecare-app"' || true

logs-android: ## Tail logs from Android (adb logcat)
	adb logcat | grep -i "ReactNative\|ReactNativeJS" || true
