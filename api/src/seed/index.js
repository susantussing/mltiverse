import seedUser from './user';
import seedWorld from './world';

export default async function seed() {
  await seedUser();
  await seedWorld();
}
