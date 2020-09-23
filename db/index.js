const {Pool} = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


const connect = async () => {
      const client = await pool.connect();
      // console.log('connected to Postgres database...');
      return client;
}

const disconnect = async (client) => {
    if (client) {
        await client.release();
        // console.log("disconnected from Postgres database...");
    }
}

const end = async () => {
  pool.end(() => {
    console.log("Postgres database pool has ended");
  });
};

const getContacts = async () => {

    const query = 'SELECT * FROM CONTACTS'; 
    
    let client;
    let result;

    try {
      client = await connect();
      const response = await client.query(query);
      console.log('Results: ', response.rows);
      result = response.rows;
    } catch (err) {
      console.log('Database error: ', err.message);
      throw err;
    } finally {
      await disconnect(client);
    }

    return result;
}

const addContact = async (contact) => {
    console.log('Add contact ', contact);

    const query = {
      text:
        "INSERT INTO CONTACTS (NAME, EMAIL) VALUES ($1, $2) RETURNING *",
      values: [contact.name, contact.email],
    }; 
    
    let client;
    let result;

    try {
      client = await connect();
      const response = await client.query(query);
      console.log('Result: ', response.rows[0]);
      result = response.rows[0];
    } catch (err) {
        console.log('Database error: ', err.message);
        throw err;
    } finally {
        await disconnect(client);
    }

    return result;
}

const updateContact = async (contact) => {
    console.log('Update contact ', contact);

    const query = {
      text:
        "UPDATE CONTACTS SET NAME = $1, EMAIL=$2 WHERE ID=$3 RETURNING *",
      values: [contact.name, contact.email, contact.id],
    }; 
    
    let client;
    let result;

    try {
      client = await connect();
      const response = await client.query(query);
      console.log('Result: ', response.rows[0]);
      result = response.rows[0];
    } catch (err) {
        console.log('Database error: ', err.message);
        throw err;
    } finally {
        await disconnect(client);
    }

    return result;
}

const deleteContact = async (id) => {
    console.log('Delete contact ', id);

    const query = {
      text:
        "DELETE FROM CONTACTS WHERE ID=$1 RETURNING *",
      values: [id],
    }; 
    
    let client;
    let rowCount,result;

    try {
      client = await connect();
      const response = await client.query(query);
      console.log('Result: ', response.rows[0]);
      rowCount = response.rowCount;
    } catch (err) {
        console.log('Database error: ', err.message);
        throw err;
    } finally {
        await disconnect(client);
    }

    result = rowCount ? true: false;
    console.log('Row(s) deleted: ', result);

    return result;
}

const getContactsByName = async (name) => {

  const query = {
    text: "SELECT * FROM CONTACTS WHERE NAME = $1",
    values: [name],
  }; 
  
  let client;
  let result;

  try {
    client = await connect();
    const response = await client.query(query);
    console.log('Contacts by name: ', response.rows);
    result = response.rows;
  } catch (err) {
    console.log('Database error: ', err.message);
    throw err;
  } finally {
    await disconnect(client);
  }

  return result;
}

const getContactsByEmail = async (email) => {

  const query = {
    text: "SELECT * FROM CONTACTS WHERE EMAIL = $1",
    values: [email],
  }; 
  
  let client;
  let result;

  try {
    client = await connect();
    const response = await client.query(query);
    console.log('Contacts by email: ', response.rows);
    result = response.rows;
  } catch (err) {
    console.log('Database error: ', err.message);
    throw err;
  } finally {
    await disconnect(client);
  }

  return result;
}

const getContactsCount = async () => {

  const query = "SELECT COUNT(*) FROM CONTACTS"; 
  
  let client;
  let result;

  try {
    client = await connect();
    const response = await client.query(query);
    // console.log('Results: ', response.rows);
    result = response.rows[0].count;
  } catch (err) {
    console.log('Database error: ', err.message);
    throw err;
  } finally {
    await disconnect(client);
  }

  console.log('Count: ', result);

  return result;
}

module.exports = {
    getContacts,
    addContact,
    updateContact,
    deleteContact,
    getContactsCount,
    getContactsByName,
    getContactsByEmail,
}

// connect();
// getContacts();
// addContact({name: 'testaaa testaaa', email: 'testaaa@test.com'});
// updateContact({id: 3, name: 'test test2', email: 'test_upd@test.com'})
// deleteContact(3);
// getContactsCount();
// getContactsByName('Andi Cirjaliu');
// getContactsByEmail('nykolet2@gmail.com');

