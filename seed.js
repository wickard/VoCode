const snippetSamples = require('./script/snippets.json');
const _ = require('lodash');
const faker = require('faker');
faker.seed(619);

const { User, Snippet } = require('./server/db/models');
const db = require('./server/db/db');
const Promise = require('bluebird');

function generateSnippets() {
  let data = [];
  data = data.concat(snippetSamples);
  return data.map(snippet => {
    return Snippet.build(snippet);
  });
}

function generateUsers() {
  return _.times(4, () =>
    User.build({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.company.bsBuzz() + faker.address.country(),
      passwordUpdateDate: faker.date.recent(100),
      mailingAddress: `${faker.address.streetAddress()}\n${faker.address.city()}, ${faker.address.stateAbbr()} ${faker.address.zipCode()}`
    })
  );
}

async function generateGuest() {
  return User.create({
    firstName: 'Thomas',
    lastName: 'Bangalter',
    email: 'guest@daft-thunk.com',
    password: '123',
    passwordUpdateDate: faker.date.recent(100),
    mailingAddress: `${faker.address.streetAddress()}\n$`
  });
}

function createSnippets() {
  return Promise.map(generateSnippets(), snippet => snippet.save());
}

function createUsers() {
  return Promise.map(generateUsers(), user => user.save());
}

async function associateSnippets() {
  const snippets = await Snippet.findAll();
  await snippets[0].addUsers([1, 2, 3]);
  await snippets[0].update({ creatorId: 1 });
  await snippets[1].addUsers([2, 3, 4]);
  await snippets[1].update({ creatorId: 3 });
  await snippets[2].addUsers([2, 4]);
  await snippets[2].update({ creatorId: 3 });
  await snippets[3].addUsers([1, 2, 3, 4]);
  await snippets[3].update({ creatorId: 2 });

  const rest = snippets.slice(4);

  await Promise.all(
    rest.map(item => {
      item.update({
        creatorId: faker.random.number({
          min: 1,
          max: 4
        })
      });
    })
  );
}

async function seed() {
  await db.sync({ force: true });

  console.log('seeding snippets');
  await createSnippets();

  console.log('seeding Users');
  await createUsers();

  console.log('add guest');
  await generateGuest();

  console.log('add associations');
  await associateSnippets();
}

seed()
  .catch(err => {
    console.error('Error while seeding');
    console.error(err.stack);
  })
  .then(() => console.log('Seeding successful'))
  .then(() => {
    db.close();
    return null;
  });
