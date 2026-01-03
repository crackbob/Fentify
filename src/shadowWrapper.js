export default {
    instance: null,

    get wrapper () {
        if (!this.instance) {
            const iframe = document.createElement('iframe');
            document.body.appendChild(iframe);

            let attachShadow = iframe.contentWindow.Element.prototype.attachShadow;
            iframe.remove();
            
            let container = document.createElement('div');
            this.root = attachShadow.apply(container, [{ mode: 'closed' }]);

            let hostEl = document.createElement('div');
            this.root.appendChild(hostEl);

            this.instance = hostEl;

            document.body.appendChild(container);
        }

        return this.instance;
    }
}