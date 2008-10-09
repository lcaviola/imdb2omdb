
function readFacts() {
	

    facts = new Facts()
    facts.init()

    return facts
}




var Facts = function() {
    this.title
    this.release_date
    this.runtime
    this.plot
    this.countries
    this.genres
    this.languages
    this.plot_keywords
}

Facts.prototype = {
    init: function() {
        this.readTitle()
        this.readReleaseDate()
        this.readRuntime()
        this.readPlot()
        this.readCountries()
        this.readGenres()
        this.readLanguages()
    // this.readPlotKeywords()
    }
    ,
    readTitle: function() {
        this.title = doc.getElementsByTagName('title')[0].innerHTML.replace('(V)', '').substr(0, title.lastIndexOf('(') - 1).clean()
    }
    ,
    readReleaseDate: function() {
        rd = getInfoElement('Release Date')
        if(rd) {
            this.release_date = rd.childNodes[2].data.clean()
        }
    }
    ,
    readRuntime: function() {
        rt = getInfoElement('Runtime')
        if(rt) {
            rt = rt.childNodes[2].data.trim()
            this.runtime = rt.substr(0, rt.indexOf(' ')).replace(/[^\d]/g, '').clean()
        }
    }
    ,
    readPlot: function() {
        pl = getInfoElement('Plot')
        if(pl) {
            pl = pl.innerHTML
            pl = pl.substr(0, pl.indexOf('<a class="tn15more')).replace(/Plot:/g, '')
            this.plot = pl.stripTags().replace(/\|/g, '').trim()
        }
    }
    ,
    readCountries: function() {
        el_countries = getInfoElement('Country').getElementsByTagName('a')
        this.countries  = getNamesFromLinks(el_countries, '/Sections/Countries/')
    }
    ,
    readGenres: function() {
        g = getInfoElement('Genre')
        if(g) {
            el_genres = g.getElementsByTagName('a')
            this.genres =  getNamesFromLinks(el_genres, '/Sections/Genres/')
        }
    }
    ,
    readLanguages: function() {
        l_el = getInfoElement('Language')
        if(l_el) {
            el_languages = l_el.getElementsByTagName('a')
            this.languages = getNamesFromLinks(el_languages, '/Sections/Languages/')
        }
    }
    ,
    readPlotKeywords: function() {
        el_plot_keywords = getInfoElement('Plot Keywords').getElementsByTagName('a')
        this.plot_keywords = getNamesFromLinks(el_plot_keywords, '/keyword/')
    }
}




function getInfoElement(title) {
    info = doc.getElementsByClassName('info')

    for (i = 0; i < info.length; i++) {

        if (info[i].getElementsByTagName('h5').length > 0
            && info[i].getElementsByTagName('h5')[0].innerHTML
            .indexOf(title) == 0) {
            return info[i]
        }
    }
}

function getNamesFromLinks(links, url) {
    if (typeof(url) == 'undefined') {
        url = '/name/'
    }
    names = []
    for (i = 0; i < links.length; i++) {
        if (links[i].href.indexOf('http://www.imdb.com' + url) == 0) {
            names.push(links[i].innerHTML.clean())
        }
    }
    return names
}


