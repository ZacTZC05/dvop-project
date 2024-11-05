class Task {
    constructor(name, Subject) {
        this.name = name;
        this.Subject = Subject;
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        this.id = timestamp + "" + random.toString().padStart(3, '0');
    }
}

module.exports = { Task };
