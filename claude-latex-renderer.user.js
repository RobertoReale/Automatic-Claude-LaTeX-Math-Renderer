// ==UserScript==
// @name         Claude LaTeX Math Renderer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Renders LaTeX in Claude with native spacing and formatting
// @author       Roberto Reale
// @match        https://claude.ai/*
// @icon         https://claude.ai/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('Claude Exact Math Renderer starting...');

    // Add KaTeX for rendering
    const katexCSS = document.createElement('link');
    katexCSS.rel = 'stylesheet';
    katexCSS.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
    document.head.appendChild(katexCSS);

    const katexScript = document.createElement('script');
    katexScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
    document.head.appendChild(katexScript);

    // Process and render LaTeX elements
    function processLatexElements() {
        // Look for unprocessed content with potential LaTeX formulas
        document.querySelectorAll('.message-content').forEach(container => {
            if (container.dataset.mathProcessed === 'true') return;

            // Find all text nodes with potential LaTeX
            const textNodes = [];
            const walker = document.createTreeWalker(
                container,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node;
            while (node = walker.nextNode()) {
                const text = node.nodeValue;
                if (text.includes('$$') ||
                    (text.includes('\\vec') || text.includes('\\cdot')) ||
                    text.includes('\\mathbf')) {
                    textNodes.push(node);
                }
            }

            // Process text nodes with LaTeX
            textNodes.forEach(textNode => {
                const text = textNode.nodeValue;
                // Skip if no LaTeX content
                if (!text.includes('$$') &&
                    !text.includes('\\vec') &&
                    !text.includes('\\cdot') &&
                    !text.includes('\\mathbf')) return;

                // Replace text node with LaTeX rendering
                const parent = textNode.parentNode;
                const fragment = document.createDocumentFragment();

                // Process the text into parts
                const parts = splitTextWithLatex(text);
                parts.forEach(part => {
                    if (part.type === 'latex') {
                        const mathElement = document.createElement('span');
                        mathElement.style.display = 'block';
                        mathElement.style.margin = '0.5em 0';
                        mathElement.style.textAlign = 'center';

                        try {
                            if (window.katex) {
                                // Clean up the LaTeX formula
                                let formula = part.content
                                    .replace(/^\$\$\s*/, '')
                                    .replace(/\s*\$\$$/, '')
                                    .replace(/\\vec\{([^}]+)\}/g, '\\mathbf{$1}')
                                    .replace(/\\cdot/g, ' \\cdot ')
                                    .replace(/P_0/g, 'P_{0}')
                                    .trim();

                                window.katex.render(formula, mathElement, {
                                    displayMode: true,
                                    throwOnError: false,
                                    output: 'html'
                                });
                            }
                        } catch (err) {
                            console.error('Error rendering:', err);
                            mathElement.textContent = part.content;
                        }

                        fragment.appendChild(mathElement);
                    } else {
                        const textElement = document.createTextNode(part.content);
                        fragment.appendChild(textElement);
                    }
                });

                // Replace the original text node
                parent.replaceChild(fragment, textNode);
            });

            container.dataset.mathProcessed = 'true';
        });

        // Also process katex-error elements directly
        document.querySelectorAll('.katex-error').forEach(element => {
            if (element.dataset.processed === 'true') return;

            const text = element.textContent;
            const mathElement = document.createElement('span');
            mathElement.style.display = 'block';
            mathElement.style.margin = '0.5em 0';
            mathElement.style.textAlign = 'center';

            try {
                // Get formula from the error message or the element content
                let formula = text;
                if (text.includes('KaTeX parse error')) {
                    const match = text.match(/position \d+: (.*?)$/);
                    if (match && match[1]) {
                        formula = match[1].trim();
                    }
                }

                // Clean up formula
                formula = formula
                    .replace(/^\$\$\s*/, '')
                    .replace(/\s*\$\$$/, '')
                    .replace(/\\vec\{([^}]+)\}/g, '\\mathbf{$1}')
                    .replace(/\\cdot/g, ' \\cdot ')
                    .replace(/P_0/g, 'P_{0}')
                    .trim();

                if (window.katex) {
                    window.katex.render(formula, mathElement, {
                        displayMode: true,
                        throwOnError: false,
                        output: 'html'
                    });

                    // Replace the error element
                    if (element.parentNode) {
                        element.parentNode.replaceChild(mathElement, element);
                    }
                }
            } catch (err) {
                console.error('Error rendering error element:', err);
                element.dataset.processed = 'true';
            }
        });
    }

    // Helper function to split text with LaTeX formulas
    function splitTextWithLatex(text) {
        const parts = [];
        let currentIndex = 0;
        let inMath = false;
        let mathStart = 0;

        // Find all occurrences of $$ (LaTeX display math)
        for (let i = 0; i < text.length - 1; i++) {
            if (text[i] === '$' && text[i+1] === '$') {
                if (!inMath) {
                    // End of regular text, start of math
                    if (i > currentIndex) {
                        parts.push({
                            type: 'text',
                            content: text.substring(currentIndex, i)
                        });
                    }
                    mathStart = i;
                    inMath = true;
                    i++; // Skip the second $
                } else {
                    // End of math, start of regular text
                    parts.push({
                        type: 'latex',
                        content: text.substring(mathStart, i+2)
                    });
                    inMath = false;
                    currentIndex = i + 2;
                    i++; // Skip the second $
                }
            }
        }

        // Add remaining text
        if (currentIndex < text.length) {
            parts.push({
                type: 'text',
                content: text.substring(currentIndex)
            });
        }

        return parts;
    }

    // Add CSS to match the exact spacing
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .katex-display {
            /* Use the same spacing as the original page */
            margin-top: calc(.375rem * calc(1 - var(--tw-space-y-reverse)));
            margin-bottom: calc(.375rem * var(--tw-space-y-reverse));
            text-align: center;
        }
        .katex {
            /* Inherit font size and line height from parent */
            font-size: inherit;
            line-height: 1.65rem;
            text-indent: 0;
        }
        .message-content {
            /* Match the original line height and letter-spacing */
            line-height: 1.65rem;
            letter-spacing: -0.015em;
        }
    `;
    document.head.appendChild(styleElement);

    // Set up observer for content changes
    const observer = new MutationObserver(() => {
        clearTimeout(window.mathRenderTimer);
        window.mathRenderTimer = setTimeout(() => {
            if (window.katex) {
                processLatexElements();
            }
        }, 300);
    });

    // Initialize our renderer
    function initRenderer() {
        if (window.katex) {
            processLatexElements();

            // Start observing
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });

            // Check for new content periodically
            setInterval(() => {
                const unprocessed = document.querySelector('.message-content:not([data-math-processed="true"])');
                if (unprocessed) {
                    processLatexElements();
                }
            }, 2000);

            console.log('Math renderer fully initialized');
        } else {
            // Wait for KaTeX to load
            console.log('Waiting for KaTeX to load...');
            setTimeout(initRenderer, 500);
        }
    }

    // Start initialization when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initRenderer, 1000));
    } else {
        setTimeout(initRenderer, 1000);
    }

    console.log('Claude Math Renderer setup complete');
})();
