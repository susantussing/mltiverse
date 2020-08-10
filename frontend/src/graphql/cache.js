import { InMemoryCache, makeVar } from '@apollo/client';

const token = makeVar(null);
const currentWorld = makeVar(null);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentWorld: {
          read() {
            return currentWorld();
          },
        },
      },
    },
  },
});

export { cache, token, currentWorld };
