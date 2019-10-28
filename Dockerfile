FROM node:10.17.0-jessie

ENV PORT 6767
EXPOSE 6767

#Copy and build server
COPY ./Aptero_Server/ ./server/
WORKDIR ./server/
#RUN npm run build

#copy client into html folder
COPY ./Aptero_Client/static_assets/ ./dist/public/static_assets/
COPY ./Aptero_Client/build/ ./dist/public/

#run server
CMD ["node", "./dist/"]
