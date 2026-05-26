import 'dotenv/config';
import { buildApp } from './app';

const port = Number(process.env.PORT) || 3000;
const app = buildApp();

app.listen({ port }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
