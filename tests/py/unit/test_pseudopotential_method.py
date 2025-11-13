from mat3ra.mode import PseudopotentialMethod


def test_can_be_created():
    config = {"type": "pseudopotential", "subtype": "us"}
    method = PseudopotentialMethod.create(config)
    assert method.type == "pseudopotential"


def test_pseudo_property():
    method = PseudopotentialMethod.create(
        {
            "type": "pseudopotential",
            "subtype": "us",
            "data": {"pseudo": [{"element": "Si"}]},
        }
    )

    pseudo = method.pseudo
    assert isinstance(pseudo, list)
    assert len(pseudo) == 1
    assert pseudo[0]["element"] == "Si"


def test_all_pseudo_property():
    method = PseudopotentialMethod.create(
        {
            "type": "pseudopotential",
            "subtype": "us",
            "data": {"allPseudo": [{"element": "Si"}, {"element": "O"}]},
        }
    )

    all_pseudo = method.all_pseudo
    assert isinstance(all_pseudo, list)
    assert len(all_pseudo) == 2


def test_extract_exchange_correlation():
    subworkflow = {
        "model": {
            "subtype": "gga",
            "functional": {"slug": "pbe"},
        }
    }

    result = PseudopotentialMethod.extract_exchange_correlation_from_subworkflow(subworkflow)
    assert result["approximation"] == "gga"
    assert result["functional"] == "pbe"


def test_to_json_with_clean_data_excludes_all_pseudo():
    method = PseudopotentialMethod.create(
        {
            "type": "pseudopotential",
            "subtype": "us",
            "data": {
                "pseudo": [{"element": "Si"}],
                "allPseudo": [{"element": "Si"}, {"element": "O"}],
            },
        }
    )

    json_data = method.to_json_with_clean_data()
    assert "allPseudo" not in json_data["data"]
    assert "pseudo" in json_data["data"]

