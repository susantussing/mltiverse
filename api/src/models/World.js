import mongoose, { Schema } from 'mongoose';
import { pubSub, WORLD_UPDATED } from '../graphql/pubSub';
import TelnetConnection from '../telnet/TelnetConnection';
import connections from '../telnet/connections';

const worldSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  host: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['connected', 'disconnected', 'connecting', 'disconnecting'],
    default: 'disconnected',
  },
  unread: {
    type: Number,
    default: 0,
  },
});

worldSchema.virtual('isConnected').get(function () {
  return this.status === 'connected';
});

// Create an actual telnet connection to go with this world.
worldSchema.methods.createConnection = function () {
  const connection = new TelnetConnection(this);
  connections[this._id] = connection;
  return connection;
};

// Before saving, handle all behavior that needs to be performed on save.
// Doing this before save because afterwards, there's no ability to tell what's changing.
// TODO: Restructure a bunch of this to make update publishing more consistent.
worldSchema.pre('save', async function () {
  const connection = connections[this._id] || this.createConnection();
  if (this.isModified('status')) {
    if (this.status === 'connecting') {
      connection.connect();
    } else if (this.status === 'disconnecting') {
      connection.disconnect();
    } else {
      // Only publish the update to the websocket when we're done.
      pubSub.publish(WORLD_UPDATED, { worldUpdate: this });
    }
  }

  // if (this.isModified('current')) {
  //   if (this.current) {
  //     // mark others not current - temporary
  //     // eventually this will go away when there's a user document to store this info on
  //     await this.constructor.updateMany({ current: true }, { current: false });
  //     this.unread = 0;
  //   }

  //   // pubSub.publish(WORLD_UPDATED, { worldUpdate: this })
  // }

  // if (this.isModified('unread')) {
  //   // If the unread changes at any time other than open/close, update the UI.
  //   pubSub.publish(WORLD_UPDATED, { worldUpdate: this });
  // }
});

const World = mongoose.model('World', worldSchema);

export default World;
