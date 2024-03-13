function verifyEmail(email){
    emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
    return emailRegex.test(email)
}

module.exports = verifyEmail;
