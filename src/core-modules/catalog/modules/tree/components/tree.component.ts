import { Component, Input, Output, EventEmitter, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';

import { TreeNodeModel } from '../models/tree-node.model';
import { TreeEvents } from '../enums/tree-events.enum';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'catalog-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  encapsulation: ViewEncapsulation.None, // WARNING: Styles applied here are global!
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideVertical', [
      state(
        '*',
        style({
          height: 0
        })
      ),
      state(
        'show',
        style({
          height: '*'
        })
      ),
      transition('* => *', [animate('1s cubic-bezier(0.25, 0.8, 0.25, 1)')])
    ])
  ]
})
export class TreeComponent implements OnInit {
  @Input() nodes: TreeNodeModel[];
  @Input() enableNestedActions: boolean;
  @Output() treeEvents: EventEmitter<{ type: TreeEvents, data: { node?: TreeNodeModel } }> = new EventEmitter();

  treeControl: NestedTreeControl<TreeNodeModel>;
  dataSource: MatTreeNestedDataSource<TreeNodeModel>;
  activeNode: TreeNodeModel;

  hasChild = (_: number, node: TreeNodeModel) => !!node.children && node.children.length > 0;

  constructor(
    private cdr: ChangeDetectorRef
  ) {
    this.enableNestedActions = false;
  }

  ngOnInit() {
    this.treeControl = new NestedTreeControl<TreeNodeModel>(node => node.children);
    this.dataSource = new MatTreeNestedDataSource<TreeNodeModel>();
    this.dataSource.data = this.nodes;
  }

  onNodeClick(node: TreeNodeModel): void {
    this.activeNode = node;
    this.treeEvents.emit({ type: TreeEvents.NODE_CLICK, data: { node } });
  }

  onNodeDblClick(node: TreeNodeModel): void {
    this.treeEvents.emit({ type: TreeEvents.NODE_DBL_CLICK, data: { node } });
  }

  onNodeNestedClick(node: TreeNodeModel): void {
    if (this.enableNestedActions) {
      this.onNodeClick(node);
    }
  }

  onNodeNestedDblClick(node: TreeNodeModel): void {
    if (this.enableNestedActions) {
      this.onNodeDblClick(node);
    }
  }

  addRootNode(node: TreeNodeModel) {
    this.dataSource.data.push(node);
    return cloneDeep(this.dataSource.data);
  }

  addChildNode(node: TreeNodeModel) {
    if (this.activeNode) {
      const n = this.searchTree();
      n.children.push(node);
    }
    return cloneDeep(this.dataSource.data);
  }

  editNode(name: string) {
    if (this.activeNode) {
      const n = this.searchTree();
      n.name = name;
    }
    return cloneDeep(this.dataSource.data);
  }

  deleteNode() {
    if (this.activeNode) {
      const deletedElement = this.findFatherNode(this.activeNode.id, this.dataSource.data);
      let elementPosition: number;
      if (deletedElement[0]) {
        deletedElement[0].children.splice(deletedElement[1], 1);
      } else {
        elementPosition = this.findPosition(this.activeNode.id, this.dataSource.data);
        this.dataSource.data.splice(elementPosition, 1);
      }
      this.activeNode = null;
    }
    return cloneDeep(this.dataSource.data);
  }

  searchTree() {
    let search = null;
    this.dataSource.data.every(n => {
      // stop condition
      if (search !== null) {
        return false;
      }
      search = this.searchNode(n, this.activeNode.id);
      return true;
    });
    return search;
  }

  searchNode(node, id) {
    if (node.id === id) {
      return node;
    } else if (node.children !== null) {
      let i;
      let result = null;
      for (i = 0; result == null && i < node.children.length; i++) {
        result = this.searchNode(node.children[i], id);
      }
      return result;
    }
    return null;
  }

  findPosition(id: string, data: TreeNodeModel[]) {
    for (let i = 0; i < data.length; i += 1) {
      if (id === data[i].id) {
        return i;
      }
    }
  }

  findFatherNode(id: string, data: TreeNodeModel[]) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < data.length; i += 1) {
      const currentFather = data[i];
      for (let z = 0; z < currentFather.children.length; z += 1) {
        if (id === currentFather.children[z].id) {
          return [currentFather, z];
        }
      }
      // tslint:disable-next-line:prefer-for-of
      for (let z = 0; z < currentFather.children.length; z += 1) {
        if (id !== currentFather.children[z].id) {
          const result = this.findFatherNode(id, currentFather.children);
          if (result !== false) {
            return result;
          }
        }
      }
    }
    return false;
  }

  collapseAll(): void {
    this.treeControl.dataNodes = this.nodes;
    this.treeControl.collapseAll();
    this.cdr.detectChanges();
  }

  expandAll(): void {
    this.treeControl.dataNodes = this.nodes;
    this.treeControl.expandAll();
    this.cdr.detectChanges();
  }

}
