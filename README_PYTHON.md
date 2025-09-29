# Mode.py - Python Version

This directory contains the Python version of the MOdel and method DEfinitions library, converted from the original JavaScript implementation.

## Structure

```
src/
├── js/          # Original JavaScript code
└── py/          # Python version
    ├── data/    # Data files (method_list, model_list, model_method_map)
    ├── methods/ # Method implementations
    ├── models/  # Model implementations
    └── ...      # Core modules

tests/
├── js/          # JavaScript tests
└── py/          # Python tests
```

## Installation

For development:

```bash
pip install -e ".[dev]"
```

## Usage

```python
from src.py import Method, Model, MethodFactory, ModelFactory

# Create a method
method = Method({'type': 'pseudopotential', 'subtype': 'us'})

# Create a model
model = Model(type='dft', subtype='gga')

# Use factories
method = MethodFactory.create({'type': 'pseudopotential'})
model = ModelFactory.create({'type': 'dft'})
```

## Testing

Run Python tests:

```bash
npm run test:python
# or
python -m pytest tests/py/
```

## Development

Format code:
```bash
npm run format:python
# or
python -m black src/py tests/py/
```

Lint code:
```bash
npm run lint:python
# or
python -m flake8 src/py tests/py/
```

## Key Differences from JavaScript Version

1. **Type Hints**: Python version includes comprehensive type hints
2. **Property Access**: Uses Python properties instead of getter methods
3. **Error Handling**: Uses Python exceptions instead of JavaScript error handling
4. **Data Structures**: Uses Python dictionaries and lists instead of JavaScript objects and arrays
5. **Module System**: Uses Python imports instead of ES6 modules

## Compatibility

The Python version maintains API compatibility with the JavaScript version where possible, with adaptations for Python conventions and best practices.

