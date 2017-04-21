let land = map.groups.land;
let countries = map.countries;

class SVG {
    constructor(_SVG) {

        this._SVG = _SVG;

        let mmap = this.newElement("g", {"id": "map", "visibility": "visible", "fill": "none", "stroke-width": "1.5"});
        document.getElementById("Risk").appendChild(mmap);

        this.label = this.newElement('text', {id: 'label', 'font-size': 20, stroke: 'none', fill: 'black', 'text-insert': 'middle', x: 100, y: 700});
        this.text = document.createTextNode('');

        this.label.appendChild(this.text);
        mmap.appendChild(this.label);

        this.createMap();
        this.addListeners();

        this.mmap = mmap;
        this.count = 0;
        this.seen = {};
        this.groups = {};


        let hilite = this.newElement("path", {"id": "hilite", "fill": "white", "stroke-width": "5", "stroke": "black", "opacity": "0.1"});
        document.getElementById("Risk").appendChild(hilite);

        this.hilite = document.getElementById("hilite");

        this.game = new Game(this, countries, mmap);
        this.game.turn(mmap);

    }

    createMap() {
        let self = this;
        let nations, nation, n;
        land.forEach(function (continent) {
            self.createGroup(continent.id, continent.attr);

            nations = countries[continent.id];

            for (n in nations) {
                nation = self.createPath(nations[n].id, continent.id, nations[n].d);
            }
        });
    }

    addListeners() {
        let self = this;

        countries = document.getElementsByClassName('country');
        for (let i = 0; i < countries.length; i++) {
            let country = countries[i];
            country.addEventListener('mouseover', function (evt) {
                self.mouseoverCountry(evt);
            });

        }
    }

    createPath(id, gid, coords) {
        let attr = {"id": id, "d": coords, "class": "country"};
        let newpath = this.newElement("path", attr);
        document.getElementById(gid).appendChild(newpath);
    }

    createGroup(id, attr) {
        attr.id = id;
        let group = this.newElement("g", attr);
        document.getElementById("map").appendChild(group);
    }

    newElement(type, attrs) {
        let result = document.createElementNS("http://www.w3.org/2000/svg", type);
        if (result) {
            Object.keys(attrs).forEach(function (key) {
                if (attrs.hasOwnProperty(key)) {
                    result.setAttribute(key, attrs[key]);
                }
            });
        }
        return result;
    }

    mousedown(evt) {
        let country = evt.target;
        let b = country.getBBox();
        let self = this;
        let label = '';
        let id = country.getAttribute('id');
        let text = '';

        if (!this.seen[id]) {
            label = self.newElement('text', {id:'armies-label-' + id, 'font-size': 10, stroke: 'none', fill: 'black', 'text-insert': 'middle', x: b.x + b.width / 4, y: ((b.y + b.height / 3) + 25)});
            text = document.createTextNode('');
            this.seen[id] = {label: label, text: text};
        } else {
            label = this.seen[id].label;
            text = this.seen[id].text;
        }

        if (!country['army']) {
            country['army'] = 1;
        }


        text.textContent = country['army']++;
        label.appendChild(text);
        this.mmap.appendChild(label);
    }

    mouseoverCountry(evt) {
        let country = evt.target;
        //let dim = country.getBoundingClientRect();
        //let x = evt.clientX - dim.left;
        //let y = evt.clientY - dim.top;

        let b = country.getBBox();
        let label = '';
        let text = '';
        let id = country.getAttribute('id');

        if (!this.groups[id]) {
            label = this.newElement('text', {id:'name-label-' + id, 'font-size': 10, stroke: 'none', fill:'black', 'text-insert':'middle', x:b.x + b.width / 4, y:b.y + b.height / 3});

            text = document.createTextNode('');
            text.textContent = country.getAttribute('id');
            this.groups[id] = {label: label, text: text};

            label.appendChild(text);
            this.mmap.appendChild(label);
        }


        let outline = country.getAttribute('d');
        this.hilite.setAttribute('d', outline);

    }

}