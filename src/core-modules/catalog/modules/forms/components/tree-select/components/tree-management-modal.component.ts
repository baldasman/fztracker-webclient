import { Component, OnInit, OnDestroy, Inject, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TreeComponent } from '@core-modules/catalog/modules/tree/components/tree.component';
import { TreeNodeModel, TreeEvents } from '@core-modules/catalog/modules/tree';
import { Subscription } from 'rxjs';

import { DeleteNodeModalComponent } from './delete-node-modal.component';
import { NewditNodeModalComponent } from './newdit-node-modal.component';
import { TreeHelper } from '../helpers/tree.helper';

export class TreeData {
  id: string;
  name: string;
  children: TreeData[];
  path?: string;

  constructor(data: Partial<TreeData>) {
    this.name = data.name;
    this.children = data.children?.map(t => new TreeData(t)) || [];
    this.updatePath();
  }

  private updatePath(parentPath?: string) {
    this.path = (parentPath ? `${parentPath}\\` : '') + this.name;
    this.children.forEach(childrenZones => childrenZones.updatePath(this.path));
    this.id = this.hashString(this.path).toString();
  }

  private hashString(s: string) {

    let i = 0; let h = 0;

    // tslint:disable-next-line:no-bitwise
    for (i = 0; i < s.length; i++) { h = Math.imul(31, h) + s.charCodeAt(i) | 0; }

    return Math.abs(h);

  }
}

@Component({
  selector: 'catalog-forms-tree-management-modal',
  templateUrl: './tree-management-modal.component.html',
  styleUrls: ['./tree-management-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeManagementModalComponent implements OnInit, OnDestroy {
  @ViewChild('treeElement') treeElement: TreeComponent;

  public treeNodes: TreeNodeModel[];
  public selectedNode: TreeNodeModel;
  protected subscriptions: Subscription[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { values, label },
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<TreeManagementModalComponent>
  ) { }

  ngOnInit() {
    this.treeNodes = this.data.values;
  }

  onTreeEvents(event: { type: TreeEvents, data: { node: TreeNodeModel } }) {
    this.selectedNode = event.data.node;
    if (event.type === TreeEvents.NODE_DBL_CLICK) {
      this.dialogRef.close({ tree: this.treeNodes, selected: this.selectedNode });
    }
  }

  onAddNode() {
    const dialogRef = this.dialog.open(NewditNodeModalComponent, {
      panelClass: 'dialog-width-25',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.data) {
        if (!this.selectedNode) {
          // add root node
          this.treeNodes = this.treeElement.addRootNode(new TreeData({ name: result.data.name, children: [], path: result.data.name }));
        } else {
          // add child node
          const fatherNode = TreeHelper.findNodeOnTree(this.treeNodes, this.selectedNode.id);
          this.treeNodes = this.treeElement.addChildNode(new TreeData({ name: result.data.name, children: [], path: `${fatherNode?.path}/${result.data.name}` }));
        }

        this.cdr.detectChanges();
        this.treeElement.expandAll();

      }
    });
  }

  onEditNode() {
    if (this.selectedNode) {
      const dialogRef = this.dialog.open(NewditNodeModalComponent, {
        panelClass: 'dialog-width-25',
        data: { id: this.selectedNode.id, name: this.selectedNode.name }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.data) {
          this.treeNodes = this.treeElement.editNode(result.data.name);
          this.treeNodes = TreeHelper.getTree(this.treeNodes); // update tree
          this.cdr.detectChanges();
          this.treeElement.expandAll();

          // update selected node
          this.treeElement.onNodeClick(TreeHelper.findNodeOnTree(this.treeNodes, this.selectedNode.id));
        }
      });
    }
  }

  onDeleteNode() {
    if (this.selectedNode) {
      const dialogRef = this.dialog.open(DeleteNodeModalComponent, {
        panelClass: 'dialog-width-25',
        data: {}
      });

      this.subscriptions.push(
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.data && result.data.deleted) {
            this.treeNodes = this.treeElement.deleteNode();
            this.selectedNode = null;
            this.cdr.detectChanges();
          }
        })
      );
    }
  }

  onSelectNode() {
    this.dialogRef.close({ tree: this.treeNodes, selected: this.selectedNode });
  }

  onClose() {
    this.dialogRef.close({ tree: this.treeNodes, selected: this.selectedNode });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
