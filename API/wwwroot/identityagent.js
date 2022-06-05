class IdentityAgent {
    constructor() {
        this.baseUrl = 'https://solivern.com/api/account/';
        //first check if a token is available in local storage
        this.token = this.getToken();
    };

    login = function(email, password) {
        return this.fetch('login', {
            email: email,
            password: password
        });
    }

    register = function(email, username, password) {
        return this.fetch('register', {
            email: email,
            password: password,
            username: username
        });
    }

    getToken = function() {
        if (this.token) {
            return this.token;
        } else {
            return window.localStorage.getItem('gamejwt');
        }
    };

    setToken = function(token) {
        this.token = token;
        window.localStorage.setItem('gamejwt', token);
    }

    clearToken = function() {
        window.localStorage.removeItem('gamejwt');
    }

    fetch = async function(endpoint, body) {
        let headers = {};

        if (this.token) {
            headers['Authorization'] = 'Bearer ' + this.token;
        }

        if (body) {
            headers['Content-Type'] = 'application/json';
            const response = await fetch(this.baseUrl + endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });
            return response.json();
        } else {
            const response = await fetch(this.baseUrl + endpoint, {
                method: 'GET',
                headers: headers
            });
            return response.json();
        }
    };

    getUserData = function() {
        return this.fetch('', undefined);
    };

    saveGameData = function(gameData) {
        let headers = {};

        if (this.token) {
            headers['Authorization'] = 'Bearer ' + this.token;
        }

        var dto = {
            gameData : JSON.stringify(gameData)
        }

        headers['Content-Type'] = 'application/json';
        return fetch(this.baseUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(dto)
        });
    }
}