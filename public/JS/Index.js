//отображение полученной информации
function WriteRecord(result){
    //удаляем записи на странице
    $('div.blog-post').remove();
    console.log(result);
    if(result['status'] == 'ok'){
        for(var i = 0; i < result['articles'].length; i++){
            const div = document.createElement("div");
            div.setAttribute("class", "blog-post  wow fadeInUp");
            const img = document.createElement("img");
            img.setAttribute("class", "img-responsive");
            img.setAttribute("src", result['articles'][i]['urlToImage']);
            const h1 = document.createElement("h1");
            h1.textContent = result['articles'][i]['title'];
            const span1 = document.createElement("span");
            span1.setAttribute("class", "author");
            span1.textContent = result['articles'][i]['author'];
            const span2 = document.createElement("span");
            span2.setAttribute("class", "date-time");
            span2.textContent = result['articles'][i]['publishedAt'];
            const p = document.createElement("p");
            p.textContent = result['articles'][i]['description'];
            const a = document.createElement("a");
            a.setAttribute("class", "btn btn-upper btn-primary read-more btn-plus");
            a.textContent = "читать";
            a.setAttribute("href", result['articles'][i]['url']);

            div.append(img);
            div.append(h1);
            div.append(span1);
            div.append(span2);
            div.append(p);
            div.append(a);

            $('div.Result').append(div);
        }
    }
    else{
        alert('Code: ' + result.code + '\nMessange: ' + result.message);
    }
}

//поиск
$('button#Search').on('click', async function (e) {
    var url = window.location.href.match(/^.*\//);
    var q = $('input#Text').val();
    var response;

    if(q == ''){
        response = await fetch(url + 'everything', {
            method: 'GET',
            headers: { "Accept": "application/json" }
        });
    }
    else{
        response = await fetch(url + 'everything/' + q, {
            method: 'GET',
            headers: { "Accept": "application/json" }
        });
    }

    if(response.ok === true){
        var result = await response.json();
        WriteRecord(result);
    }

    e.stopPropagation();
});
