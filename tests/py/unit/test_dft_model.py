from mat3ra.mode import DFTModel, Method


def test_method_returns_method_instance():
    dft_model = DFTModel.create(
        {
            "type": "dft",
            "subtype": "gga",
            "functional": "pbe",
            "method": {"type": "pseudopotential", "subtype": "nc"},
        }
    )

    method_value = dft_model.method

    assert method_value is not None
    assert isinstance(method_value, Method)

    assert hasattr(method_value, "data")
    assert hasattr(method_value, "search_text")


def test_functional_property():
    dft_model = DFTModel.create(
        {
            "type": "dft",
            "subtype": "gga",
            "functional": "pbe",
        }
    )

    functional = dft_model.functional
    assert functional is not None


def test_refiners_property():
    dft_model = DFTModel.create(
        {
            "type": "dft",
            "subtype": "gga",
            "functional": "pbe",
            "refiners": ["hse"],
        }
    )

    refiners = dft_model.refiners
    assert isinstance(refiners, list)
    assert len(refiners) == 1


def test_modifiers_property():
    dft_model = DFTModel.create(
        {
            "type": "dft",
            "subtype": "gga",
            "functional": "pbe",
            "modifiers": ["soc"],
        }
    )

    modifiers = dft_model.modifiers
    assert isinstance(modifiers, list)
    assert len(modifiers) == 1


def test_group_slug():
    dft_model = DFTModel.create(
        {
            "type": "dft",
            "subtype": "gga",
        }
    )

    slug = dft_model.group_slug
    assert isinstance(slug, str)
    assert "dft" in slug
    assert "gga" in slug


def test_to_dict_includes_functional():
    dft_model = DFTModel.create(
        {
            "type": "dft",
            "subtype": "gga",
            "functional": "pbe",
        }
    )

    json_data = dft_model.to_dict()
    assert "functional" in json_data



