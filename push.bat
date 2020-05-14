@echo off
PROMPT [CommitMessage]

::clasp push
git add .
prompt CommitMessage$G 
git commit -m CommitMessage
git push