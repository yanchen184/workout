@echo off
echo 🚀 Pushing all source files to GitHub...

cd /d "C:\Users\yanchen\workspace\self\workout\workout"

echo 📁 Initializing git repository...
git init
git remote add origin https://github.com/yanchen184/workout-calendar.git

echo 📦 Adding all files...
git add .
git commit -m "✨ Add complete workout calendar application

🎯 Features:
- 💪 Complete workout tracking system
- 📅 Monthly and weekly calendar views
- 🏃 Cardio and strength training support
- 📊 Muscle group status monitoring
- 🎨 Beautiful UI with optimized icons
- 🔥 Firebase backend integration

🛠️ Tech Stack:
- React 18 + TypeScript
- Ant Design UI components
- Firebase Firestore & Auth
- Vite build system
- GitHub Actions CI/CD

📱 Version: 1.2.0 - Ready for production!"

echo 🌐 Pushing to GitHub...
git branch -M main
git push -u origin main --force

echo ✅ Deployment complete!
echo 🔗 Repository: https://github.com/yanchen184/workout-calendar
echo 🌐 Live Demo: https://yanchen184.github.io/workout-calendar

pause
