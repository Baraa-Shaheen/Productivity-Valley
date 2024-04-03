// import axios from 'axios';
const axios = require('axios');


const apiUrl = 'http://localhost:8000/users/';
const apiUrlalt = 'http://localhost:8000/user-decorations/';
const apiUrlalt1 = 'http://localhost:8000/user-crops/';


class UserData {     //works
    fetchData(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                //console.log('Data fetched successfully:', data);
                return data;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                throw error;
            });
        }
    createUser(url, data) {      //works
        axios.post(url, data)
            .then(response => {
                console.log('User created successfully:', response.data);
            })
            .catch(error => {
                console.error('Error creating user:', error);
            });
    }
    deleteUser(url, username) {     //works
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username })
        };
        return fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('User deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    }
    fetchUserDecorations(username){   //works
        const url = `http://localhost:8000/user-decorations/?username=${username}`;

        return axios.get(url)
            .then(response => {
                console.log(response.data)
                return response.data;
            })
            .catch(error => {
                console.error('Error fetching user decorations:', error);
                throw error;
            });
    }
    addUserDecoration(url, data) {   //works
        axios.post(url, data)
            .then(response => {
                console.log('Decoration added successfully:', response.data);
            })
            .catch(error => {
                console.error('Error adding decoration for user:', error);
            });
    }
    fetchUserCrops(username){    //works
        const url = `http://localhost:8000/user-crops/?username=${username}`;

        return axios.get(url)
            .then(response => {
                console.log(response.data)
                return response.data;
            })
            .catch(error => {
                console.error('Error fetching user crops:', error);
                throw error;
            });
    }
    addUserCrop(url, data) {     //works
        axios.post(url, data)
            .then(response => {
                console.log('Crop added successfully:', response.data);
            })
            .catch(error => {
                console.error('Error adding decoration for user:', error);
            });
    }
    
    changeUserMoney(username, money) {
        const url = `http://localhost:8000/users/change-money/`;
    
        const requestData = {
            username: username,
            money: money
        };
        console.log(requestData)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Money updated successfully');
        })
        .catch(error => {
            console.error('Error updating money:', error);
        });
    }
    getuserDates(username) {
        const url = `http://localhost:8000/user-dates/?username=${username}`;

        return axios.get(url)
            .then(response => {
                console.log(response.data)
                return response.data;
            })
            .catch(error => {
                console.error('Error fetching user dates:', error);
                throw error;
            });
    }
    addUserDate(data) {
        const url = 'http://localhost:8000/user-dates/'
        axios.post(url, data)
        .then(response => {
            console.log('Date added successfully:', response.data);
        })
        .catch(error => {
            console.error('Error adding decoration for user:', error);
        });
    }

}

//export default UserData;

const newUserDec = {
    username: 'johndoe',
    decoration: 'Table',
    coordinates: '55x55'
};
const newUserCrop = {
    username: 'johndoe',
    crop: 'Corn',
};
// const today = new Date();
// const year = today.getFullYear();
// const month = today.getMonth() + 1;
// const day = today.getDate();
// const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
// console.log(formattedDate)
// const newUserDate = {
//     username: 'johndoe',
//     date: formattedDate
// };
const newUser = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'johndoe@example.com',
};
const newUser2 = {
    firstName: 'Joe',
    lastName: 'Jackson',
    username: 'joejacko',
    email: 'joejacko@example.com',
};
const userData = new UserData();
//userData.addUserDate(newUserDate)
userData.changeUserMoney('johndoe', 50)
//userData.addUserCrop(apiUrlalt1, newUserCrop)
//userData.fetchUserCrops(newUserCrop.username)
//userData.createUser(apiUrl, newUser2)
// userData.deleteUser(apiUrl, 'johndoe')
//     .then(() => {
//         console.log('User deleted successfully');
//         // Fetch data after successful deletion
//         userData.fetchData(apiUrl)
//             .then(data => {
//                 console.log('Data fetched successfully:', data);
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
//     })
//     .catch(error => {
//         console.error('Error deleting user:', error);
//     });