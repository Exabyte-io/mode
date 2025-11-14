from mat3ra.mode import Method, Model


def test_can_be_created():
    config = {"type": "dft", "subtype": "gga"}
    model = Model.create(config)
    assert model.type == "dft"
    assert model.subtype == "gga"


def test_type_property():
    model = Model.create({"type": "dft", "subtype": "gga"})
    type_value = model.type

    assert isinstance(type_value, str)
    assert type_value == "dft"


def test_subtype_property():
    model = Model.create({"type": "dft", "subtype": "gga"})
    subtype_value = model.subtype

    assert subtype_value is not None
    assert subtype_value == "gga"


def test_method_property_returns_method_instance():
    model = Model.create(
        {
            "type": "dft",
            "subtype": "gga",
            "method": {"type": "pseudopotential", "subtype": "nc"},
        }
    )

    method_value = model.method

    assert method_value is not None
    assert isinstance(method_value, Method)

    assert hasattr(method_value, "data")
    assert hasattr(method_value, "search_text")
    assert hasattr(method_value, "to_json")


def test_default_config():
    config = Model.get_default_config()
    assert "type" in config
    assert "subtype" in config
    assert "method" in config


def test_to_json():
    model = Model.create(
        {
            "type": "dft",
            "subtype": "gga",
            "method": {"type": "pseudopotential", "subtype": "us"},
        }
    )

    json_data = model.to_dict()
    assert json_data["type"] == "dft"
    assert json_data["subtype"] == "gga"
    assert "method" in json_data
    assert json_data["method"]["type"] == "pseudopotential"


def test_allowed_types():
    model = Model.create({"type": "dft", "subtype": "gga"})
    allowed = model.allowed_types

    assert len(allowed) > 0
    assert all(hasattr(t, "slug") for t in allowed)


def test_allowed_subtypes():
    model = Model.create({"type": "dft", "subtype": "gga"})
    allowed = model.allowed_subtypes

    assert len(allowed) > 0
    assert all(hasattr(t, "slug") for t in allowed)
