    class Task {
        constructor(name, subjectid) {
            this.name = name;
            this.subjectid = subjectid;
            const timestamp = new Date().getTime();
            const random = Math.floor(Math.random() * 1000);
            this.id = timestamp + "" + random.toString().padStart(3, '0');
        }
    }

    module.exports = { Task };