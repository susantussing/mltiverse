import { PubSub } from 'apollo-server';

// Used by everything that needs to coordinate subscription events.

const LINE_CREATED = 'LINE_CREATED';
const WORLD_UPDATED = 'WORLD_UPDATED';
const USER_UPDATED = 'USER_UPDATED';

const pubSub = new PubSub();

export {
  pubSub, LINE_CREATED, WORLD_UPDATED, USER_UPDATED,
};
