"""Tests for MethodFactory."""

from mat3ra.mode import Method, MethodFactory, PseudopotentialMethod


def test_create_basic_method():
    config = {"type": "localorbital", "subtype": "pople"}
    method = MethodFactory.create(config)

    assert isinstance(method, Method)
    assert method.type == "localorbital"


def test_create_pseudopotential_method():
    config = {"type": "pseudopotential", "subtype": "us"}
    method = MethodFactory.create(config)

    assert isinstance(method, PseudopotentialMethod)
    assert method.type == "pseudopotential"

