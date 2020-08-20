import { TreeNodeModel } from '@core-modules/catalog/modules/tree';

export class TreeHelper {

  static getTree(treeNodes: TreeNodeModel[]): TreeNodeModel[] {
    const trees: TreeNodeModel[] = [];

    (treeNodes || []).forEach(tree => {
      tree.path = tree.name;

      const root = {
        name: tree.name,
        id: tree.id,
        path: tree.name,
        children: []
      };

      root.children = this.getChildren(tree);

      trees.push(root);
    });
    return trees;
  }

  static getChildren(tree) {
    const children = [];
    while ((tree.children || []).length > 0) {
      const child = tree.children.pop();
      child.path = `${tree.path}\\${child.name}`;
      children.push({
        name: child.name,
        id: child.id,
        children: this.getChildren(child),
        path: child.path
      });
    }
    return children;
  }

  static findNodeOnTree(tree: TreeNodeModel[], nodeId: string) {

    for (const item of tree) {
      if (item.id === nodeId) {
        return item;
      }

      if (item.children) {
        const found = this.findNodeOnTree(item.children, nodeId);
        if (found) { return found; }
      }
    }

  }

}
