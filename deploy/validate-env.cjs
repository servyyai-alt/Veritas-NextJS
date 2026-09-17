// Runs at container startup, never during the build. Do not print values.
const errors = [];
if (!process.env.MONGODB_URI || !/^mongodb(?:\+srv)?:\/\//.test(process.env.MONGODB_URI)) {
  errors.push('MONGODB_URI must be a MongoDB connection URI');
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  errors.push('JWT_SECRET must contain at least 32 characters');
}
for (const name of ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_PASSWORD', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'CLOUDINARY_CLOUD_NAME']) {
  if (/REPLACE_WITH|USER:PASSWORD|CLUSTER\.mongodb/.test(process.env[name] || '')) {
    errors.push(`${name} still contains an example placeholder`);
  }
}
if (errors.length) {
  console.error(`Invalid runtime configuration:\n${errors.join('\n')}`);
  process.exit(1);
}
