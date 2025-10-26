// Mock данные
const mockData = {
  posts: [
    { id: 1, title: 'Short', body: 'Content 1', userId: 1 },
    { id: 2, title: 'Very long title here', body: 'Content 2', userId: 1 },
    { id: 3, title: 'Medium title', body: 'Content 3', userId: 2 },
    { id: 4, title: 'Extremely long title for testing purposes', body: 'Content 4', userId: 2 }
  ],
  comments: [
    { id: 1, name: 'Bob Smith', email: 'bob@test.com', body: 'Comment 1', postId: 1 },
    { id: 2, name: 'Alice Johnson', email: 'alice@test.com', body: 'Comment 2', postId: 1 },
    { id: 3, name: 'Charlie Brown', email: 'charlie@test.com', body: 'Comment 3', postId: 2 },
    { id: 4, name: 'Diana Prince', email: 'diana@test.com', body: 'Comment 4', postId: 3 }
  ],
  users: [
    { id: 1, name: 'John Doe', username: 'johndoe', email: 'john@test.com', phone: '123-456', website: 'john.com', address: { city: 'City' }, company: { name: 'Company' } },
    { id: 2, name: 'Jane Smith', username: 'janesmith', email: 'jane@test.com', phone: '789-012', website: 'jane.com', address: { city: 'Town' }, company: { name: 'Corp' } },
    { id: 3, name: 'Mike Johnson', username: 'mikej', email: 'mike@test.com', phone: '345-678', website: 'mike.com', address: { city: 'Village' }, company: { name: 'Inc' } }
  ],
  todos: [
    { id: 1, title: 'Task 1', completed: false, userId: 1 },
    { id: 2, title: 'Task 2', completed: true, userId: 1 },
    { id: 3, title: 'Task 3', completed: false, userId: 2 },
    { id: 4, title: 'Task 4', completed: true, userId: 2 },
    { id: 5, title: 'Task 5', completed: false, userId: 3 }
  ]
};

// --- Базовые функции ---
function makeRequest(url, callback) {
  setTimeout(() => {
    const endpoint = url.split('/').pop();
    const data = mockData[endpoint];
    data ? callback(null, structuredClone(data))
         : callback(new Error(`Endpoint ${endpoint} not found`), null);
  }, 100);
}

function makePromiseRequest(url) {
  return new Promise((resolve, reject) => {
    makeRequest(url, (err, data) => (err ? reject(err) : resolve(data)));
  });
}

// --- Callback API ---
function getPostsSortedByTitleLength(callback) {
  makeRequest('https://jsonplaceholder.typicode.com/posts', (err, posts) => {
    if (err) return callback(err);
    callback(null, posts.sort((a, b) => b.title.length - a.title.length));
  });
}

function getCommentsSortedByAuthorName(callback) {
  makeRequest('https://jsonplaceholder.typicode.com/comments', (err, comments) => {
    if (err) return callback(err);
    callback(null, comments.sort((a, b) => a.name.localeCompare(b.name)));
  });
}

// --- Promise API ---
function getUsersWithSelectedFields() {
  return makePromiseRequest('https://jsonplaceholder.typicode.com/users')
    .then(users =>
      users.map(({ id, name, username, email, phone }) => ({ id, name, username, email, phone }))
    );
}

function getTodosFilteredByCompleted() {
  return makePromiseRequest('https://jsonplaceholder.typicode.com/todos')
    .then(todos => todos.filter(todo => !todo.completed));
}

// --- Async/Await API ---
const getPostsSortedByTitleLengthAsync = async () =>
  (await makePromiseRequest('https://jsonplaceholder.typicode.com/posts'))
    .sort((a, b) => b.title.length - a.title.length);

const getCommentsSortedByAuthorNameAsync = async () =>
  (await makePromiseRequest('https://jsonplaceholder.typicode.com/comments'))
    .sort((a, b) => a.name.localeCompare(b.name));

const getUsersWithSelectedFieldsAsync = async () =>
  (await makePromiseRequest('https://jsonplaceholder.typicode.com/users'))
    .map(({ id, name, username, email, phone }) => ({ id, name, username, email, phone }));

const getTodosFilteredByCompletedAsync = async () =>
  (await makePromiseRequest('https://jsonplaceholder.typicode.com/todos'))
    .filter(todo => !todo.completed);

// --- Главная функция ---
async function main() {
  console.log('=== Демонстрация работы ===\n');

  // === CALLBACKS ===
  console.group('Работа с коллбэками');
  await new Promise(res => {
    getPostsSortedByTitleLength((err, posts) => {
      if (err) return console.error(err);
      console.log('✓ Posts по длине title:');
      posts.forEach(p => console.log(`- ${p.title} (${p.title.length})`));
      res();
    });
  });

  await new Promise(res => {
    getCommentsSortedByAuthorName((err, comments) => {
      if (err) return console.error(err);
      console.log('\n✓ Comments по имени автора:');
      comments.forEach(c => console.log(`- ${c.name}`));
      res();
    });
  });
  console.groupEnd();

  // === PROMISES ===
  console.group('\nРабота с промисами');
  const users = await getUsersWithSelectedFields();
  console.log(`✓ Users (${users.length}):`);
  users.forEach(u => console.log(`- ${u.name} (${u.email})`));

  const todos = await getTodosFilteredByCompleted();
  console.log(`\n✓ Todos (невыполненные): ${todos.length}`);
  todos.forEach(t => console.log(`- ${t.title}`));
  console.groupEnd();

  // === ASYNC/AWAIT ===
  console.group('\nРабота с async/await');
  const [postsAsync, commentsAsync, usersAsync, todosAsync] = await Promise.all([
    getPostsSortedByTitleLengthAsync(),
    getCommentsSortedByAuthorNameAsync(),
    getUsersWithSelectedFieldsAsync(),
    getTodosFilteredByCompletedAsync()
  ]);

  console.log(`✓ Posts (async): ${postsAsync.length}`);
  console.log(`✓ Comments (async): ${commentsAsync.length}`);
  console.log(`✓ Users (async): ${usersAsync.length}`);
  console.log(`✓ Todos (async): ${todosAsync.length}`);
  console.groupEnd();

  console.log('\n=== Все операции завершены успешно! ===');
}

// Запуск
main().catch(console.error);