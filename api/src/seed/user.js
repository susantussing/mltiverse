import User from '../models/User';

const user = {
  name: 'Susan',
  password: 'password',
};

async function seedUser() {
  try {
    await User.collection.drop();
    await User.create(user);
  } catch (err) {
    console.error(err);
  }
}

export default seedUser;
