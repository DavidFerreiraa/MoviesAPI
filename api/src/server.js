const express = require("express");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(routes);
app.use((error, response) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    } else {
        console.log(error)

        return response.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
})

const PORT = 3333;
app.listen(PORT, console.log(`App listening on port: ${PORT}`));
