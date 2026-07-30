import User from './models/User.js';

export const seedTestUsers = async () => {
  try {
    const testUsers = [
      {
        fullName: 'Test Tourist User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'tourist_user',
        contactNumber: '0771234567'
      },
      {
        fullName: 'Test Admin User',
        email: 'admin@example.com',
        password: 'Password123!',
        role: 'admin',
        contactNumber: '0779999999'
      },
      {
        fullName: 'Test Hotel Owner',
        email: 'hotel@example.com',
        password: 'Password123!',
        role: 'hotelowner_user',
        contactNumber: '0778888888'
      }
    ];

    for (const userData of testUsers) {
      let user = await User.findOne({ email: userData.email });
      if (user) {
        user.password = userData.password;
        user.fullName = userData.fullName;
        user.role = userData.role;
        user.contactNumber = userData.contactNumber;
        await user.save();
        console.log(`[SEED] Updated user password for: ${userData.email}`);
      } else {
        await User.create(userData);
        console.log(`[SEED] Created new test user: ${userData.email}`);
      }
    }

    console.log('[SEED] Test accounts ready: test@example.com / Password123!');
  } catch (error) {
    console.error('[SEED] Error seeding test users:', error.message);
  }
};
