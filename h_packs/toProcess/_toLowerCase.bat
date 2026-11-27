@echo off
setlocal
pushd "%~dp0"

rem "dir /l" lists names in lowercase; "ren" matches the source case-insensitively,
rem so renaming each file to its lowercase listing changes only its case.
for /f "eol=: delims=" %%f in ('dir /b /a-d /l') do (
    if /i not "%%f"=="%~nx0" ren "%%f" "%%f"
)

popd
echo Done.
pause
