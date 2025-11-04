### How to start the project

1. Go to [sirius-backend](sirius-backend) directory and create `.env` file from [.env.sample](sirius-backend/.env.sample). You can basically copy it and use https://jwtsecrets.com/#generator for `JWT_SECRET` value.
2. Start dockerized __database__: open terminal from the root directory and run:
    ```shell
    docker compose up
    ```
3. Start __backend api__: open terminal from [sirius-backend](sirius-backend) directory and run:
    ```shell
    npm run start
    ```
4. Start __frontend/UI__: open terminal from [sirius-frontend](sirius-frontend) directory and run:
    ```shell
    npm run start
    ```
5. Create `admin` user: open new terminal window and run
    ```shell
    curl -X POST http://localhost:3000/admins \
         -H "Content-Type: application/json" \
         -d '{"firstName":"<VALUE>","lastName":"<VALUE>", "password": "<VALUE>"}'
    ```
6. Open http://localhost:4200/ in your browser. Now you can log in as admin and start creating teachers. students, and assign students to teachers.


### TODOS
#### frontend
- [ ] add person card component for displaying teacher/student
- [ ] handle errors in forms(login form)
- [ ] add custom components or use material UI to make the over look nicer
- [ ] add support for light/dark theme
- [ ] make lessons view look and behave like a calendar(apple, google)
- [ ] add guitar tuner for guitar lessons
- [ ] add guitar chord detector for guitar lessons
#### backend
- [ ] integrate nest passport for JWT
- [ ] handle refresh of JWT
#### both
- [ ] record home tasks and attache them to lessons
