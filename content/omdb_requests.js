function omdb_create_facts(facts) {

    var xhr = new XMLHttpRequest()
    xhr.open("POST", 'http://www.omdb.org/movie/' + movie_id + '/update_facts', true)
    xhr.setRequestHeader('Accept', 'text/javascript')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    params = 'movie[runtime]=' + facts.runtime
    params += '&movie[end]=' + facts.release_date

    for(l in facts.languages) {
        language = all_languages[facts.languages[l]]
        if(language)
	    params += '&languages[]=' + language
    }

    for(c in facts.countries) {
        country = all_countries[facts.countries[c]]
        if(country)
            params += '&countries[]=' + country
    }

    xhr.send(params)
}


function omdb_create_genres(facts) {
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "http://www.omdb.org/movie/" + movie_id + "/update_categories", true)
    xhr.setRequestHeader('Accept', 'text/javascript')
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    params = ''
    for (i in facts.genres) {
        params += 'categories[]=' + all_genres[facts.genres[i]] + '&'
    }

    xhr.send(params)
}



function set_omdb_person_id(person, actor_number) {
	async = !(person.job != 'actor' && actor_number && actor_number < 5)

    var xhr = new XMLHttpRequest()
    xhr.open("POST", "http://www.omdb.org/search/person_autocomplete", async)
    xhr.setRequestHeader('Accept', 'text/javascript')
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
	
    xhr.onreadystatechange = function()  {
        if (xhr.readyState == 4 && xhr.status == 200)  {
        
            response = xhr.responseText
            found_name = response.substr(response.indexOf('<h4>') + 4)
            found_name = found_name.substr(0, found_name.indexOf('</h4>'))

            id = response.substr(response.indexOf('id="person_autocomplete_') + 24)
            id = id.substr(0, id.indexOf('">'))

            person_id = null
            if (person.name.trim() == found_name.trim()) {
                person_id = id
            }
            person.omdb_id = person_id
            
            if(person.job != 'actor') {
              omdb_create_crew(person)
            } else {
              if(all_actors[all_actors.length -1] == person) {
                omdb_create_all_casts()
              }
            }
        }
    }
	
    xhr.send('person=' + person.name)

}


function omdb_create_cast(person) {
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "http://www.omdb.org/cast/create_cast", true)
    xhr.setRequestHeader('Accept', 'text/javascript')
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    params = 'movie=' + movie_id + '&cast%5Bcomment%5D=' + person.character
        + '&person=' + person.name
    if (person.omdb_id == null) {
        params += '&cast%5Bnew_person%5D=' + person.name
    } else {
        params += '&cast%5Bperson%5D=' + person.omdb_id
    }

    xhr.send(params)
}

// /////////




function omdb_create_crew_members() {

    for (i = 0; i < directors.length; i++) {
        id = get_omdb_person_id(directors[i])
        omdb_create_crew(directors[i], 'Director', id)
    }

    for (i = 0; i < writers.length; i++) {
        id = get_omdb_person_id(writers[i])
        omdb_create_crew(writers[i], 'Author', id)
    }

}

function omdb_create_crew(person) {
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "http://www.omdb.org/cast/create", true)
    xhr.setRequestHeader('Accept', 'text/javascript, text/html, application/xml, text/xml, */*')
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
	
    params = 'commit=ok'
    params += '&crew[job]=' + crew_types[person.job]
    params += '&crew[new_job]='

    if (!person.omdb_id) {
        params += '&crew[new_person]=' + person.name
    } else {
        params += '&crew[new_person]='
        params += '&crew[person]=' + person.omdb_id
    }

    params += '&job=' + person.job
    params += '&movie=' + movie_id
    params += '&person=' + person.name

    xhr.send(params)
}




function omdb_delete_people() {
	for(i = 0; i < 10; i++)
      omdb_delete_department(i+1)
}

function omdb_delete_department(department) {
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "http://www.omdb.org/cast/update?movie=" + movie_id + "&department=" + department, true)
    xhr.setRequestHeader('Accept', 'text/javascript')
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.send('filter[people]=')
}



function get_omdb_title() {
    var xhr = new XMLHttpRequest()
    xhr.open("GET", "http://www.omdb.org/movie/" + movie_id + "/embed_data/",  false)
    xhr.setRequestHeader('Accept', 'application/xml')
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    xhr.send(null)

    if (xhr.status == 200) {
        res = xhr.responseText
        res = res.substr(res.indexOf('<name>') + 6)
        res = res.substr(0, res.indexOf('</name>'))
    }
    return res.stripBrackets().trim().replace(/&amp;/g, '&')
}

//

function omdb_create_abstract(facts) {
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "http://www.omdb.org/movie/" + movie_id + "/set_abstract", true)
    xhr.setRequestHeader('Accept', 'text/javascript')
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    xhr.send('movie[abstract]=' + facts.plot)
}


/*
function add_omdb_plot_keyword(plot_keyword) {
    plot_keyword = plot_keyword.clean()
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "http://www.omdb.org/search/find_categories?name=keyword", true)
    xhr.setRequestHeader('Accept', 'text/javascript')
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.onreadystatechange = function()  {
        if (xhr.readyState == 4 && xhr.status == 200)  {      
            response = xhr.responseText       
            pos = response.indexOf('"search-keyword-')
            if(pos > -1) {
                id = response.substr(pos)
                id = id.substr(0, id.indexOf('">'))
                id = id.substr(16)
                create_omdb_plot_keyword(id)
            } else if(response.indexOf('nothing found') != -1) {
                create_new_omdb_plot_keyword(plot_keyword)
            } else {
                alert('a keyword search error occured')
            }
        }
    }
    xhr.send(plot_keyword)
}

function create_new_omdb_plot_keyword(keyword) {
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "http://www.omdb.org/movie/" +movie_id + "/add_new_keyword?create=true", true)
    xhr.setRequestHeader('Accept', 'text/javascript')
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.send(keyword)
}


function create_omdb_plot_keyword(id) {
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "http://www.omdb.org/movie/"+ movie_id + "/add_category", true)
    xhr.setRequestHeader('Accept', 'text/javascript')
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.send("create=true&category=" +id)
}
*/