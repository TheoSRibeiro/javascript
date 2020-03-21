module.exports = app => {
    const {existsOrError} = app.api.validation

    const save = (req,res) => {
        const article = {...req.body}

        if(req.params.id) article.id = req.params.id
        
        try {
            existsOrError(article.name, 'Nome não informado')
            existsOrError(article.description,'Descrição não informada')
            existsOrError(article.categoryId, 'Categoria não informada')
            existsOrError(article.userId, 'Autor não informado')
            existsOrError(article.content, 'Conteúdo não informado')
        } catch(msg){
            res.status(400).send(msg)
        }

        if(article.id){
            app.db('articles')
                .update(article)
                .where({id: article.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }else{
            app.db('articles')
                .insert(article)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async(req,res) => {
        try{
            const rowsDeleted = await app.db('articles')
                .where({id: req.params.id}).del()
            try{
                existsOrError(rowsDeleted, 'Artigo não encontrado')
            } catch (msg) {
                return res.status(400).send(msg) //usuario passou um id nao existente no BD
            }

            res.status(204).send()
        }catch(msg){
            res.status(500).send(msg)
        }
    }

    const limit = 10 //10 artigos por pagina
    
    const get = async(req,res) => {
        const page = req.query.page || 1  //vai para a pagina que o user pedir ou para a primeira como defaul

        const result = await app.db('articles').count('id').first()
        const count = parseInt(result.count)

        app.db('articles')
            .select('id', 'name', 'description')
            .limit(limit).offset(page * limit - limit) //limitando sempre entre 10 indices por pagina
            .then(articles => res.json( {data: articles, count, limit} ))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req,res) => {
        app.db('articles')
            .where( {id: req.params.id} )
            .first()
            .then(article => {
                article.content = article.content.toString()
                return res.json(article)
            })
            .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById}
}

