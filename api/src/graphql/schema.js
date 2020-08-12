import { composeWithMongoose } from 'graphql-compose-mongoose';
import { schemaComposer } from 'graphql-compose';
import { withFilter } from 'apollo-server-express';
import User from '../models/User';
import World from '../models/World';
import HistoryLine from '../models/HistoryLine';
import {
  pubSub, LINE_CREATED, WORLD_UPDATED, USER_UPDATED,
} from './pubSub';

// TODO: Token auth

const UserTC = composeWithMongoose(User, {});

schemaComposer.Query.addFields({
  userById: UserTC.getResolver('findById'),
});

schemaComposer.Mutation.addFields({
  userUpdateById: UserTC.getResolver('updateById'),
});

const WorldTC = composeWithMongoose(World, {});

WorldTC.extendField(
  'port', { type: 'Int' },
);
WorldTC.extendField(
  'unread', { type: 'Int' },
);

WorldTC.addFields({
  isConnected: 'Boolean',
});

schemaComposer.Query.addFields({
  worldById: WorldTC.getResolver('findById'),
  worldOne: WorldTC.getResolver('findOne'),
  worldMany: WorldTC.getResolver('findMany'),
  worldCount: WorldTC.getResolver('count'),
  worldPagination: WorldTC.getResolver('pagination'),
});

schemaComposer.Mutation.addFields({
  worldCreateOne: WorldTC.getResolver('createOne'),
  worldUpdateById: WorldTC.getResolver('updateById'),
  worldRemoveById: WorldTC.getResolver('removeById'),
});

const HistoryLineTC = composeWithMongoose(HistoryLine, {});

schemaComposer.Query.addFields({
  historyLineById: HistoryLineTC.getResolver('findById'),
  historyLineOne: HistoryLineTC.getResolver('findOne'),
  historyLineMany: HistoryLineTC.getResolver('findMany'),
  historyLineCount: HistoryLineTC.getResolver('count'),
  historyLinePagination: HistoryLineTC.getResolver('pagination'),
});

schemaComposer.Mutation.addFields({
  historyLineCreateOne: HistoryLineTC.getResolver('createOne'),
  historyLineUpdateById: HistoryLineTC.getResolver('updateById'),
});

// Subscriptions can't be composed automatically the way that the other resolvers and mutations can.
schemaComposer.Subscription.addFields({
  lineCreated: {
    type: 'HistoryLine',
    args: {
      worldId: 'MongoID!',
    },
    subscribe: withFilter(() => pubSub.asyncIterator(LINE_CREATED),
      (payload, variables) => payload.lineCreated.world._id.toString() === variables.worldId),

  },
  worldUpdate: {
    type: 'World',
    args: {
      worldId: 'MongoID!',
    },
    subscribe: () => pubSub.asyncIterator(WORLD_UPDATED),
  },
  userUpdate: {
    type: 'User',
    args: {
      userId: 'MongoID!',
    },
    subscribe: () => pubSub.asyncIterator(USER_UPDATED),
  },
});

const schema = schemaComposer.buildSchema();

export default schema;
