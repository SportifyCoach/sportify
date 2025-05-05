const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅  Server escoltant a http://localhost:${PORT}`);
});
