const hapi = require('hapi');
const Joi = require('joi');

const server = new hapi.Server({
  host: 'locahost',
  port: 80,
});

let todo = [];

server.route([
  {
    method: 'GET',
    path: '/todo',
    handler: (request, reply) => {
      return reply(todo);
    },
  },
  {
    method: 'POST',
    path: '/todo',
    config: {
      validate: {
        payload: {
          text: Joi.string().required(),
        },
      },
      handler: (request, reply) => {
        const { text } = request.payload;
        const length = todo.length;

        todo = [
          ...todo,
          {
            id: length,
            text,
          },
        ];

        return reply('Successfuly added todo.');
      },
    }
  },
  // get a todo with it's id.
  {
    method: 'GET',
    path: '/todo/{id}',
    config: {
      validate: {
        params: {
          id: Joi.number().integer().required(),
        },
      },
      handler: (request, reply) => {
        const { id } = request.params;
        const length = todo.length;

        if (id >= length) {
          return reply('Invalid Id of TODO.');
        }

        return reply(todo[id]);
      },
    }
  },
  // Update a todo with id.
  {
    method: 'PUT',
    path: '/todo/{id}',
    config: {
      validate: {
        params: {
          id: Joi.number().integer().required(),
        },
        payload: {
          text: Joi.string().required(),
        },
      },
      handler: (request, reply) => {
        const { id } = request.params;
        const { text } = request.payload;
        const length = todo.length;

        if (id >= length) {
          return reply('Invalid Id of TODO.');
        }

        todo = [
          ...todo.slice(0, id),
          { id, text },
          ...todo.slice(id + 1, length),
        ];

        return reply(`Successfuly updated todo with id: ${id}`);
      },
    }
  },
  // Delete a todo with id.
  {
    method: 'DELETE',
    path: '/todo/{id}',
    config: {
      validate: {
        params: {
          id: Joi.number().integer().required(),
        },
      },
      handler: (request, reply) => {
        const { id } = request.params;
        const length = todo.length;

        if (id >= length) {
          return reply('Invalid Id of TODO.');
        }

        todo = [
          ...todo.slice(0, id),
          ...todo.slice(id + 1, length),
        ];

        return reply(`Successfuly deleted todo with id: ${id}`);
      },
    },
  },
]);

async function start() {
  try {
    await server.start();

  } catch (error) {
    console.error(error);
  }
  console.log(`Server is running at ${server.info.uri}`);
}