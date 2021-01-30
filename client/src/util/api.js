export let SERVER_URL;
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    SERVER_URL = "http://localhost:5000";
} else {
    SERVER_URL = "https://melodia.appspot.com";
}

// TODO: test that this works for this backend
export async function apiCall(endpoint, data) {
    try {
        const response = await fetch(`${SERVER_URL}/${endpoint}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        return responseData;
    } catch (err) {
        console.log(err);
        return null;
    }
}