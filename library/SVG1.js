/**
 *
 */
class SVG {
    /**
     *
     * @param _SVG
     */
    constructor(_SVG) {
        this._SVG = _SVG;
        let attr = {id:"Risk", width:"100%", height:"100%", viewBox:"0 0 1024 792"};
        let element =  this.newElement("svg", attr);
        this.appendChild("body", element);
    }

    /**
     *
     * @param id
     * @param gid
     * @param coords
     * @param clas
     */
    createPath(id, gid, coords, clas) {
        let attr = {"id": id, "d": coords, "class": clas};
        let element = this.newElement("path", attr);
        this.appendChild(gid, element);
    }

    /**
     *
     * @param id
     * @param attr
     */
    createGroup(id, attr) {
        attr.id = id;
        let element = this.newElement("g", attr);
        this.appendChild("map", element);
    }

    /**
     *
     * @param type
     * @param attrs
     * @returns {Element}
     */
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

    /**
     * 
     * @param id
     * @param element
     */
    appendChild(id, element) {
        document.getElementById(id).appendChild(element);
    }
}