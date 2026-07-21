@echo off
setlocal EnableDelayedExpansion

rem Remove "ChallengeCategory" prefix from filenames like: ChallengeCategoryStyleIcon.jpg -> _StyleIcon.jpg
for %%f in (ChallengeCategory*.jpg) do (
    set "filename=%%~nf"
    set "newname=!filename:ChallengeCategory=!%%~xf"
    ren "%%f" "!newname!"
)
for %%f in (Challenge*.jpg) do (
    set "filename=%%~nf"
    set "newname=!filename:Challenge=!%%~xf"
    ren "%%f" "!newname!"
)

endlocal