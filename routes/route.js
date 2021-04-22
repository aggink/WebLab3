const express = require("express");
const jsonParser = express.json();
const fs = require("fs");
const passport = require("passport");
const { send } = require("process");
const filePath = './DataBase/Records.json';

//чтение файла
function ReadFile(){
    var result = fs.readFileSync(filePath, "utf8");
    if(result){
        //если нет ошибок возвращаем распарсенный json файл
        return JSON.parse(result);
    }
    else{
        //если есть ошибка возвращаем массив
        let message = { status: 'error', code: 400, message: 'Ошибка'};
        return message;
    }
}

//ответ сервера в формате json
function Send(result, response){
    //преобразуем данные в json
    let data = JSON.stringify(result);
    //ответ сервера
    response.send(data);
}

const router = app => {

    //по умолчанию
    app.get('/', (req, res) => {
        console.log(`URL: ${req.url}`)
        if(req.user == undefined){
            res.render('./views/pages/index.ejs', { email: undefined });
        }
        else{
            console.log('User: ', req.user);
            res.render('./views/pages/index.ejs', { email: req.user.email });
        }
    });

    /* авторизация, регистрация */

    //страница авторизации
    app.get('/login', (req, res) => {
        console.log(`URL: ${req.url}`);
        if(req.user == undefined){
            res.render('./views/pages/logIn.ejs', { email: undefined });
        }
        else{
            res.render('./views/pages/logIn.ejs', { email: req.user.email });
        }
    });

    //страница регистрации
    app.get('/register', (req, res) => {
        console.log(`URL: ${req.url}`);
        if(req.user == undefined){
            res.render('./views/pages/register.ejs', { email: undefined });
        }
        else{
            res.render('./views/pages/register.ejs', { email: req.user.email });
        }
    });

    //метод для регистрации пользователя 
    app.post('/reg', (req, res, next) => {
        console.log(`URL: ${req.url}`);
        passport.authenticate('local-signup', function(err, user) {
            if(err){
                let er = { status: 'error', code: 400, message: 'Возникла непредвиденная ошибка!' };
                return res.send(er);
            }
            if(!user){
                let er = { status: 'error', code: 400, message: 'Возникла ошибка при регистрации!' };
                return res.send(er);
            }
            //авторизация пользователя
            req.logIn(user, function(err) {
                if(err){
                    let er = { status: 'error', code: 400, message: 'Возникла непредвиденная ошибка!' };
                    return res.send(er);
                }
                //перенаправление
                console.log('User: ', user);
                let otvet = {status: 'ok', code: 200, message: 'Регистрация прошла успешно!'};
                return res.send(otvet);
                //return res.redirect('/my-account');
            });
        })(req, res, next);
    });

    //метод для авторизации пользователя
    app.post('/auth', (req, res, next) => {
        console.log(`URL: ${req.url}`);
        passport.authenticate('local-login', function(err, user) {
            if(err){
                let er = { status: 'error', code: 400, message: 'Возникла непредвиденная ошибка!' };
                return res.send(er);
            }
            //если данные не найдены, возвращаем ошибку
            if(!user){
                let er = { status: 'error', code: 400, message: 'Укажите правильный email или пароль!' };
                return res.send(er);
            }
            //авторизация пользователя
            req.logIn(user, function(err){
                if(err){
                    let er = { status: 'error', code: 400, message: 'Возникла непредвиденная ошибка!' };
                    return res.send(er);
                }
                //перенаправление
                console.log('User: ', user);
                let otvet = {status: 'ok', code: 200, message: 'Авторизация прошла успешно!'};
                return res.send(otvet);
                //return res.redirect('/my-account');
            });
            
        })(req, res, next);
    });

    //проверка авторизации
    const auth =  (req, res, next) => {
        if(req.isAuthenticated()){
            //если прошли, то пробрасываем дальше
            next();
        }
        else{
            //если не прошли авторизацию возвращаем на страницу входа
            return res.redirect('/logIn');
        }
    };

    //страница аккаунта
    app.get('/my-account', (req, res, next) => {
        console.log(`URL: ${req.url}`);
        if(req.isAuthenticated()){
            console.log('User: ', req.user);
            res.render('./views/pages/my-account.ejs', { email: req.user.email, name: req.user.name } );
        }
        else{
            return res.redirect('/logIn');
        }
    });

    //метод для редактирование данных пользователя
    app.post('/regUpdate', auth, (req, res, next) => {
        console.log(`URL: ${req.url}`);
        passport.authenticate('local-update', function(err, user) {
            if(err){
                let er = { status: 'error', code: 400, message: 'Возникла непредвиденная ошибка!' };
                return res.send(er);
            }
            //если данные не найдены, возвращаем ошибку
            if(!user){
                let er = { status: 'error', code: 400, message: 'Возникла ошибка при смене пароля!' };
                return res.send(er);
            }
            if(user){
            //перенаправление
                console.log('User: ', user);
                let otvet = {status: 'ok', code: 200, message: 'Редактирование данных прошло успешно!'};
                return res.send(otvet);
                //return res.redirect('/my-account');
            }
        })(req, res, next);
    });

    app.get('/logout', (req, res) => {
        console.log(`URL: ${req.url}`);
        //работает не стабильно
        req.logOut();
        //вроде норм работает
        req.session.destroy(() => { 
            res.clearCookie('connect.sid'); 
            res.redirect('/');
        });
    });

    /* Взаимодействие с api */

    app.get('/everything', (request, response) => {
        const result = ReadFile();
        if(result['status'] == 'ok'){
            Send(result, response);
        }
        else{
            Send(result, response);
        }
    });

    app.get('/record/:id', (request, response) => {
        const id = request.params.id;

        const result = ReadFile();
        if(result['status'] == 'ok'){
            //поиск записи с заданным id
            let record = result.articles.find(x => x.id == id);
            if(record){
                //преобразуем данные в json
                let data = JSON.stringify(record);
                //ответ сервера
                response.send(data);
            }
            else{
                let er = {status: 'error', code: 400, message: 'Запись не найдена' }
                Send(er, response);
            }
        }
        else{
            Send(result, response);
        }
    });

    //получение нескольких записей по параметру
    app.get('/everything/:q', (request, response) => {
        const search = request.params.q;
        const id = request.params.id;

        const result = ReadFile();
        if(result['status'] == 'ok'){
            var records = {
                status: 'ok',
                articles: []
            };
            //пробегаем по всему массиву и ищем подходящие записи
            for(var i = 0; i < result['articles'].length; i++){
                let flag = false;
                if(result['articles'][i]['author'].includes(search) && flag === false){
                    flag = true;
                    let r = {
                        id: result['articles'][i]['id'],
                        author: result['articles'][i]['author'],
                        title: result['articles'][i]['title'],
                        description: result['articles'][i]['description'],
                        url: result['articles'][i]['url'],
                        urlToImage: result['articles'][i]['urlToImage'],
                        publishedAt: result['articles'][i]['publishedAt']
                    };
                    records.articles.push(r);
                }
                if(result['articles'][i]['title'].includes(search) && flag === false){
                    flag = true;
                    let r = {
                        id: result['articles'][i]['id'],
                        author: result['articles'][i]['author'],
                        title: result['articles'][i]['title'],
                        description: result['articles'][i]['description'],
                        url: result['articles'][i]['url'],
                        urlToImage: result['articles'][i]['urlToImage'],
                        publishedAt: result['articles'][i]['publishedAt']
                    };
                    records.articles.push(r);  
                }
                if(result['articles'][i]['description'].includes(search) && flag === false){
                    flag = true;
                    let r = {
                        id: result['articles'][i]['id'],
                        author: result['articles'][i]['author'],
                        title: result['articles'][i]['title'],
                        description: result['articles'][i]['description'],
                        url: result['articles'][i]['url'],
                        urlToImage: result['articles'][i]['urlToImage'],
                        publishedAt: result['articles'][i]['publishedAt']
                    };
                    records.articles.push(r);
                }
            }
            if(records.articles.length != 0){
                Send(records, response);
            }
            else{
                let er = {status: 'error', code: 400, message: 'Запись не найдена' }
                Send(er, response);
            }
        }
        else{
            Send(result, response);
        }
    });


    //получение отправленных данных (добавление)
    app.post('/everything', auth, jsonParser, (request, response) => {
        if(!request.body){
            return response.sendStatus(400);
        }

        let result = ReadFile();
        if(result['status'] == 'ok'){
            let maxid;
            if(result.articles.length != 0){
                maxid = Math.max.apply(Math,  result.articles.map( (x) => { return x.id; } ));
            }
            else{
                maxid = 0;
            }
            
            //создаем массив и кладем в него полученные данные
            let articles = {
                id: maxid + 1, 
                author: request.body.author,
                title: request.body.title,
                description: request.body.description,
                url: request.body.url,
                urlToImage: request.body.urlToImage,
                publishedAt: request.body.publishedAt
            };

            //добавляем запись в массив
            result.articles.push(articles);
            //преобразуем данные в json
            let data = JSON.stringify(result);
            //перезаписываем данные в файле
            fs.writeFileSync(filePath, data);
            //ответ сервера
            response.send(data);
        }
        else{
            Send(result, response);
        }
    });

    //редактирование данных
    app.put('/everything', auth, jsonParser, (request, response) => {
        if(!request.body){
            return response.sendStatus(400);
        }

        const id = request.body.id;
        let result = ReadFile();
        if(result['status'] == 'ok'){
            //поиск записи с заданным id
            let del = result.articles.find(x => x.id == id);
            if(del){
                del.author = request.body.author;
                del.title = request.body.title;
                del.description = request.body.description;
                del.url = request.body.url;
                del.urlToImage = request.body.urlToImage;
                del.publishedAt = request.body.publishedAt;

                //преобразуем данные в json
                let data = JSON.stringify(result);
                //перезаписываем данные в файле
                fs.writeFileSync(filePath, data);
                //ответ сервера
                response.send(data);
            }
            else{
                let er = {status: 'error', code: 400, message: 'Запись не найдена' }
                Send(er, response);
            }
        }
        else{
            Send(result, response);
        }
    });

    //удаление данных
    app.delete('/everything/:id', auth, (request, response) => {
        const id = request.params.id;
        let result = ReadFile();
        if(result['status'] == 'ok'){
            //поиск записи с заданным id
            let del = result.articles.find(x => x.id == id);
            if(del){
                //определение индекса нужной записи в массиве
                let index = result.articles.indexOf(del);
                if(index >= 0){
                    //удаление записи из массива по заданному индексу
                    result.articles.splice(index, 1);
                    //преобразуем данные в json
                    let data = JSON.stringify(result);
                    //перезаписываем данные в файле
                    fs.writeFileSync(filePath, data);
                    //ответ сервера
                    response.send(data);
                }
            }
            else{
                let er = {status: 'error', code: 400, message: 'Запись не найдена' }
                Send(er, response);
            }
        }
        else{
            Send(result, response);
        }
    }); 
}

module.exports = router;