from typing import Any, Dict, List, Union

from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry
from mat3ra.esse.models.models_directory.legacy.dft import Functional7
from pydantic import Field

from ..model import Model


class DFTModel(Model):
    type: str = Field(default="dft")
    subtype: str = Field(default="gga")
    functional: Union[str, Functional7, SlugifiedEntry, Dict[str, Any], None] = Field(
        default=Functional7.pbe
    )
    refiners: List[Union[SlugifiedEntry, str]] = Field(default_factory=list)
    modifiers: List[Union[SlugifiedEntry, str]] = Field(default_factory=list)

