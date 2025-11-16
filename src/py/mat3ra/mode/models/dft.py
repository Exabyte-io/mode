from typing import Any, List, Union

from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry
from mat3ra.esse.models.model.mixins.dft.gga_functional import Functional
from pydantic import Field, field_validator

from ..model import Model


class DFTModel(Model):
    functional: Union[SlugifiedEntry, None] = Field(default=Functional.pbe.value)
    refiners: List[SlugifiedEntry] = Field(default_factory=list)
    modifiers: List[SlugifiedEntry] = Field(default_factory=list)

    @field_validator("functional", mode="before")
    @classmethod
    def _coerce_functional(cls, value: Any) -> Union[SlugifiedEntry, None]:
        """Convert string to SlugifiedEntry if needed."""
        if value is None:
            return None
        if isinstance(value, SlugifiedEntry):
            return value
        if isinstance(value, str):
            return SlugifiedEntry(name=value, slug=value)
        if isinstance(value, dict):
            return SlugifiedEntry(**value)
        return value

    @field_validator("refiners", "modifiers", mode="before")
    @classmethod
    def _coerce_list_of_entries(cls, value: Any) -> List[SlugifiedEntry]:
        """Convert list of strings to list of SlugifiedEntry if needed."""
        if not value:
            return []
        result = []
        for item in value:
            if isinstance(item, SlugifiedEntry):
                result.append(item)
            elif isinstance(item, str):
                result.append(SlugifiedEntry(name=item, slug=item))
            elif isinstance(item, dict):
                result.append(SlugifiedEntry(**item))
            else:
                result.append(item)
        return result

