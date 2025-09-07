import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.DATABASE_URI || 'mongodb://localhost:27017/activitylogs',
  options: {
    // Modern MongoDB driver doesn't need these deprecated options
    // useNewUrlParser and useUnifiedTopology are handled automatically
  },
}));
