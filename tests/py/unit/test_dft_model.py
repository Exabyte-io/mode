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
    assert len(refiners) > 0


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
    assert len(modifiers) > 0


def test_group_slug():
    dft_model = DFTModel.create(
        {
            "type": "dft",
            "subtype": "gga",
            "functional": {"slug": "pbe"},
        }
    )

    slug = dft_model.group_slug
    assert isinstance(slug, str)
    assert "dft" in slug
    assert "gga" in slug
    assert "pbe" in slug


def test_to_json_includes_functional():
    dft_model = DFTModel.create(
        {
            "type": "dft",
            "subtype": "gga",
            "functional": {"slug": "pbe"},
        }
    )

    json_data = dft_model.to_dict()
    assert "functional" in json_data
    assert json_data["functional"]["slug"] == "pbe"


def test_all_functionals():
    dft_model = DFTModel.create(
        {
            "type": "dft",
            "subtype": "gga",
        }
    )

    functionals = dft_model.all_functionals
    assert len(functionals) > 0
    assert all(hasattr(f, "slug") for f in functionals)


def test_all_refiners():
    dft_model = DFTModel.create(
        {
            "type": "dft",
            "subtype": "gga",
        }
    )

    refiners = dft_model.all_refiners
    assert isinstance(refiners, list)


def test_all_modifiers():
    dft_model = DFTModel.create(
        {
            "type": "dft",
            "subtype": "gga",
        }
    )

    modifiers = dft_model.all_modifiers
    assert isinstance(modifiers, list)

