import pytest
from mat3ra.mode import DFTModel, Model, ModelFactory


def test_create_basic_model():
    config = {"type": "ml", "subtype": "re"}
    model = ModelFactory.create(config)

    assert isinstance(model, Model)
    assert model.type == "ml"


def test_create_dft_model():
    config = {"type": "dft", "subtype": "gga"}
    model = ModelFactory.create(config)

    assert isinstance(model, DFTModel)
    assert model.type == "dft"


def test_create_from_application_requires_application():
    config = {"type": "dft", "subtype": "gga"}

    with pytest.raises(ValueError, match="application is required"):
        ModelFactory.create_from_application(config)

