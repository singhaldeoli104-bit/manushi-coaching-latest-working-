@echo off
cd /d C:\PC\PackageCheck\android
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
call .\gradlew.bat assembleDebug
