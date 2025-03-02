# Claude LaTeX Math Renderer

A Tampermonkey userscript that renders LaTeX mathematical formulas in Claude AI conversations with native spacing and formatting.

## Features

- Automatically detects and renders LaTeX math formulas in Claude's responses
- Uses KaTeX for high-quality math rendering
- Maintains Claude's native spacing and formatting
- Handles both inline and display math notation
- Supports common math notations like vectors and dot products
- Processes formulas in real-time as new messages appear

## Installation

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension:
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
   - [Safari](https://apps.apple.com/app/tampermonkey/id1482490089)

2. Create a new userscript in Tampermonkey and copy the entire script content into it.

3. Save the script and ensure it's enabled in Tampermonkey.

## Usage

1. Visit [Claude AI](https://claude.ai)
2. The script automatically activates and renders any LaTeX formulas in Claude's responses
3. LaTeX formulas enclosed in double dollar signs `$$...$$` will be rendered as display math
4. The script also handles special notations like `\vec`, `\cdot`, and `\mathbf`

## Examples

The script will automatically render mathematical expressions like:

```
The quadratic formula is $$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

A vector can be represented as $$\vec{v} = (x, y, z)$$

The dot product is calculated as $$\vec{a} \cdot \vec{b} = a_x b_x + a_y b_y + a_z b_z$$
```

## How It Works

1. The script injects KaTeX CSS and JavaScript libraries into the Claude page
2. It searches for text nodes containing LaTeX formulas (enclosed in `$$...$$` or containing specific math commands)
3. When found, it extracts the formulas, processes them, and renders them using KaTeX
4. A MutationObserver watches for new content to process formulas in real-time
5. Custom CSS ensures the rendered math matches Claude's native styling

## Compatibility

- Works with Claude AI web interface (https://claude.ai)
- Tested with major browsers (Chrome, Firefox, Edge, Safari)
- Compatible with Tampermonkey version 4.18 and above

## Troubleshooting

- If formulas aren't rendering, check the browser console for errors
- Ensure Tampermonkey is enabled and the script is active
- Try refreshing the page if the KaTeX library fails to load
- For complex formulas that don't render correctly, check KaTeX documentation for supported syntax

## License

This project is open source. Feel free to modify and distribute as needed.

## Credits

- Original author: Roberto Reale
- KaTeX: https://katex.org/
- Tampermonkey: https://www.tampermonkey.net/

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
