// persistenter Speicher fuer die dauernden Spieldaten
function Storage() {};

// speichert ein Key-Value-Paar
Storage.write = function(key, data) {
    localStorage.setItem(key, data.toSource());
    return true;
}

// holt anhand eines Keys den dazugehoerigen Wert
Storage.read = function(key) {
    data = localStorage.getItem(key);
    return eval(data);
}