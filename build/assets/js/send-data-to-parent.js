/**
 * Handles communication to a parent container when this project is
 * hosted within an iframe.
 */

(function () {
    /**
     * Handler to send height data to parent window.
     * Useful for responsively sizing the iframe this content
     * will be loaded to.
     */
    window.sendContentDataToParent = function sendContentDataToParent() {
        var targetElementContainer = document.querySelector('.explorer');
        var targetId = targetElementContainer.getAttribute('id');

        if (!targetId || !targetId.length) {
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
    window.addEventListener('load', window.sendContentDataToParent);

    // Bind to resize, debounce
    window.addEventListener('resize', function () {
        clearTimeout(debouncer);
        debouncer = setTimeout(window.sendContentDataToParent, 300);
    });
}());
