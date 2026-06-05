import dbConfig from '../src/configs/db.config.js';

const startServer = async () => {
  await dbConfig();
    const app = (await import('./app.js')).default;
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}