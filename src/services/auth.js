export const authService = {
    register(userData){
        return new Promise((resolve, reject) => {

            const userGuest = localStorage.getItem('bookstore_guest_session');

            console.log(userGuest, 'userGuest')

            if (userGuest) {
                try {
                    const guestData = JSON.parse(userGuest);
                    const users = this.getUsers();

                    if (users.find(user => user.email === userData.email)) {
                        reject(new Error(`Такий користувач ${userData.email} вже Є`));
                        return;
                    }

                    const newUser = {
                        id: Date.now(),
                        name: userData.name,
                        email: userData.email,
                        password: userData.password,
                        checkPassword: userData.checkPassword,
                        createdAt: new Date().toDateString(),
                        isActive: true,
                        books: [...guestData.books]
                    };

                    console.log(newUser, 'newUser');

                    users.push(newUser);
                    localStorage.setItem('bookstore_users', JSON.stringify(users));

                    localStorage.removeItem('bookstore_guest_session');

                    this.login(userData.email, userData.password).then(resolve).catch(reject);

                } catch (error) {
                    reject(new Error('Помилка обробки гостевой сесії'));
                }

            } else {
                try {
                    const users = this.getUsers()

                    if (users.find(user=>user.email === userData.email)) {
                        reject (new Error('Такий користувач вже Є'))
                    }

                    const newUser = {
                        id: Date.now(),
                        ...userData,
                        createdAt: new Date().toDateString(),
                        isActive: true,
                        books: [],
                    }

                    users.push(newUser)
                    localStorage.setItem('bookstore_users', JSON.stringify(users))

                    this.login(userData.email, userData.password).then(resolve).catch(reject)
                }
                catch (e) {
                    reject(e)
                }
            }
        })
    },

    login(email, password){
        return new Promise((resolve, reject)=>{
            try {
                const users = this.getUsers()

                const user = users.find(user => user.email === email && user.password === password && user.isActive)

                if (user) {
                    const userSession = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        role: user.role || 'user',
                        books: user.books
                    }
                    localStorage.setItem('bookstore_current_user', JSON.stringify(userSession))
                    resolve(userSession) // посмотреть почему может быть ошибка

                } else {
                    reject (new Error('Невірний email або пароль'))
                }
            } catch (e) {
                reject(e)
            }
        })
    },

    logout(){
        const user =  this.getCurrentUser()
        const users = this.getUsers()

        const updateUsers =  users.map(userList =>{
            if (userList.id === user.id) {
                userList.books = user.books
                return {
                    ...userList,
                    books: user.books
                }
            }
            return userList
        })
        localStorage.setItem('bookstore_users', JSON.stringify(updateUsers))


        localStorage.removeItem('bookstore_current_user')
        return Promise.resolve()
    },

    getUsers() {
        try {
            return JSON.parse(localStorage.getItem('bookstore_users') || '[]')
        } catch {
            return []
        }
    },

    getCurrentUser() {
        try {
            const user = localStorage.getItem('bookstore_current_user');
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    },
}