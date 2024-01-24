const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mohamad',
});
let newDatabase = false;
db.query('CREATE DATABASE IF NOT EXISTS chat_app', (createDbErr) => {
  if (createDbErr) {
    console.error('Error creating database:', createDbErr);
    return;
  }
  console.log('Database created or already exists');

  db.query('USE chat_app', (useDbErr) => {
    if (useDbErr) {
      console.error('Error using database:', useDbErr);
      return;
    }
    console.log(newDatabase);
    db.query(
      `CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_picture LONGBLOB
);`,
      (createTableErr) => {
        if (createTableErr) {
          console.error('Error creating table:', createTableErr);
          return;
        }
        console.log('users Table created or already exists');
        db.query(
          `CREATE TABLE IF NOT EXISTS conversations (
    conversation_id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT,
    user2_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_pair (user1_id, user2_id),
    FOREIGN KEY (user1_id) REFERENCES users(user_id),
    FOREIGN KEY (user2_id) REFERENCES users(user_id)
);`,
          (createTableErr) => {
            if (createTableErr) {
              console.error(
                'Error creating conversations table:',
                createTableErr,
              );
              return;
            }
            console.log('conversations table created or already exists');
            db.query(
              `CREATE TABLE IF NOT EXISTS messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT,
    sender_id INT,
    content TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id),
    FOREIGN KEY (sender_id) REFERENCES users(user_id)
);`,
              (createTableErr) => {
                if (createTableErr) {
                  console.error('Error creating files table:', createTableErr);
                  return;
                }

                console.log('messages table created or already exists');
              },
            );
          },
        );
      },
    );

    console.log('Using the chat_app database');
  });
});

// Export the pool to be used in other parts of your application
module.exports = db.promise();
