"""Utility functions for mode package."""

from typing import List, TypeVar, Union

T = TypeVar("T")


def safe_make_array(value: Union[T, List[T]]) -> List[T]:
    """Convert a value to a list if it isn't already.

    Args:
        value: A single value or list of values

    Returns:
        List containing the value(s)
    """
    if isinstance(value, list):
        return value
    return [value]
