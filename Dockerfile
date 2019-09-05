FROM risingstack/alpine:3.7-v8.10.0-4.8.0

ENV PORT 6767
EXPOSE 6767

COPY ./Aptero_Server/ ./server/
COPY ./Aptero_Client/static_assets/ ./server/src/public/static_assets/
COPY ./Aptero_Client/build/ ./server/src/public/

CMD ["node", "server/src"]
