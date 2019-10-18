IF [%1] == [] GOTO error

docker login
call build.bat

rem RUN DOCKER TO PUBLISH
docker tag aptero-meeting-vr:latest registry.aptero.co/aptero-meeting-vr:latest
docker push registry.aptero.co/aptero-meeting-vr:latest

docker tag aptero-meeting-vr:latest registry.aptero.co/aptero-meeting-vr:%1
docker push registry.aptero.co/aptero-meeting-vr:%1

GOTO :EOF
:error
ECHO incorrect_parameters