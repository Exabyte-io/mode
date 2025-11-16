from typing import List, Union, Dict, Any

from mat3ra.esse.models.core.primitive.slugified_entry import SlugifiedEntry
from mat3ra.esse.models.model.mixins.dft.gga_functional import Functional
from pydantic import Field

from ..model import Model


class DFTModel(Model):
    functional: Union[SlugifiedEntry,Dict[str, Any], str, None] = Field(default=Functional.pbe.value)
    refiners: List[Union[SlugifiedEntry, str]] = Field(default_factory=list)
    modifiers: List[Union[SlugifiedEntry, str]] = Field(default_factory=list)

