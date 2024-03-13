const knex = require("../database/knex");
const { hash } = require("bcryptjs");

class UsersController {
    async create(request, response) {
        const { name, email, password, avatar } = request.body;

        const userExists = await knex.select().from("users").where("email", email.toLowerCase());
        console.log(userExists)

        if (userExists.length) {
            throw new Error("This e-mail is already used.");
        }

        const hashedPassword = await hash(password, 8);

        await knex("users").insert({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            avatar
        })

        return response.json()
    }
}

module.exports = UsersController;
