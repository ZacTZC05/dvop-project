class Subject {

    constructor(name, description) {

        this.name = name;

        this.description = description;

        const timestamp = new Date().getTime();

        const random = Math.floor(Math.random() * 1000);

        this.id = timestamp + "" + random.toString().padStart(3, '0');
    }
}

module.exports = { Subject };