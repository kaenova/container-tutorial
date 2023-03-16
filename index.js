'use strict';

const fs = require('fs');
const { nanoid } = require('nanoid');
const Hapi = require('@hapi/hapi');

// Function to get Phone Number from Database
function getPhoneNumber() {
  let jsonData = fs.readFileSync('data.json')
  let data = JSON.parse(jsonData)
  return data
}

// Function to delete Phone Number from Database
function deletePhoneNumber(id) {
  let jsonData = fs.readFileSync('data.json')
  let data = JSON.parse(jsonData)

  // search through data by looping
  const index = data.findIndex((temp) => temp.id === id)

  if (index === -1) {
    return false
  }

  data.splice(index, 1)
  jsonData = JSON.stringify(data)
  fs.writeFileSync('data.json', jsonData)
  return true
}

// Function to save Phone Number to Database
function savePhoneNumberToJson(name, phoneNumber) {
  let id = nanoid(8)
  let jsonData = fs.readFileSync('data.json')
  let data = JSON.parse(jsonData)
  data.push({
    "id": id,
    "name": name,
    "phone_number": phoneNumber
  })
  jsonData = JSON.stringify(data)
  fs.writeFileSync('data.json', jsonData)
}

const init = async () => {

  const server = Hapi.server({
    port: 3000,
    host: '0.0.0.0'
  });

  // Read all contacts
  server.route({
    method: 'GET',
    path: '/contacts',
    handler: () => {
      return getPhoneNumber()
    }
  });

  // Delete contacts
  server.route({
    method: 'DELETE',
    path: '/contacts/{contact_id}',
    handler: (request, h) => {

      // Get contact id from request
      const contactID = request.params.contact_id

      // Delete from database by contact id
      const success = deletePhoneNumber(contactID)

      // Check if successfully deleted
      if (!success) {
        const response = h.response({
          status: 'fail',
          message: 'Gagal delete kontak. Mohon isi id dengan benar'
        })
        response.code(400)
        return response
      }

      return 'Success';
    }
  });

    // Create contacts
    server.route({
      method: 'POST',
      path: '/contacts',
      handler: (request, h) => {
        
        // Get data
        const { name, phone_number } = request.payload
        
        // Check requested data
        if (name === undefined || name === '' || phone_number === undefined || phone_number === "") {
          const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan kontak. Mohon isi nama kontal dan nomor telepon.'
          })
          response.code(400)
          return response
        }
        
        // Save to database
        savePhoneNumberToJson(name, phone_number)
        
        return `Success`;
      }
    });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();

