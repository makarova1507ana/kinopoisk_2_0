//Реализовать веб-страницу для поиска фильмов. 
// поиск фильмов по названию или типу, (поиск по жанру, поиск по году)
// +   //макет для поиска - форма, с текст-input и выпадющий список и кнопка
//  +  // запрос к серверу для получения json-файла 
//    //  json-файла распарсить и отобразить на странице

// после получения фильмов необходимо реализовать пагинацию - (разбивка контента  на страницы)

let btn_search = document.getElementById('btn_search'); // btn_search
let results = document.getElementById('results'); // div results

//    // запрос к серверу для получения json-файла 
//http://www.omdbapi.com/?apikey=[yourkey]&
const url = 'http://www.omdbapi.com/?apikey=23f82659';
// films were founded 5718 -> page 1 первые 10 фильмов(с 1 до 10) -> page 2 следующие 10 фильмов(с 11 до 20)
//http://www.omdbapi.com/?apikey=23f8265&s='hello'&page=10  - выдаст с 101 по 110 фильмы

function sendRequest(url) {
    return fetch(url).then(response => { return response.json() }) // fetch  возвращает promise    
}

/*GET request */
btn_search.addEventListener('click', function() {
        requestUrl = currentUrl();
        sendRequest(requestUrl)
            .then(data => (console.log(data), result(data)))
            .catch(err => (
                console.log('error data', err))) //в случае неуспешного выполнения кода
    }

);

function currentUrl() {
    // механика поиска 
    // t -title
    // url   +   &s= + "hello"
    results.innerHTML = "";
    title = document.getElementById('title').value;
    types = document.querySelectorAll('option');
    let Type;
    for (type of types) {
        if (type.selected) {
            Type = type.value;
            break
        }
    }

    if (title != '') {
        curlUrl = url + '&s="' + title + '"&type="' + Type + '"';
    } else {
        curlUrl = url;
    }
    return curlUrl
}

function result(data) {

    if (data['Response'] == "True") { //true или false
        count_results = document.createElement('h2');
        count_results.innerHTML = "нашлось фильмов: " + data["totalResults"];
        results.append(count_results);

        get_movie(data['Search'])
    } else {
        /*title */
        error = document.createElement('h3');
        error.innerHTML = "films not found";
        results.append(error);

        console.log('films not found');
    }
}
//    //  json-файла распарсить и отобразить на странице
function get_movie(array) {

    for (let i = 0; i < array.length; i++) {
        block_movie(array[i]);
    }

}

show_details = Event => {
    // Какая кнопка была нажата
    id = Event.currentTarget.id;
    // получим Json файл по запросу фильма http://www.omdbapi.com/?apikey=23f82659 +  &i= у кнопки возьмем id
    requestUrl = url + "&i=" + id;
    sendRequest(requestUrl)
        .then(data => (console.log(data), block_info(id, data))) // направлять на обратку JSON (data)  и отображения результата         // функция которая отобразит все данные о фильме
        .catch(err => (
            console.log('error data', err))) //в случае неуспешного выполнения кода

}


//Показывает таблицу с подробной информацией о фильме
function block_info(id, data_json) {
    /*title */
    btn = document.getElementById(id);
    console.log(btn)
    table = document.createElement('tbody');


    //перебираем все свойства нашего файла JSON
    for (element in data_json) {

        if (data_json[element] !== 'N/A' && element !== 'imdbID' && element !== 'Response') {

            //в рейтинге отдельно хранятся объекты JSON в которых есть информаация о кадом рейтинге
            if (element == 'Ratings') {
                table.innerHTML += "<tr>   <th>" + element + "</th>  <td>" + data_json[element][0]['Source'] + " - " + data_json[element][0]['Value'] + "</td     </tr>";

                table.innerHTML += "<tr>   <td></td> <td>" + data_json[element][1]['Source'] + " - " + data_json[element][1]['Value'] + "</td     </tr>";
                table.innerHTML += "<tr>   <td></td><td>" + data_json[element][2]['Source'] + " - " + data_json[element][2]['Value'] + "</td     </tr>";

            } else {
                table.innerHTML += "<tr>   <th>" + element + "</th>   <td>" + data_json[element] + "</td>    </tr>";
            }
        }
    }
    table.innerHTML += "</tbody>";
    btn.after(table);

}
//create one the block of movie
function block_movie(obj) {
    /*title */
    title = document.createElement('h3');
    title.innerHTML = obj["Title"];
    results.append(title);

    /*poster */
    poster = document.createElement('div');
    if (obj["Poster"] == "N/A") {
        // нужно добавить картинку по умолчанию
        poster.innerHTML = '<img style="width:150px; height:300px;" alt="здесь должен быть постер"';
    } else {
        poster.innerHTML = '<img style="width:150px; height:300px;" src="' + obj["Poster"] + '">';
    }
    results.append(poster);

    /*type */
    type = document.createElement('p');
    type.innerHTML = "<strong>type: </strong>" + obj["Type"];
    results.append(type);

    /*btn_deatails */
    btn_details = document.createElement('input');
    btn_details.type = "button";
    btn_details.id = obj['imdbID']; // 
    btn_details.value = "details";
    results.append(btn_details);
    btn_details.addEventListener('click', show_details); // btn_deatails добавить обработку событий 

}