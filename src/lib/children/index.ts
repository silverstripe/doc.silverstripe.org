// Children marker parsing
export { parseChildrenMarker, findChildrenMarkers } from './parse-children-marker';
export type { ChildrenConfig } from './parse-children-marker';

// Children filtering and retrieval
export {
  getChildren,
  getSiblings,
  getChildrenFiltered,
  setAllDocuments,
  clearDocumentCache,
} from './get-children';
export type { FilterOptions } from './get-children';

// Children rendering and replacement
export {
  replaceChildrenMarkers,
  getChildrenData,
} from './replace-children-markers';
export type { ChildMetadata } from './replace-children-markers';
