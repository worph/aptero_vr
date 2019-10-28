cd Aptero_Client
call npm install
call npm run bundle
cd ..
cd Aptero_Server
call npm install
call npm run build
cd ..
rem Aptero_Client/build

docker build -t aptero-meeting-vr .
