let land      = map.groups.land;
let seas      = map.seas;
let countries = map.countries;

class PlayerInterface {
    constructor(id) {
        this.countries = {};

        this.cards      = {
            "artillery": 0,
            "infantry" : 0,
            "cavalry"  : 0
        };

        this.army      = {
            "artillery": 5,
            "infantry" : 25,
            "cavalry"  : 10
        };

        this.id = id;
        this.turn = false;

    }

    getBattleWon() {

    }

    getTacMove() {

    }

    getTrade() {

    }

    getPlaceArmies() {

    }

    getAttack() {

    }

    getRoll() {

    }

    getCapital() {

    }

    getAutoDefendString() {

    }
}

class AI extends PlayerInterface{
    constructor() {
        super(2);
        this.color = "red";
    }
}

class Player extends PlayerInterface {
    constructor() {
        super(1);
        this.color = "blue";
    }
}
/**
 * 
 */
class Main extends SVG {
    /**
     * 
     * @param svg
     */
    constructor(svg) {
        super();
        let self = this;

        this.land   = new Land(this);
        this.sea    = new Sea(this);
        this.p1     = new Player();
        this.p2     = new AI();
        this.level  = 1;

        this.p1.turn = true;
        this.curr    = this.p1;

        this.phase1();

    }

    create(type, attr) {
        return this.newElement( type, attr );
    }

    phase1() {
        this.land.listen(this.curr);
    }
}

class Land {
    constructor(main) {
        this.main = main;
        this.groups  = {};
        this.seen    = {};
        this.country = {};

        this.createMapgroup();
        this.createMap();
        this.createHighlight();
    }
    
    listen(player) {
        this.addListeners(player);
    }

    stopListen() {
        this.removeListeners();
    }

    createMapgroup() {
        let attr = {"id": "map", "visibility": "visible", "fill": "none", "stroke-width": "1.5"};
        this.main.mmap = this.main.create("g", attr);
        document.getElementById("Risk").appendChild(this.main.mmap);
    }

    /**
     *
     */
    createMap() {
        let self = this;
        let nations, nation, n;

        land.forEach(function (continent) {
            self.main.createGroup(continent.id, continent.attr);
            nations = countries[continent.id];
            for (n in nations) {
                self.main.createPath(nations[n].id, continent.id, nations[n].d, "country");
            }
        });
    }

    createHighlight() {
        let attr = {"id": "hilite", "fill": "white", "stroke-width": "5", "stroke": "black", "opacity": "0.1"};
        let hilite = this.main.create("path", attr);
        document.getElementById("Risk").appendChild(hilite);

        this.main.hilite = document.getElementById("hilite");
    }

    /**
     *
     */
    addListeners(player) {
        let self = this;
        let countries = document.getElementsByClassName('country');

        for (let i = 0; i < countries.length; i++) {
            let country = countries[i];

            country.addEventListener('click', function (evt) {
                self.mousedown(evt, player);
            });

            country.addEventListener('mouseover', function (evt) {
                self.mouseoverCountry(evt, player);
            });
        }
    }

    removeListeners() {
        let self = this;

        let countries = document.getElementsByClassName('country');

        for (let i = 0; i < countries.length; i++) {
            let country = countries[i];
            country.removeEventListener('mouseover',function(){
                console.log('mouseover')
            });
            country.removeEventListener('click',function(){
                console.log('click')
            });
        }
    }

    /**
     *
     * @param evt
     */
    mouseoverCountry(evt) {
        let cnty    = evt.target;
        let b       = cnty.getBBox();
        let label   = '';
        let text    = '';
        let id      = cnty.getAttribute('id');
        let outline = cnty.getAttribute('d');

        if (!this.groups[id]) {
            let attr = {id:'name-label-' + id, 'font-size': 10, stroke: 'none', fill:'black', 'text-insert':'middle', x:b.x + b.width / 4, y:b.y + b.height / 3};
            label = this.main.create("text", attr);

            text = document.createTextNode('');
            text.textContent = cnty.getAttribute('id');
            this.groups[id] = {label: label, text: text};

            label.appendChild(text);
            this.main.mmap.appendChild(label);
        } else {
            label = this.groups[id].label;
            text  = this.groups[id].text;
        }

        label.appendChild(text);
        this.main.mmap.appendChild(label);
    }

    /**
     *
     * @param evt
     */
    mousedown(evt, player) {
        let country = evt.target;
        let b = country.getBBox();
        let self = this;
        let label = '';
        let id = country.getAttribute('id');
        let text = '';

        if(!this.country[id]){
            this.country[id] = country;
            this.country[id]['army'] = 1;
        }

        if(!country['owner']) {
            country['owner'] = player;
        }

        if(!this.seen[id]) {
            let attr = {id:'armies-label-' + id, 'font-size':10, stroke:'none', fill:'black', 'text-insert':'middle', x: b.x + b.width / 2, y:((b.y + b.height / 3) + 15)}
            label = this.main.create("text", attr);
            text  = document.createTextNode( '' );
            this.seen[id] = { label: label, text: text };
        } else {
            label = this.seen[id].label;
            text  = this.seen[id].text;
        }

        if(player.turn) {
            text.textContent = this.country[id]['army']++;
            label.appendChild(text);
            this.main.mmap.appendChild(label);

            let outline = country.getAttribute('d');
            this.main.hilite.setAttribute('d', outline);

            country.setAttribute('fill', player.colour);

            setTimeout(function () {
                self.main.hilite.removeAttribute('d', outline);
            }, 300);
        }
    }
}

class Sea{
    constructor(main) {
        this.main = main;
        this.createMap();
        this.addListeners();
    }

    addListeners() {
        let self = this;

        let seas = document.getElementsByClassName('sea');
        let sea, i;

        for (i = 0; i < seas.length; i++) {
            sea = seas[i];
            sea.addEventListener('click', function (evt) {
                self.mouseoverSea(evt);
            });
        }
    }

    mouseoverSea( evt ) {
        var sea = evt.target;
        let outline = sea.getAttribute('d');
        this.main.hilite.setAttribute( 'd', outline);
    }

    /**
     *
     */
    createMap() {
        let self = this;
        let attr = {"id": "seas", "visibility": "visible", "fill": "lightblue", "stroke-width": "1.5"};
        let sea = this.main.create("g", attr);
        document.getElementById("Risk").appendChild(sea);
        seas.forEach(function(sea){
           self.main.createPath(sea.id, "seas", sea.d,"sea" );
        });
    }
}
