from typing import Any, Dict, Optional, Type, TypeVar

from mat3ra.code.entity import InMemoryEntityPydantic
from mat3ra.code.mixins import HashedEntityMixin
from mat3ra.esse.models.model import BaseModelModel
from pydantic import Field

from .method import Method
from .methods.factory import MethodFactory

T = TypeVar("T", bound="Model")


class Model(BaseModelModel, HashedEntityMixin, InMemoryEntityPydantic):
    method: Method = Field(default_factory=lambda: MethodFactory.create({}))

    @classmethod
    def create(cls: Type[T], config: Dict[str, Any]) -> T:
        # When called on the base Model class, delegate to ModelFactory
        # for types that have specialized subclasses (e.g. DFTModel for "dft"),
        # so all fields (like functional) are preserved.
        if cls is Model:
            model_type = config.get("type", "")
            if model_type == "dft":
                from .models.factory import ModelFactory

                return ModelFactory.create(config)
        return super().create(config)

    application: Optional[Dict[str, Any]] = Field(default=None, exclude=True)


    def __convert_kwargs__(self, **kwargs: Any) -> Dict[str, Any]:
        if isinstance(kwargs.get("method"), dict):
            kwargs["method"] =  MethodFactory.create(kwargs.get("method", Method().to_dict()))
        if isinstance(kwargs.get("subtype"), dict):
            kwargs["subtype"] =  str(kwargs["subtype"].get("slug", ""))
        return kwargs

    def __init__(self, *args: Any, **kwargs: Any):
        kwargs = self.__convert_kwargs__(**kwargs)
        super().__init__(*args, **kwargs)


    @property
    def group_slug(self) -> str:
        if not self.application:
            return f"{self.type}:{self.subtype}"
        short_name = self.application.get("shortName", "")
        return f"{short_name}:{self.type}:{self.subtype}"

    @property
    def is_unknown(self) -> bool:
        return self.type == "unknown"

    def get_hash_object(self) -> Dict[str, Any]:
        cfg = self.to_dict()
        cfg["method"] = self.method.calculate_hash()
        return cfg
