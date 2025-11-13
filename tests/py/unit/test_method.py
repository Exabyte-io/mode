"""Tests for Method class."""

from mat3ra.mode import Method


def test_can_be_created():
    config = {"type": "pseudopotential", "subtype": "us"}
    method = Method.create(config)
    assert method.type == "pseudopotential"
    assert method.subtype == "us"


def test_type_property():
    method = Method.create({"type": "pseudopotential", "subtype": "us"})
    type_value = method.type

    assert isinstance(type_value, str)
    assert type_value == "pseudopotential"


def test_subtype_property():
    method = Method.create({"type": "pseudopotential", "subtype": "us"})
    subtype_value = method.subtype

    assert subtype_value is not None
    assert subtype_value == "us"


def test_data_property():
    method = Method.create(
        {
            "type": "pseudopotential",
            "subtype": "us",
            "data": {"key": "value"},
        }
    )

    data = method.data
    assert isinstance(data, dict)
    assert data["key"] == "value"


def test_default_config():
    config = Method.get_default_config()
    assert "type" in config
    assert "subtype" in config


def test_set_data():
    method = Method.create({"type": "pseudopotential", "subtype": "us"})
    method.data = {"test": "data"}

    assert method.data["test"] == "data"


def test_set_search_text():
    method = Method.create({"type": "pseudopotential", "subtype": "us"})
    method.data = {"searchText": "test search"}

    assert method.search_text == "test search"


def test_clean_data():
    method = Method.create(
        {
            "type": "pseudopotential",
            "subtype": "us",
            "data": {"field1": "value1", "field2": "value2"},
        }
    )

    cleaned = method.clean_data(["field1"])
    assert "field2" in cleaned
    assert "field1" not in cleaned


def test_to_json():
    method = Method.create(
        {
            "type": "pseudopotential",
            "subtype": "us",
            "data": {"key": "value"},
        }
    )

    json_data = method.to_dict()
    assert json_data["type"] == "pseudopotential"
    assert json_data["subtype"] == "us"
    assert "data" in json_data


def test_clone_without_data():
    method = Method.create(
        {
            "type": "pseudopotential",
            "subtype": "us",
            "data": {"key": "value"},
        }
    )

    cloned = method.clone_without_data()
    assert cloned.type == method.type
    assert cloned.data == {}
