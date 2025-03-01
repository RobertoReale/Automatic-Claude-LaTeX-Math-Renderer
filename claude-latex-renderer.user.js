// ==UserScript==
// @name         Automatic Claude LaTeX Math Renderer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically renders LaTeX math formulas in Claude conversations
// @author       Roberto Reale
// @match        https://claude.ai/*
// @icon         https://claude.ai/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Insert MathJax library
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-AMS_CHTML';
    document.getElementsByTagName('head')[0].appendChild(script);
    
    // Configure MathJax
    window.MathJax = {
        tex2jax: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true
        },
        CommonHTML: {linebreaks: {automatic: true}},
        "HTML-CSS": {linebreaks: {automatic: true}},
        SVG: {linebreaks: {automatic: true}}
    };
    
    // Function to trigger rendering
    function renderMathJax() {
        if (window.MathJax && window.MathJax.Hub) {
            // Queue the typesetting operation twice for better rendering
            for (var i = 0; i < 2; i++) {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }
            console.log('LaTeX rendering complete');
        } else {
            console.log('MathJax not loaded yet, waiting...');
            setTimeout(renderMathJax, 500);
        }
    }
    
    // Set up mutation observer for auto-rendering
    var debounceTimer;
    var observer = new MutationObserver(function(mutations) {
        // Debounce to prevent too frequent renderings
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
            renderMathJax();
        }, 300);
    });
    
    // Start observing the document
    function startObserver() {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        console.log('Observer started');
    }
    
    // Initial render when page loads
    window.addEventListener('load', function() {
        console.log('Page loaded, initializing LaTeX renderer');
        // Initial render
        setTimeout(renderMathJax, 1000);
        // Start observer
        startObserver();
    }, false);
    
    // Also start observer after a delay in case the load event already fired
    setTimeout(function() {
        if (!observer.takeRecords().length) {
            startObserver();
        }
        renderMathJax();
    }, 1500);
    
    // Periodically re-render to catch any missed formulas
    setInterval(renderMathJax, 5000);
    
    console.log('Automatic Claude LaTeX Math Renderer initialized');
})();
