

Write-Host "Syncing plugins and native code..."
npx cap sync

Write-Host "Building frontend code..."
npm run build




Write-Host "Running on Android device..."
npx cap run android --target=49a9e8e
