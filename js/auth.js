const Auth = {
    register(type, data) {
        const storageKey = type === 'admin' ? 'dora_admins' : 'dora_students';
        const users = JSON.parse(localStorage.getItem(storageKey)) || [];

        if (users.find(u => u.email === data.email)) {
            return { success: false, message: 'User already exists' };
        }

        users.push(data);
        localStorage.setItem(storageKey, JSON.stringify(users));
        return { success: true };
    },

    login(type, email, password) {
        const storageKey = type === 'admin' ? 'dora_admins' : 'dora_students';
        const users = JSON.parse(localStorage.getItem(storageKey)) || [];

        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            sessionStorage.setItem('dora_user', JSON.stringify({ ...user, type }));
            return { success: true };
        }
        return { success: false, message: 'Invalid email or password' };
    },

    logout() {
        sessionStorage.removeItem('dora_user');
        window.location.href = '../index.html';
    },

    getUser() {
        return JSON.parse(sessionStorage.getItem('dora_user'));
    },

    checkAuth(type) {
        const user = this.getUser();
        if (!user || user.type !== type) {
            window.location.href = 'login.html';
        }
        return user;
    }
};
