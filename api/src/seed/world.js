import World from '../models/World';
import User from '../models/User';

async function seedWorld() {
  const user = await User.findOne({ name: 'Susan' });

  const worlds = [{
    user: user._id,
    name: 'Test World',
    host: 'localhost',
    port: 2860,
  },
  {
    user: user._id,
    name: 'Second World',
    host: 'localhost',
    port: 2860,
  }];
  try {
    await World.collection.drop();
    const createdWorlds = await World.create(worlds);
    user.worlds = createdWorlds;
    await user.save();
  } catch (err) {
    console.error(err);
  }
}

export default seedWorld;
