# Survey Chat

[Proof of concept](https://surveychat.herokuapp.com/)

Connect people in real-time chat rooms that are filtered using a survey.

## Dependencies and References

- [socket.io](https://github.com/csmadhav/react-socket.io-chat-app) to manage websockets
- [surveyjs](https://github.com/surveyjs/surveyjs_react_quickstart) for rendering forms
- [docker-compose](https://github.com/mrcoles/node-react-docker-compose) for containerization

## Development

```
docker-compose up
```

For development, the `server/` and `client/` directories have their own docker containers, which are configured via the `docker-compose.yml` file.

The client server is spun up at `localhost:3000` and it proxies internally to the server using the linked name as `server:8080`.

The local directories are mounted into the containers, so changes will reflect immediately. However, changes to package.json will likely need to a rebuild: `docker-compose down && docker-compose build && docker-compose up`.

### Notes

#### Adding new scss files

In a previous version of this, you needed to restart the client for new scss files to be recognized by the watch command. This may have changed (TODO: test if this still matters with react-scripts updates):

```
docker-compose restart client
```

#### Installing npm dependencies

All changes to `node_modules` should happen _inside_ the containers. Install any new dependencies by inside the container. You can do this via `docker-compose run`, but it’s easier to just upadte a running container and avoid having to rebuild everything:

```
docker-compose exec client
```

Then inside:

```
npm install --save <new_dependency>
```

## Production

```
docker-compose -f docker-compose.prod.yml up
```

For production, this uses the Dockerfile at the root of the repo. It creates a static build of the client React app and runs Express inside server, which handles both the API and serving of React files.

## Deployment via Heroku

Login and create app

- `heroku login`
- `heroku create --app <app-server-name>`
- `heroku container:login`

Build image and push to registry

- `docker-compose -f docker-compose.prod.yml build`
- `docker tag <app-server-name> registry.heroku.com/<app-server-name>/web`
- `docker push registry.heroku.com/<app>/<process-type>`
<!--
    docker images
    docker rmi --force surveychat_web
    docker-compose -f docker-compose.prod.yml build
    docker tag surveychat_web registry.heroku.com/surveychat/web
    docker push registry.heroku.com/surveychat/web
-->

Alt build/push image (using heroku.yml):

- `heroku container:push web --app <app-server-name>`

Release and verify app

- `heroku container:release web --app <app-server-name>`
- `heroku open --app <app-server-name>`

<!--
    heroku container:release web --app surveychat
    heroku open --app  surveychat
 -->

## Roadmap

- [ ] Use volume for chat history rentention
- [ ] Display number of users in chat
- [ ] Set user name and bio
- [ ] Set room and hashed survey state in url
