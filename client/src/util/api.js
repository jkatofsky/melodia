export let SERVER_URL;
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    SERVER_URL = "http://localhost:5000";
} else {
    SERVER_URL = "https://melodia.appspot.com";
}