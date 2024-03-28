import dotenv from 'dotenv';

dotenv.config();
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || ('localhost' as string);
const SERVER_PORT = process.env.SERVER_PORT || (4000 as number);
// const MONGO_URL = 'mongodb://127.0.0.1:27017/500kuser?retryWrites=false';
const MONGO_URL = 'mongodb://127.0.0.1:27017/500kuser?retryWrites=false';

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
};

//jwt
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'gofiberschedule';

//role
const ADMIN_ROLE = process.env.ADMIN_ROLE || 'admin';
const CUSTOMER_ROLE = process.env.CUSTOMER_ROLE || 'customer';

const CRYPTO_KEY = process.env.CRYPTO_KEY || 'gofiberschedule';

const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: SERVER,
  auth: {
    jwtSecretKey: JWT_SECRET_KEY,
  },
  role: {
    customer: CUSTOMER_ROLE,
    admin: ADMIN_ROLE,
  },
  crypto: {
    cryptoKey: CRYPTO_KEY,
  },
};

export default config;
