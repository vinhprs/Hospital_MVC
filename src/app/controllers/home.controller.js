class HomeController {

    // [GET] /
    
    static index(req, res, next)  {
        res.render('home')
    }
}

module.exports =  HomeController