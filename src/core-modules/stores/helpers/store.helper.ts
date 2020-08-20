import { TreeNodeModel } from '@core-modules/catalog/modules/tree';
import { TreeHelper } from '@core-modules/catalog/modules/forms/components/tree-select/helpers/tree.helper';

export class StoreHelper {

  static hashString(s: string) {

    let i = 0; let h = 0;

    // tslint:disable-next-line:no-bitwise
    for (i = 0; i < s.length; i++) { h = Math.imul(31, h) + s.charCodeAt(i) | 0; }

    return Math.abs(h);

  }

  static returnTreeNodePath(tree: TreeNodeModel[], nodeId: string, separatorChar?: string): string {

    if (!nodeId) { return null; }

    separatorChar = separatorChar || '\\';

    const nodeTree = this.searchNodesOnTree(tree, nodeId);
    const node = this.findNodeOnTreeArray(TreeHelper.getTree(nodeTree), nodeId);
    const formatPath = node && node.length > 0 ? node[0].path.replace(/\//g, separatorChar) : nodeId;
    return formatPath;
  }

  static searchNodesOnTree(tree: TreeNodeModel[], search: string) {
    return tree.reduce((r: TreeNodeModel[], { children = [], ...o }) => {
      children = this.searchNodesOnTree(children, search);
      if (children.length) {
        r.push(Object.assign(o, { children }));
        return r;
      }

      if (o.id === search) {
        r.push(o);
      }
      return r;
    }, []);
  }


  static findNodeOnTree(tree: TreeNodeModel[], nodeId: string): TreeNodeModel {

    if (!nodeId) { return {} as TreeNodeModel; }

    const arrayWithFindings = StoreHelper.findNodeOnTreeArray(tree, nodeId);
    switch (arrayWithFindings.length) {
      case 0: return null;
      case 1: return arrayWithFindings[0];
      default: return null;
    }

    // TODO: This works????
    // for (const item of tree) {
    //   if (item.id === nodeId) {
    //     return item;
    //   }

    //   if (item.children) {
    //     const found = this.findNodeOnTree(item.children, nodeId);
    //     if (found) { return found; }
    //   }
    // }


  }

  static findNodeOnTreeArray(tree: TreeNodeModel[], nodeId: string): TreeNodeModel[] {

    return tree.map(item => {
      if (item.id === nodeId) {
        delete item.children;
        return item;
      }

      if (item.children) {
        const found = StoreHelper.findNodeOnTreeArray(item.children, nodeId).filter(node => node);
        if (found.length) { return found[0]; }
      }

    }).filter(item => item);

  }


  /**
   * Converts a flat list array to a tree structure
   * @param flatListArray Should be in the form ['FirstLevel1\FirstLevel2', 'SecondLevel1\SecondLevel2']
   * @param separatorChar The character used to split each array position.
   */
  static createTreeFromFlatListArray(flatListArray: string[], separatorChar?: string): TreeNodeModel[] {

    const finalTree: TreeNodeModel[] = [];
    separatorChar = separatorChar || '\\';

    flatListArray = Array.from(new Set(flatListArray)).filter(item => item); // Remove duplicated and empty items.

    flatListArray.forEach(arrayItem => {

      let loopedObject = finalTree; // This variable will hold each level as it's being looped.
      let path = '';

      // This is a fu&$ed up algorythm, but it works! Touch only if you know what you are doing!
      (arrayItem || '').split('\\').map(item => item.trim()).forEach(arrayItemKey => {

        path += (path ? '\\' : '') + arrayItemKey;

        if (!loopedObject.some(b => {
          if (b.name === arrayItemKey) {
            loopedObject = b.children;
            return true;
          }
        })) {
          const oo = { id: `${+new Date()}${Math.floor((Math.random() * 1000) + 1)}`, name: arrayItemKey, path, children: [] } as TreeNodeModel;
          loopedObject.push(oo);
          loopedObject = oo.children;
        }

      });

    });

    return finalTree;

  }

  /**
   * Merge 2 tree's arrays, deep merging all nodes.
   * @param rootTree Tree to where addedTree will be merge
   * @param addedTree Tree to merge into rootTree
   * @param comparisonKey The object property to comparion. Default's to 'id'
   * @param childrenKey The object property that contains children. Default's to 'children'
   */
  static mergeTrees(rootTree: TreeNodeModel[], addedTree: TreeNodeModel[], comparisonKey?: string, childrenKey?: string) {

    comparisonKey = comparisonKey || 'id';
    childrenKey = childrenKey || 'children';

    return [...rootTree.concat(addedTree).reduce((hash, item) => {

      const current = hash.get(item[comparisonKey]);

      if (!current) {
        hash.set(item[comparisonKey], item);
      } else {

        if (item[childrenKey]?.length > 0) {
          current[childrenKey] = this.mergeTrees(current[childrenKey] || [], item[childrenKey], comparisonKey);
        }

      }

      return hash;

    }, new Map()).values()];

  }

}
