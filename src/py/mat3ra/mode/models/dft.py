from typing import Any, Dict, List, Union

from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry
from mat3ra.esse.models.models_directory.legacy.dft import Functional1
from pydantic import Field, field_validator

from ..model import Model


class DFTModel(Model):
    type: str = Field(default="dft")
    subtype: str = Field(default="gga")
    functional: Union[Functional1, SlugifiedEntry, Dict[str, Any], None] = Field(
        default=Functional1.pbe
    )
    refiners: List[Union[SlugifiedEntry, str]] = Field(default_factory=list)
    modifiers: List[Union[SlugifiedEntry, str]] = Field(default_factory=list)

    @field_validator('functional', mode='before')
    @classmethod
    def convert_functional_string(cls, v):
        if isinstance(v, str):
            return {"slug": v}
        return v

