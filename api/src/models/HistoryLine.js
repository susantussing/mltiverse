import mongoose, { Schema } from 'mongoose';
import { pubSub, LINE_CREATED } from '../graphql/pubSub';
import connections from '../telnet/connections';

const historyLineSchema = new Schema({
  line: String,
  world: {
    type: Schema.ObjectId,
    ref: 'World',
  },
  type: {
    type: String,
    enum: ['output', 'input', 'system'],
  },
}, { timestamps: true });

// We pretty much always want these in created order.
historyLineSchema.index({ createdAt: 1 });

// Send the command to the world's telnet connection for new input lines.
// Ensures these both get done at the same time but allows it to be done by the
// GraphQL mutation from the client.
historyLineSchema.pre('save', async function () {
  const connection = connections[this.world];
  if (connection && this.type === 'input' && this.isNew) {
    connection.sendCommand(this.line);
  }

  this.wasNew = this.isNew; // pass this on to the post-save, we can't do the rest until then
});

historyLineSchema.post('save', async function () {
  await this.populate('world').execPopulate();

  if (this.wasNew) {
    // If this is the user's active tab, send the output.  Otherwise, update the unread count.
    // if (this.world.current) {
    pubSub.publish(LINE_CREATED, { lineCreated: this });
    // } else {
    // this.world.unread += 1;
    // await this.world.save();
    // }
  }
});

const HistoryLine = mongoose.model('HistoryLine', historyLineSchema);

export default HistoryLine;
