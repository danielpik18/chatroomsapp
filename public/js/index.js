const socket = io();

socket.on('connect', rooms => {

    console.log('Connected');

    socket.on('activeRooms', rooms => {
        const roomsDOM = document.getElementById('activeRooms');
        let html, sortedRooms;

        //Sort array by users length
        sortedRooms = rooms.sort((a, b) => (b.users.length > a.users.length) ? 1 : ((a.users.length > b.users.length) ? -1 : 0));

        //default option
        roomsDOM.innerHTML = null;

        sortedRooms.forEach(room => {
            html = `<option value="${room.name}">${room.name} (${room.users.length} people)</option>`;
            roomsDOM.insertAdjacentHTML('beforeend', html);
        });
    })


});