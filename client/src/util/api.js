export let SERVER_URL;
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    SERVER_URL = "http://localhost:5000";
} else {
    SERVER_URL = "https://mchacks-melodia.appspot.com";
}

export async function apiCall(endpoint) {
    const response = await fetch(`${SERVER_URL}/api/${endpoint}`);
    if (response.status !== 200) return null;
    return await response.json();
}