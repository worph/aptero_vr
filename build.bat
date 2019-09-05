cd Aptero_Client
call yarn run bundle
cd ..
rem Aptero_Client/build

docker build -t aptero-meeting-vr .
