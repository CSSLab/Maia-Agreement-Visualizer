/**
 * Handles communication to a parent container when this project is
 * hosted within an iframe.
 */

(function() {
    /**
     * Handler to send height data to parent window.
     * Useful for responsively sizing the iframe this content
     * will be loaded to.
     */
    function sendContentDataToParent() {
        var targetElementContainer = document.querySelector('.explorer');
        var targetId = targetElementContainer.getAttribute('id');

        if(!id || !id.length) {
            targetId = 'msr-chess-experience';
        }

        var data = {};
        if (targetElementContainer) {
            data = {
                height: targetElementContainer.offsetHeight,
                id: targetId
            };
        }
        window.parent.postMessage(data, '*');
    }

    // Init debouncer
    var debouncer = null;

    // Bind to load
    //window.parent.addEventListener('load', sendContentDataToParent);

    // Bind to resize, debounce
    window.addEventListener('resize', function() {
        clearTimeout(debouncer);
        debouncer = setTimeout(sendContentDataToParent, 300);
    });
}());

