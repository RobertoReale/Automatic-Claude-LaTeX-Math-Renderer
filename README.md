# Automatic Claude LaTeX Math Renderer

A Tampermonkey userscript that automatically renders LaTeX math formulas in Claude.ai conversations.

## Features

- Automatically injects MathJax library into Claude.ai
- Configures MathJax to recognize standard LaTeX delimiters
- Renders both inline math ($ ... $) and display math ($$ ... $$)
- Detects new content dynamically using MutationObserver
- Performs multiple render passes for complex expressions

## Installation

1. Install the [Tampermonkey](https://www.tampermonkey.net/) extension for your browser
2. Click on the Tampermonkey icon and select "Create a new script"
3. Delete any default content and paste the entire script into the editor
4. Save the script (Ctrl+S or File > Save)
5. Navigate to [Claude.ai](https://claude.ai) to use it

## Usage

Once installed, the script works automatically. Any LaTeX math expressions in your Claude conversations will be rendered in real-time:

- Inline math: Write expressions between single dollar signs `$E=mc^2$`
- Display math: Write expressions between double dollar signs `$$\int_a^b f(x) dx$$`

## How It Works

The script:
1. Loads MathJax from a CDN
2. Configures it to detect standard LaTeX delimiters
3. Sets up a mutation observer to watch for changes in the DOM
4. Renders math expressions as they appear in the conversation

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

[MIT License](LICENSE)

## Author

Roberto Reale
