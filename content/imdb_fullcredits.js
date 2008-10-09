var idoc
var all_actors

var casts_start

function initFullCredits() {
    fc = doc.getElementById('fullcredits_frame')
    if(!fc) {
        doc.body.innerHTML += '<iframe id="fullcredits_frame" src="' + doc.location.href + 'fullcredits"></iframe>'
        fc = doc.getElementById('fullcredits_frame')
        fc.contentWindow.addEventListener("load", readFullCredits, true)
		
    }
}

function readFullCredits() {
    idoc = fc.contentWindow.document

	  omdb_delete_people()	
	
	
    var crew = []
	
	
    directors = getCrew('directors')
    writers = getCrew('writers')
    producers = getCrew('producers')
    music_original = getCrew('music_original')
    cinematographers = getCrew('cinematographers')
    editors = getCrew('editors')
    casting_directors = getCrew('casting_directors')
    production_designers = getCrew('production_designers')
    art_directors = getCrew('art_directors')
    set_decorators = getCrew('set_decorators')
    costume_designers = getCrew('costume_designers')

    crew = crew.concat(directors)
    crew = crew.concat(writers)
    crew = crew.concat(producers)
    crew = crew.concat(music_original)
    crew = crew.concat(cinematographers)
    crew = crew.concat(editors)
    crew = crew.concat(casting_directors)
    crew = crew.concat(production_designers)
    crew = crew.concat(art_directors)
    crew = crew.concat(set_decorators)
    crew = crew.concat(costume_designers)

    
    setPersonIds(crew)
    
    all_actors = getActors()
    setPersonIds(all_actors)

}

function omdb_create_all_casts() {
   casts_start = new Date().getTime()

    maxlength = (all_actors.length > 20) ? 20 : all_actors.length
    for (i = 0; i < maxlength; i++) {
        omdb_create_cast(all_actors[i], i)
    }
    
	

    if(finished) {
        showFinishedMessage()
    }
    finished = true
}


function setPersonIds(crew) {
    for(i in crew) {
        person = crew[i]
	    set_omdb_person_id(person)	 
    }
}



function getActors() {
    names = idoc.getElementsByClassName('cast')[0].getElementsByClassName('nm')

    actors = []
    for (i in names) {
        char_el = names[i].parentNode.getElementsByClassName('char')[0]
        actor = new Person()
        actor.job = 'actor'
        actor.character = char_el.innerHTML.clean()
        actor.name = names[i].getElementsByTagName('a')[0].innerHTML.clean()
        actors.push(actor)
    }
    return actors
}

function getCrew(job) {
    var crew = []
    table = getTable(job)
    if(!table) return []
    tds = table.getElementsByTagName('td')
    for(i in tds) {
        a_el = tds[i].getElementsByTagName('a')
        if(a_el.length == 1 && a_el[0].href.indexOf('http://www.imdb.com/name') == 0) {
	    p = new Person()
	    p.job = job
	    p.name = a_el[0].innerHTML.clean()
	    
	    if(a_el[0].parentNode.nextSibling && a_el[0].parentNode.nextSibling.nextSibling) {
                a_job = a_el[0].parentNode.nextSibling.nextSibling.getElementsByTagName('a')
                if(a_job.length > 0) {
                    sjob = a_job[0].innerHTML.clean()
                    sjob.substr(0, sjob.indexOf(':')).trim()
                    if(crew_types[sjob] != null) {
                        p.job = sjob
                    } else {
                        alert('unknown job: ' +sjob)
                    }
                }
	    }
	    
	    
	    crew.push(p)
        }
    }
    return crew
}



function getTable(title) {
    h5_el = idoc.getElementsByTagName('h5')
    for(i in h5_el) {
        a_el = h5_el[i].getElementsByTagName('a')
        if(a_el.length == 1) {
	    name = a_el[0].name
	    if(name.trim() == title.trim()) {
                return h5_el[i].parentNode.parentNode.parentNode
	    }
        }
    }
    return null
}