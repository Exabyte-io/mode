"""Model class implementation."""

from typing import Any, Dict, List, Optional
import copy


class Model:
    """Model class representing computational models."""
    
    def __init__(self, application: Optional[Dict[str, Any]] = None, **config):
        """Initialize Model with configuration.
        
        Args:
            application: Application configuration
            **config: Additional configuration parameters
        """
        self._config = config
        self._application = application
        self._method = None
        
        # Import here to avoid circular imports
        from .methods.factory import MethodFactory
        self._method_factory = MethodFactory
    
    @property
    def type(self) -> str:
        """Get model type.
        
        Returns:
            str: Model type
        """
        return self.prop('type', self.default_type)
    
    @property
    def subtype(self) -> str:
        """Get model subtype.
        
        Returns:
            str: Model subtype
        """
        return self.prop('subtype', self.default_subtype)
    
    def set_subtype(self, subtype: str) -> None:
        """Set model subtype.
        
        Args:
            subtype: New subtype value
        """
        self.set_prop('subtype', subtype)
        self.set_method(self._method_factory.create(self.default_method_config))
    
    @property
    def allowed_types(self) -> List[Dict[str, str]]:
        """Get allowed model types.
        
        Returns:
            List: List of allowed types with slug and name
        """
        from .tree import tree_slug_to_named_object
        return [tree_slug_to_named_object(model_slug) for model_slug in self.tree.keys()]
    
    @property
    def allowed_subtypes(self) -> List[Dict[str, str]]:
        """Get allowed model subtypes.
        
        Returns:
            List: List of allowed subtypes with slug and name
        """
        from .tree import tree_slug_to_named_object
        return [tree_slug_to_named_object(slug) for slug in self.tree_branch_for_type.keys()]
    
    @property
    def default_type(self) -> Optional[str]:
        """Get default model type.
        
        Returns:
            str: Default type slug
        """
        allowed = self.allowed_types
        return allowed[0]['slug'] if allowed else None
    
    @property
    def default_subtype(self) -> Optional[str]:
        """Get default model subtype.
        
        Returns:
            str: Default subtype slug
        """
        allowed = self.allowed_subtypes
        return allowed[0]['slug'] if allowed else None
    
    @property
    def tree(self) -> Dict[str, Any]:
        """Get model tree.
        
        Returns:
            Dict: Model tree structure
        """
        if self._application and self.tree_by_application_name_and_version:
            return self.tree_by_application_name_and_version
        
        from .tree import MODEL_TREE
        return MODEL_TREE
    
    @property
    def tree_branch_for_type(self) -> Dict[str, Any]:
        """Get tree branch for current type.
        
        Returns:
            Dict: Tree branch for type
        """
        return self.tree.get(self.type, {})
    
    @property
    def tree_branch_for_subtype(self) -> Dict[str, Any]:
        """Get tree branch for current subtype.
        
        Returns:
            Dict: Tree branch for subtype
        """
        return self.tree_branch_for_type.get(self.subtype, {})
    
    @property
    def tree_by_application_name_and_version(self) -> Optional[Dict[str, Any]]:
        """Get tree by application name and version.
        
        Returns:
            Dict: Application-specific tree
        """
        if not self._application:
            return None
        
        from .tree import get_tree_by_application_name_and_version
        name = self._application['name']
        version = self._application['version']
        return get_tree_by_application_name_and_version({'name': name, 'version': version})
    
    @property
    def group_slug(self) -> str:
        """Get group slug.
        
        Returns:
            str: Group slug
        """
        return f"{self._application['shortName']}:{self.type}:{self.subtype}"
    
    @property
    def method(self):
        """Get method instance.
        
        Returns:
            Method: Method instance
        """
        if not self._method:
            method_config = self.prop('method') or self.default_method_config
            self._method = self._method_factory.create(method_config)
        return self._method
    
    def set_method(self, method) -> None:
        """Set method instance.
        
        Args:
            method: Method instance to set
        """
        self._method = method
    
    @property
    def methods_from_tree(self) -> Dict[str, Any]:
        """Get methods from tree.
        
        Returns:
            Dict: Methods from tree structure
        """
        return self.tree_branch_for_subtype.get('methods', {})
    
    @property
    def method_types(self) -> List[Dict[str, str]]:
        """Get method types.
        
        Returns:
            List: List of method types with slug and name
        """
        from .tree import tree_slug_to_named_object
        return [tree_slug_to_named_object(m) for m in self.methods_from_tree.keys()]
    
    @property
    def method_subtypes(self) -> List[Dict[str, str]]:
        """Get method subtypes.
        
        Returns:
            List: List of method subtypes with slug and name
        """
        from .tree import tree_slug_to_named_object
        method_list = self.methods_from_tree.get(self.method.type, [])
        return [tree_slug_to_named_object(m) for m in method_list]
    
    @property
    def default_method_config(self) -> Dict[str, str]:
        """Get default method configuration.
        
        Returns:
            Dict: Default method configuration
        """
        method_types = list(self.methods_from_tree.keys())
        if not method_types:
            return {}
        
        method_type = method_types[0]
        subtypes = self.methods_from_tree.get(method_type, [])
        subtype = subtypes[0] if subtypes else None
        
        return {'type': method_type, 'subtype': subtype}
    
    @staticmethod
    def get_default_config() -> Dict[str, Any]:
        """Get default configuration.
        
        Returns:
            Dict: Default configuration
        """
        from .default_models import DFT_MODEL_CONFIG
        from .method import Method
        
        return {
            **DFT_MODEL_CONFIG,
            'method': Method.get_default_config(),
        }
    
    @staticmethod
    def get_all_types() -> List[Dict[str, str]]:
        """Get all model types.
        
        Returns:
            List: List of all types with slug and name
        """
        from .tree import MODEL_TREE, tree_slug_to_named_object
        return [tree_slug_to_named_object(model_slug) for model_slug in MODEL_TREE.keys()]
    
    def to_json(self) -> Dict[str, Any]:
        """Convert to JSON representation.
        
        Returns:
            Dict: JSON representation
        """
        base_json = copy.deepcopy(self._config)
        return {
            **base_json,
            'type': self.type,
            'subtype': self.subtype,
            'method': self.method.to_json_with_clean_data(),
        }
    
    def _string_to_slugified_object(self, slug) -> Dict[str, str]:
        """Convert string to slugified object.
        
        Args:
            slug: String slug or object
            
        Returns:
            Dict: Slugified object
        """
        return {'slug': slug} if isinstance(slug, str) else slug
    
    @property
    def is_unknown(self) -> bool:
        """Check if model type is unknown.
        
        Returns:
            bool: True if type is unknown
        """
        return self.type == 'unknown'
    
    def prop(self, path: str, default: Any = None) -> Any:
        """Get property by path.
        
        Args:
            path: Dot-separated path to property
            default: Default value if property not found
            
        Returns:
            Any: Property value or default
        """
        keys = path.split('.')
        value = self._config
        
        try:
            for key in keys:
                value = value[key]
            return value
        except (KeyError, TypeError):
            return default
    
    def set_prop(self, path: str, value: Any) -> None:
        """Set property by path.
        
        Args:
            path: Dot-separated path to property
            value: Value to set
        """
        keys = path.split('.')
        target = self._config
        
        for key in keys[:-1]:
            if key not in target:
                target[key] = {}
            target = target[key]
        
        target[keys[-1]] = value

