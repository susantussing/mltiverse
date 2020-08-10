/* eslint-disable no-param-reassign */
import ansi from 'anser';
import { TelnetSocket } from 'telnet-stream';
import { Socket } from 'net';
import HistoryLine from '../models/HistoryLine';
import connections from './connections';

// Maintains a connection for a given world and handles data to and from that socket.
// TODO:
// Negotiate window size for games that support it.

export default class TelnetConnection {
  constructor(world) {
    this.world = world;
    this.socket = new TelnetSocket(new Socket());
    this.host = world.host;
    this.port = world.port;

    this.socket.on('data', async (data) => {
      // Create a new HistoryLine, this is sent to the client by a pre-save hook

      const escapedString = ansi.escapeForHtml(data.toString().replace(/\r\n$/, ''));
      const htmlString = ansi.ansiToHtml(escapedString, {
        use_classes: true,
      });

      const historyLine = new HistoryLine({
        world: world._id,
        type: 'output',
        line: htmlString,
      });

      await historyLine.save();
    });

    this.socket.on('close', async () => {
      const line = new HistoryLine({
        world,
        type: 'system',
        line: 'Disconnected.',
      });
      await line.save();
      world.status = 'disconnected';
      await world.save();
      delete connections[world._id];
    });

    this.socket.on('connect', async () => {
      const line = new HistoryLine({
        world,
        type: 'system',
        line: 'Connected.',
      });
      await line.save();
      world.status = 'connected';
      await world.save();
    });

    this.socket.on('error', (error) => {
      console.error(`Socket error on world '${world._id}':`, error);
    });
  }

  connect() {
    const params = {
      host: this.host,
      port: this.port,
    };
    try {
      this.socket.connect(params);
    } catch (error) {
      console.error(`Connection failed on world '${this.world._id}':`, error);
    }
  }

  disconnect() {
    try {
      this.socket.end();
      // this.socket.destroy();
    } catch (error) {
      console.error(`Disconnection failed on world '${this.world._id}':`, error);
    }
  }

  async sendCommand(command) {
    try {
      this.socket.write(`${command}\n`);
    } catch (error) {
      console.error(`Write failed on world '${this.world._id}':`, error);
    }
  }
}
