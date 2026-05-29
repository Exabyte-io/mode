from typing import Any, Dict, Optional

from mat3ra.code.entity import InMemoryEntityPydantic
from mat3ra.code.mixins import HashedEntityMixin
from mat3ra.esse.models.method import BaseMethod, Data
from pydantic import Field


class MethodData(Data, InMemoryEntityPydantic):
    searchText: Optional[str] = Field(default=None, exclude_if=lambda v: v is None)

class Method(BaseMethod, HashedEntityMixin, InMemoryEntityPydantic):
    type: str = Field(default="unknown")
    subtype: str = Field(default="unknown")
    data: MethodData = Field(default_factory=MethodData)

    def clone_without_data(self) -> "Method":
        cloned = self.clone()
        cloned.data = MethodData()
        return cloned

    @classmethod
    def clean(cls, config: Dict[str, Any]) -> Dict[str, Any]:
        raw_data = config.get("data",{})
        cleaned = super().clean(config)
        cleaned["data"] = MethodData(**raw_data).model_dump()
        return cleaned

    @property
    def search_text(self) -> str:
        return self.data.searchText or ""

    def get_hash_object(self) -> Dict[str, Any]:
        return self.to_dict(exclude=["data"])
