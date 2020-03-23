//funcao que retorna um middleware onde so vai ser chamado se o user for um administrador
module.exports = middleware => {
    return (req, res, next) => {
        if (req.user.admin == 'true') {
            middleware(req, res, next)
        } else {
            res.status(401).send('Usuário não é administrador.')
        }
    }
}