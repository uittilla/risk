class Player {
    constructor(id, colour) {
        this.id = id;
        this.colour = colour;
        this.armies = 10;
        this.army=1;
        this.turn = false;
        this.countries = {};
    }
}

class Game {
    constructor(SVG, countries, mmap) {
        this.countries = countries;
        let p1 = new Player(1, 'red');
        let p2 = new Player(2, 'blue');

        p1.turn = true;
        this.players = [p1, p2];

        this.svg = SVG;
        this.seen = {};
        this.country = {};
        this.mmap = mmap;
        this.phase2 = false;
    }

    turn(mmap) {
        let self = this;
        let countries = document.getElementsByClassName('country');
        
        for (let i = 0; i < countries.length; i++)
        {
            let country = countries[i];

            country.addEventListener('mousedown', function(evt) {
                console.log(country);
                self.mousedown(evt);
            });
        }
    }

    mousedown(evt) {
        let country = evt.target;
        let b = country.getBBox();
        let self = this;
        let label = '';
        let id = country.getAttribute('id');
        let text = '';

        if(this.phase2) {
            console.log("Phase 2");
            
        }

        if(!this.country[id]){
            this.country[id] = country;
        }

        if(!this.seen[id]) {
            label = this.svg.newElement( 'text', {
                id:'armies-label-' + id,
                'font-size':10, stroke:'none',
                fill:'black',
                'text-insert':'middle',
                x: b.x + b.width / 4,
                y:((b.y + b.height / 3) + 25)
            } );
            text  = document.createTextNode( '' );
            this.seen[id] = { label: label, text: text };
        } else {
            label = this.seen[id].label;
            text  = this.seen[id].text;
        }

        var player;

        player = (this.players[0].turn) ? this.players[0] : this.players[1];

        if(player.armies > 0) {
            //this.phase2 = true;
        } else {
            player.turn = false;
            player = this.players[1];
            player.turn = true;
        }

        if(player.turn && player.army <= 10) {
            if(!this.country[id]['army']) {  this.country[id]['army'] = 1; }
            if(!this.country[id]['player']) {  this.country[id]['player'] = player.id; }

            text.textContent = this.country[id]['army']++;
            label.appendChild(text);
            self.mmap.appendChild(label);
            country.setAttribute('fill', player.colour);
            player.armies--;
            player.army++;
        }

        if(this.players[0].armies == 0 && this.players[1].armies == 0) {
            this.phase2 = true;
        }

        console.log(player);

    }


}