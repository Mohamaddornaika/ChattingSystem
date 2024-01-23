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
          `CREATE TABLE IF NOT EXISTS chats (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    chat_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
          (createTableErr) => {
            if (createTableErr) {
              console.error('Error creating chats table:', createTableErr);
              return;
            }
            console.log('chats table created or already exists');
            db.query(
              `CREATE TABLE IF NOT EXISTS user_chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    chat_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id),
    UNIQUE KEY unique_user_chat (user_id, chat_id)
);`,
              (createTableErr) => {
                if (createTableErr) {
                  console.error('Error creating files table:', createTableErr);
                  return;
                }

                console.log('user_chats table created or already exists');
                db.query(
                  `CREATE TABLE IF NOT EXISTS messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT,
    user_id INT,
    content TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats(chat_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);`,
                  (createTableErr) => {
                    if (createTableErr) {
                      console.error(
                        'Error creating messages table:',
                        createTableErr,
                      );
                      return;
                    }
                    console.log('messages table created or already exists');
                  },
                );
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
