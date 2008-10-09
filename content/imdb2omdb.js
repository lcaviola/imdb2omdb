var doc 
var movie_id 

var facts
var finished

var all_genres
var all_countries
var all_languages

var crew_types

var start

function imdb2omdb() {
    start = new Date().getTime()
    doc = window.content.document
    if (doc.location.href.indexOf('http://www.imdb.com/title/') == 0) {
        start_process()
    } else {
        alert('no imdb movie page')
    }
}

function start_process() {
    finished = false
    movie_id = prompt('enter OMDB-ID: (it might take a minute)')
    if(!movie_id) return
    init_imdb_omdb_associations()
    facts = readFacts()
    omdb_title = get_omdb_title().replace(/&([^;)]+;)/g, '').toLowerCase()
    omdb_title = omdb_title.replace(/[^\w\d]/g, ' ').trim()
    facts_title = facts.title.replace(/&([^;)]+;)/g, '').toLowerCase().replace(/[^\w\d]/g, ' ').trim()
    if (omdb_title != facts_title) {
        alert('wont create omdb article. titles are not the same. imdb: "'
            + facts_title + '" omdb: "' + omdb_title + '"')
        return
    }
    openUrlToNewTab('http://images.google.ch/images?q=(site:movieweb.com%20OR%20site:impawards.com)+' + omdb_title)
    initFullCredits()
	
    create_all_facts(facts)
     
	
    if(finished) {
        showFinishedMessage()
    }
    finished = true
}

function showFinishedMessage() {
    end = new Date().getTime()
    elapsed_time = end - start;
    elapsed_casts_create_time = end - casts_start
    alert('FINISHED. (' + elapsed_time +' ms)\n\nplease check if the following attributes were added correctly:\nruntime, release date, cast, crew, genres\n\nand dont forget the upload the cover.')
}

function create_all_facts(facts) {
    omdb_create_facts(facts)
    omdb_create_genres(facts)
//omdb_create_abstract(facts)
// TODO: dont take abstract from imdb. maybe from wikipedia..
    
/* for(k in facts.plot_keywords) {
		add_omdb_plot_keyword(facts.plot_keywords[k])
	}*/
	
}



function init_imdb_omdb_associations() {
    all_genres = []
    all_genres['Action'] = 28
    all_genres['Adventure'] = 12
    all_genres['Animation'] = 16
    all_genres['Biography'] = 210
    all_genres['Comedy'] = 35
    all_genres['Crime'] = 80
    all_genres['Documentary'] = 99
    all_genres['Drama'] = 18
    all_genres['Family'] = 6037
    all_genres['Fantasy'] = 14
    all_genres['Film-Noir'] = 644
    all_genres['Game-Show'] = 4325
    all_genres['History'] = 36
    all_genres['Horror'] = 27
    all_genres['Music'] = 22
    all_genres['Musical'] = 22
    all_genres['Mystery'] = 79
    all_genres['News'] = 1774
    all_genres['Reality-TV'] = 3113
    all_genres['Romance'] = 19
    all_genres['Sci-Fi'] = 878
    all_genres['Short'] = 1122
    all_genres['Sport'] = 6075
    all_genres['Talk-Show'] = 3741
    all_genres['Thriller'] = 53
    all_genres['War'] = 31
    all_genres['Western'] = 37

    all_languages = []
    all_languages['English'] = 1819
    all_languages['German'] = 1556
    all_languages['French'] = 1930
    all_languages['Japanese'] = 2723
    all_languages['Italian'] = 2600
    all_languages['Spanish'] = 5889
    all_languages['Danish'] = 1499
    all_languages['Swedish'] = 6024
    all_languages['Chinese'] = 7484
    all_languages['Korean'] = 3122
	
    all_countries = []
    all_countries['USA'] = 223
    all_countries['UK'] = 75
    all_countries['Germany'] = 55
    all_countries['France'] = 73
    all_countries['Japan'] = 109
    all_countries['Switzerland'] = 41
    all_countries['Spain'] = 66
    all_countries['Italy'] = 106
    all_countries['Denmark'] = 57
    all_countries['Sweden'] = 189
    all_countries['China'] = 46
    all_countries['South Korea'] = 117
    all_countries['Mexico'] = 150


    crew_types = []
    crew_types['writers'] = 13
    crew_types['producers'] = 16
    crew_types['directors'] = 21
    crew_types['sound_department'] = 57
    crew_types['executive producer'] = 40
    crew_types['co-producer'] = 41
    crew_types['associate producer'] = 43
    crew_types['line producer'] = 44
    crew_types['producer'] = 16
    crew_types['music_original'] = 27
    crew_types['cinematographers'] = 23
    crew_types['editors'] = 33
    crew_types['casting_directors'] = 17
    crew_types['production_designers'] = 18
    crew_types['art_directors'] = 77
    crew_types['set_decorators'] = 81
    crew_types['costume_designers'] = 678
	

}
