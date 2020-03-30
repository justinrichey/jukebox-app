function generateGroup() {

    //send to server once database schema decided
    var groupName = document.getElementById('group_name').value;
    window.location.href = '/create_pin.html';
}

function presentPIN() {
    
    //Eventually put this on java serverside code once database schema decided
    var alphaNumeric = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var PIN = '';
    for(var i = 0; i < 6; i++) {
        PIN += alphaNumeric[Math.floor(Math.random() * alphaNumeric.length)];
    }
    document.getElementById('PIN').textContent = PIN;
}
