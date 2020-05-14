@echo off
set /p Message=Enter Commit Message:
::clasp push
git add . 
git commit -am %Message%
git push