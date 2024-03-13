const knex = require("../database/knex");
const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UsersController {
    async create(request, response) {
        const { name, email, password, avatar } = request.body;

        const userExists = await knex.select().from("users").where("email", email.toLowerCase());
        console.log(userExists)

        if (userExists.length) {
            throw new AppError("This e-mail is already used.");
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

    async update(request, response) {
        const { name, email, password, old_password, avatar } = request.body;
        const { id } = request.params;

        const user = await knex.select().from("users").where("id", id);

        if (!user.length) {
            throw new AppError("User not found.")
        }

        const checkUserEmail = await knex.select().from("users").where("email", email.toLowerCase());

        
        if (checkUserEmail.length && checkUserEmail[0].id !== user[0].id) {
            throw new AppError("This email is already used.")
        }
        
        user[0].name = name ?? user[0].name;
        user[0].email = email.toLowerCase() ?? user[0].email;
        user[0].avatar = avatar ?? user[0].avatar;

        if (password && !old_password) {
            throw new AppError("You need insert the old password to update your password.");
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user[0].password);

            if (!checkOldPassword) {
                throw new AppError("Your old password don't match.")
            }

            user[0].password = await hash(password, 8);
        }

        await knex("users").update({
            ...user[0],
            updated_at: knex.fn.now()
        }).where("id", user[0].id)

        return response.json();
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("users").where("id", id).delete();

        return response.json();
    }
}

module.exports = UsersController;
