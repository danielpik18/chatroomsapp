const socket = io();

socket.on('connect', function () {
    $('[data-toggle="tooltip"]').tooltip();

    console.log('Conntected to server');

    let params = deparam(window.location.search);

    if (!params.room && !params.active_room) {
        alert('Must enter a valid room.');
        window.location.href = './';
    } else if (!params.room) {
        params.room = params.active_room.toLowerCase();
    }

    params.name = params['?name'].toLowerCase();

    delete params['?name'];
    delete params.active_room;

    console.log('PARAMS SENT FROM FRONT END', params);

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = './';
        } else {
            console.log('No errors joining the room.');
        }
    });
});

socket.on('updateUserList', users => {
    //Get DOM element
    const peopleList = document.getElementById('people');
    const peopleInRoom = document.getElementById('peopleList');

    //Clear lists
    peopleList.innerHTML = null;
    peopleInRoom.innerHTML = null;

    //Render users
    users.forEach(user => {
        peopleList.insertAdjacentHTML('beforeend', `<li class="text-secondary"><i class="far fa-user pr-3"></i>${user}</li>`);
        peopleInRoom.insertAdjacentHTML('beforeend', `<p class="text-secondary"><i class="far fa-user p-2 mr-2"></i>${user}</p>`);
    });
});

socket.on('disconnect', function () {
    console.log('Lost connection to server.');
});


//  ------------------------------------------------------------------------

//Recieving message event on front end
socket.on('newMessage', function (msg, callback) {
    console.log(`${msg.from}: ${msg.text}`);
    const formatedDate = moment(msg.createdAt).format('h:mm a');

    const messagesBox = document.querySelector('#messages');
    const html = `
                    <div class="d-flex flex-column flex-lg-row justify-content-between">
                            <p style="width: 90%; overflow-wrap: break-word;"><b class="mr-2">${msg.from}:</b>${msg.text}</p>
                            <p class="text-secondary"><small>${formatedDate}</small></p>
                    </div>
                `;

    messagesBox.insertAdjacentHTML('beforeend', html);

    //Scroll to bottom of messages div
    messagesBox.scrollTop = messagesBox.scrollHeight;


    // --------
    if (callback) callback();
});

//Recieving room message event on front end
socket.on('newRoomMessage', function (msg, callback) {
    console.log(`${msg.from}: ${msg.text}`);
    const formatedDate = moment(msg.createdAt).format('h:mm a');

    const messagesBox = document.querySelector('#messages');
    const html = `
                    <div class="d-flex flex-column flex-lg-row border-bottom p-2 my-2 text-dark justify-content-between"
                        style="background: rgb(212,212,212);
                                background: linear-gradient(90deg, rgba(212,212,212,1) 0%, rgba(226,226,226,1) 100%);">
                            <p class="text-success">${msg.text}</p>
                            <p class="text-secondary">${formatedDate}</p>
                    </div>
                `;

    messagesBox.insertAdjacentHTML('beforeend', html);

    //Scroll to bottom of messages div
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // --------
    if (callback) callback();
});

//Recieving user-disconnect message event on front end
socket.on('newLeaveMessage', function (msg, callback) {
    const formatedDate = moment(msg.createdAt).format('h:mm a');

    const messagesBox = document.querySelector('#messages');
    const html = `
                    <div class="d-flex flex-column flex-lg-row border-bottom p-2 my-2 text-dark justify-content-between"
                        style="background: rgb(212,212,212);
                                background: linear-gradient(90deg, rgba(212,212,212,1) 0%, rgba(226,226,226,1) 100%);">
                            <p class="text-danger">${msg.text}</p>
                            <p class="text-secondary">${formatedDate}</p>
                    </div>
                `;

    messagesBox.insertAdjacentHTML('beforeend', html);

    //Scroll to bottom of messages div
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // --------
    if (callback) callback();
});

//Recieving new location msg event on fron end
socket.on('newLocationMessage', (msg, callback) => {
    console.log(`${msg.from}: ${msg.url}`);
    const formatedDate = moment(msg.createdAt).format('h:mm a');

    const messagesBox = document.querySelector('#messages');
    const html =
        `
                    <div>
                        <div class="d-flex justify-content-between">
                            <div class="d-flex">
                                <b class="mr-2">${msg.from}:</b>
                                <a href="${msg.url}" target="_blank"><i
                                class="fas fa-map-marker-alt pr-1"></i>My current location</a>
                            </div>
                        <div>
                            <p class="text-secondary"><small>${formatedDate}</small></p>
                        </div>
                    </div>
                `;

    messagesBox.insertAdjacentHTML('beforeend', html);

    //Scroll to bottom of messages div
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // --------
    if (callback) callback();
});

//Handling messages sent by users
document.querySelector('.message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    socket.emit('createMessage', {
        text: document.querySelector('.message-box').value
    });

    document.querySelector('.message-box').value = '';
});

//Handling users sending their location
let locationBtn = document.querySelector('.location-btn');
locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation not supported by your browser.');
    }

    locationBtn.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });

        locationBtn.removeAttribute('disabled');
    }, () => {
        alert(`Couldn't fetch location.`);
        locationBtn.removeAttribute('disabled');
    });
});