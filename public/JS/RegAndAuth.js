//отобразить ошибку
function WriteError(result){
    alert('Code: ' + result.code + '\nMessange: ' + result.message);
}

//зарегистрироваться
$('button#Reg').on('click', async function (e) {
    var url = window.location.href.match(/^.*\//);
    const button = $('button#Reg');
    button.disabled = false;
    e.stopPropagation();
    
    const name = $('input#Name').val();
    const email = $('input#Email').val();
    const password = $('input#Password').val();
    const password2 = $('input#Password2').val();

    let text = "";
    if(name == ''){
        text += 'Введите имя!\n';
    }
    if(email == ''){
        text += 'Введите email!\n';
    }
    if(password == ''){
        text += 'Введите пароль!\n';
    }
    if(password.length < 6){
        text +='Пароль должен содержать не менее 6 символов!\n';
    }
    if(password != password2){
        text += 'Введенные пароли не совпадают!';
    }

    if(text != ""){
        alert(text);
        button.disabled = true;
        return;
    }

    const responce = await fetch(url + 'reg', {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: password,
            name: name
        })
    });

    if(responce.ok === true){
        const result = await responce.json();
        if(result.status == 'ok'){
            document.location.href = '/my-account';
            button.disabled = true;
        }
        else{
            WriteError(result);
            button.disabled = true;
        }
    }

});

//войти
$('button#Enter').on('click', async function (e) {
    var url = window.location.href.match(/^.*\//);
    const button = $('button#Enter');
    button.disabled = false;
    e.stopPropagation();

    const email = $('input#Email').val();
    const password = $('input#Password').val();
    
    let text = "";
    if(email == ''){
        text += 'Введите email!\n';
    }
    if(password == ''){
        text += 'Введите пароль!\n';
    }
    if(password.length < 6){
        text +='Пароль должен содержать не менее 6 символов!\n';
    }

    if(text != ""){
        alert(text);
        button.disabled = true;
        return;
    }

    const responce = await fetch(url + 'auth', {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if(responce.ok === true){
        const result = await responce.json();
        if(result.status == 'ok'){
            document.location.href = '/my-account';
            button.disabled = true;
        }
        else{
            WriteError(result);
            button.disabled = true;
        }
    }
});

//обновить
$('button#Update').on('click', async function (e) {
    var url = window.location.href.match(/^.*\//);
    const button = $('button#Update');
    button.disabled = false;
    e.stopPropagation();
    
    const name = $('input#Name').val();
    const email = $('input#Email').val();
    const oldpassword = $('input#Password').val();
    var newpassword, newpassword2;
    const check = document.getElementById('Check1');
    
    let text = "";
    if(name == ''){
        text += 'Введите имя!\n';
    }
    if(email == ''){
        text += 'Введите email!\n';
    }
    if(oldpassword == ''){
        text += 'Введите пароль!\n';
    }
    if(oldpassword.length < 6){
       
        text +='Пароль должен содержать не менее 6 символов!\n';
    }
    if(check.checked){
        newpassword = oldpassword;
        newpassword2 = oldpassword;
    } 
    else{
        newpassword = $('input#NewPassword').val();
        newpassword2 = $('input#NewPassword2').val();
        if(newpassword == ''){
            text += 'Введите новый пароль!\n';
        }
        if(newpassword.length < 6){
        
            text +='Новый пароль должен содержать не менее 6 символов!\n';
        }
        if(newpassword != newpassword2){
            text += 'Введенные новые пароли не совпадают!';
        }
    }

    if(text != ''){
        alert(text);
        button.disabled = true;
        return;
    }

    const responce = await fetch(url + 'regUpdate', {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: oldpassword,
            newpassword: newpassword,
            name: name
        })
    });

    if(responce.ok === true){
        const result = await responce.json();
        if(result.status == 'ok'){
            document.location.href = '/my-account';
            button.disabled = true;
        }
        else{
            WriteError(result);
            button.disabled = true;
        }
    }
});

$('input#Check1').on('click', e => {
    const check = document.getElementById('Check1');

    if(!check.checked) {
        const div = document.createElement('div');
        div.setAttribute("class", "form-group SPassword");

        const label = document.createElement('label');
        label.setAttribute("for", 'NewPassword');
        label.append('Введите новый пароль');

        const input = document.createElement('input');
        input.setAttribute('type', 'password');
        input.setAttribute('class', 'form-control');
        input.setAttribute('id', 'NewPassword');
        input.setAttribute('placeholder', 'Пароль');

        div.append(label);
        div.append(input);

        const div2 = document.createElement('div');
        div2.setAttribute("class", "form-group SPassword");

        const label2 = document.createElement('label');
        label2.setAttribute("for", 'NewPassword2');
        label2.append('Повторите введенный новый пароль');

        const input2 = document.createElement('input');
        input2.setAttribute('type', 'password');
        input2.setAttribute('class', 'form-control');
        input2.setAttribute('id', 'NewPassword2');
        input2.setAttribute('placeholder', 'Пароль');

        div2.append(label2);
        div2.append(input2);

        $('button#Update').before(div);
        $('button#Update').before(div2);

        $('label#LabelPassword').text('Введите старый пароль');
    }
    else{
        $('div.SPassword').remove();
        $('label#LabelPassword').text('Введите пароль');
    }


});
