import mongoose from 'mongoose';

const tourismURI = process.env.MONGODB_URI_TOURISM || 'mongodb+srv://SVTG:svtg123@cluster0.936rmcg.mongodb.net/tourismGuideDB?appName=Cluster0';

const tourismDB = mongoose.createConnection(tourismURI);

tourismDB.on('connected', () => {
  console.log('Tourism MongoDB (tourismGuideDB) connected successfully');
});

tourismDB.on('error', (err) => {
  console.error('Tourism MongoDB connection error:', err.message);
});

export default tourismDB;
