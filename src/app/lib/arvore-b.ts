// export class BTreeNode {
//   keys: number[];
//   children: BTreeNode[];
//   leaf: boolean;

//   constructor(public t: number, leaf = true) {
//     this.t = t;
//     this.leaf = leaf;
//     this.keys = [];
//     this.children = [];
//   }
// }

// export class BTree {
//   root: BTreeNode | null = null;

//   constructor(public t: number) {
//     this.t = t; // grau mínimo = m/2
//   }

//   search(k: number, node: BTreeNode | null = this.root): BTreeNode | null {
//     if (!node) return null;
//     let i = 0;

//     while (i < node.keys.length && k > node.keys[i]) i++;

//     if (i < node.keys.length && node.keys[i] === k) return node;

//     if (node.leaf) return null;

//     return this.search(k, node.children[i]);
//   }

//   insert(k: number) {
//     if (!this.root) {
//       this.root = new BTreeNode(this.t, true);
//       this.root.keys.push(k);
//       return;
//     }

//     if (this.root.keys.length === 2 * this.t - 1) {
//       const s = new BTreeNode(this.t, false);
//       s.children.push(this.root);
//       this.splitChild(s, 0, this.root);
//       let i = 0;
//       if (s.keys[0] < k) i++;
//       this.insertNonFull(s.children[i], k);
//       this.root = s;
//     } else {
//       this.insertNonFull(this.root, k);
//     }
//   }

//   private insertNonFull(node: BTreeNode, k: number) {
//     let i = node.keys.length - 1;

//     if (node.leaf) {
//       node.keys.push(k);
//       node.keys.sort((a, b) => a - b);
//     } else {
//       while (i >= 0 && k < node.keys[i]) i--;
//       i++;
//       if (node.children[i].keys.length === 2 * this.t - 1) {
//         this.splitChild(node, i, node.children[i]);
//         if (node.keys[i] < k) i++;
//       }
//       this.insertNonFull(node.children[i], k);
//     }
//   }

//   private splitChild(parent: BTreeNode, index: number, fullChild: BTreeNode) {
//     const t = this.t;
//     const newNode = new BTreeNode(t, fullChild.leaf);

//     newNode.keys = fullChild.keys.splice(t);
//     const mid = newNode.keys.shift()!;
//     parent.keys.splice(index, 0, mid);
//     parent.children.splice(index + 1, 0, newNode);

//     if (!fullChild.leaf) {
//       newNode.children = fullChild.children.splice(t);
//     }
//   }

//   remove(k: number) {
//     if (!this.root) return;
//     this.removeFromNode(this.root, k);

//     if (this.root.keys.length === 0) {
//       this.root = this.root.leaf ? null : this.root.children[0];
//     }
//   }

//   private removeFromNode(node: BTreeNode, k: number) {
//     const idx = node.keys.indexOf(k);

//     if (idx !== -1) {
//       if (node.leaf) {
//         node.keys.splice(idx, 1);
//       } else {
//         if (node.children[idx].keys.length >= this.t) {
//           const pred = this.getPredecessor(node, idx);
//           node.keys[idx] = pred;
//           this.removeFromNode(node.children[idx], pred);
//         } else if (node.children[idx + 1].keys.length >= this.t) {
//           const succ = this.getSuccessor(node, idx);
//           node.keys[idx] = succ;
//           this.removeFromNode(node.children[idx + 1], succ);
//         } else {
//           this.merge(node, idx);
//           this.removeFromNode(node.children[idx], k);
//         }
//       }
//     } else {
//       if (node.leaf) return;

//       let i = 0;
//       while (i < node.keys.length && k > node.keys[i]) i++;

//       if (node.children[i].keys.length < this.t) this.fill(node, i);

//       if (i > node.keys.length) {
//         this.removeFromNode(node.children[i - 1], k);
//       } else {
//         this.removeFromNode(node.children[i], k);
//       }
//     }
//   }

//   private getPredecessor(node: BTreeNode, idx: number) {
//     let cur = node.children[idx];
//     while (!cur.leaf) cur = cur.children[cur.children.length - 1];
//     return cur.keys[cur.keys.length - 1];
//   }

//   private getSuccessor(node: BTreeNode, idx: number) {
//     let cur = node.children[idx + 1];
//     while (!cur.leaf) cur = cur.children[0];
//     return cur.keys[0];
//   }

//   private fill(node: BTreeNode, idx: number) {
//     if (idx > 0 && node.children[idx - 1].keys.length >= this.t) {
//       this.borrowFromPrev(node, idx);
//     } else if (
//       idx < node.children.length - 1 &&
//       node.children[idx + 1].keys.length >= this.t
//     ) {
//       this.borrowFromNext(node, idx);
//     } else {
//       if (idx < node.children.length - 1) {
//         this.merge(node, idx);
//       } else {
//         this.merge(node, idx - 1);
//       }
//     }
//   }

//   private borrowFromPrev(node: BTreeNode, idx: number) {
//     const child = node.children[idx];
//     const sibling = node.children[idx - 1];

//     child.keys.unshift(node.keys[idx - 1]);
//     node.keys[idx - 1] = sibling.keys.pop()!;

//     if (!child.leaf) {
//       child.children.unshift(sibling.children.pop()!);
//     }
//   }

//   private borrowFromNext(node: BTreeNode, idx: number) {
//     const child = node.children[idx];
//     const sibling = node.children[idx + 1];

//     child.keys.push(node.keys[idx]);
//     node.keys[idx] = sibling.keys.shift()!;

//     if (!child.leaf) {
//       child.children.push(sibling.children.shift()!);
//     }
//   }

//   private merge(node: BTreeNode, idx: number) {
//     const child = node.children[idx];
//     const sibling = node.children[idx + 1];

//     child.keys.push(node.keys[idx]);
//     child.keys.push(...sibling.keys);
//     child.children.push(...sibling.children);

//     node.keys.splice(idx, 1);
//     node.children.splice(idx + 1, 1);
//   }
// }


// lib/arvore-b.ts

export class BTreeNode {
  keys: number[];
  children: BTreeNode[];
  leaf: boolean;

  constructor(leaf: boolean = true) {
    this.keys = [];
    this.children = [];
    this.leaf = leaf;
  }
}

export class BTree {
  root: BTreeNode;
  order: number;
  minKeys: number;
  maxKeys: number;

  constructor(order: number = 3) {
    this.order = order;
    this.maxKeys = order - 1;
    this.minKeys = Math.floor(order / 2);
    this.root = new BTreeNode(true);
  }

  insert(key: number): void {
    const root = this.root;
    
    if (root.keys.length === this.maxKeys) {
      // Se a raiz está cheia, precisamos dividir
      const newRoot = new BTreeNode(false);
      newRoot.children.push(this.root);
      this.splitChild(newRoot, 0);
      this.root = newRoot;
    }
    
    this.insertNonFull(this.root, key);
  }

  private insertNonFull(node: BTreeNode, key: number): void {
    let i = node.keys.length - 1;

    if (node.leaf) {
      // Encontrar a posição correta e inserir
      while (i >= 0 && key < node.keys[i]) {
        i--;
      }
      node.keys.splice(i + 1, 0, key);
    } else {
      // Encontrar o filho apropriado
      while (i >= 0 && key < node.keys[i]) {
        i--;
      }
      i++;

      // Se o filho está cheio, dividir
      if (node.children[i].keys.length === this.maxKeys) {
        this.splitChild(node, i);
        if (key > node.keys[i]) {
          i++;
        }
      }

      this.insertNonFull(node.children[i], key);
    }
  }

  private splitChild(parent: BTreeNode, childIndex: number): void {
    const child = parent.children[childIndex];
    const newChild = new BTreeNode(child.leaf);
    
    const midIndex = Math.floor(child.keys.length / 2);
    const midKey = child.keys[midIndex];

    // Mover as chaves maiores para o novo nó
    newChild.keys = child.keys.splice(midIndex + 1);
    child.keys.pop(); // Remover a chave do meio que será promovida

    // Se não for folha, mover os filhos também
    if (!child.leaf) {
      newChild.children = child.children.splice(midIndex + 1);
    }

    // Inserir a chave do meio no pai
    parent.keys.splice(childIndex, 0, midKey);
    parent.children.splice(childIndex + 1, 0, newChild);
  }

  remove(key: number): void {
    this.removeKey(this.root, key);
    
    // Se a raiz ficar vazia, fazer um de seus filhos a nova raiz
    if (this.root.keys.length === 0 && !this.root.leaf) {
      this.root = this.root.children[0];
    }
  }

  private removeKey(node: BTreeNode, key: number): boolean {
    const keyIndex = node.keys.indexOf(key);

    // Caso 1: A chave está neste nó
    if (keyIndex !== -1) {
      if (node.leaf) {
        // Caso 1a: Nó folha - simplesmente remover
        node.keys.splice(keyIndex, 1);
        return true;
      } else {
        // Caso 1b: Nó interno
        this.removeFromInternalNode(node, keyIndex);
        return true;
      }
    }

    // Caso 2: A chave não está neste nó, encontrar o filho apropriado
    if (node.leaf) {
      return false; // Chave não encontrada
    }

    let childIndex = 0;
    while (childIndex < node.keys.length && key > node.keys[childIndex]) {
      childIndex++;
    }

    const child = node.children[childIndex];
    
    // Caso 2a: O filho tem número mínimo de chaves - precisa garantir que tenha pelo menos minKeys + 1
    if (child.keys.length <= this.minKeys) {
      this.fillChild(node, childIndex);
    }

    // Recursivamente remover do filho apropriado
    return this.removeKey(
      node.children[childIndex >= node.children.length ? childIndex - 1 : childIndex],
      key
    );
  }

  private removeFromInternalNode(node: BTreeNode, keyIndex: number): void {
    const key = node.keys[keyIndex];
    const leftChild = node.children[keyIndex];
    const rightChild = node.children[keyIndex + 1];

    // Caso 2b: O filho esquerdo tem pelo menos minKeys + 1 chaves
    if (leftChild.keys.length > this.minKeys) {
      const predecessor = this.getPredecessor(leftChild);
      node.keys[keyIndex] = predecessor;
      this.removeKey(leftChild, predecessor);
    }
    // Caso 2c: O filho direito tem pelo menos minKeys + 1 chaves
    else if (rightChild.keys.length > this.minKeys) {
      const successor = this.getSuccessor(rightChild);
      node.keys[keyIndex] = successor;
      this.removeKey(rightChild, successor);
    }
    // Caso 2d: Ambos os filhos têm número mínimo de chaves - fazer merge
    else {
      this.mergeChildren(node, keyIndex);
      this.removeKey(leftChild, key);
    }
  }

  private getPredecessor(node: BTreeNode): number {
    while (!node.leaf) {
      node = node.children[node.children.length - 1];
    }
    return node.keys[node.keys.length - 1];
  }

  private getSuccessor(node: BTreeNode): number {
    while (!node.leaf) {
      node = node.children[0];
    }
    return node.keys[0];
  }

  private fillChild(parent: BTreeNode, childIndex: number): void {
    if (childIndex > 0 && parent.children[childIndex - 1].keys.length > this.minKeys) {
      // Pegar empréstimo do irmão esquerdo
      this.borrowFromLeft(parent, childIndex);
    } else if (childIndex < parent.children.length - 1 && 
               parent.children[childIndex + 1].keys.length > this.minKeys) {
      // Pegar empréstimo do irmão direito
      this.borrowFromRight(parent, childIndex);
    } else {
      // Fazer merge com um irmão
      if (childIndex > 0) {
        this.mergeChildren(parent, childIndex - 1);
      } else {
        this.mergeChildren(parent, childIndex);
      }
    }
  }

  private borrowFromLeft(parent: BTreeNode, childIndex: number): void {
    const child = parent.children[childIndex];
    const leftSibling = parent.children[childIndex - 1];

    // Mover a chave do pai para o filho
    child.keys.unshift(parent.keys[childIndex - 1]);
    
    // Mover a última chave do irmão esquerdo para o pai
    parent.keys[childIndex - 1] = leftSibling.keys.pop()!;

    // Mover o último filho do irmão esquerdo se não for folha
    if (!child.leaf) {
      child.children.unshift(leftSibling.children.pop()!);
    }
  }

  private borrowFromRight(parent: BTreeNode, childIndex: number): void {
    const child = parent.children[childIndex];
    const rightSibling = parent.children[childIndex + 1];

    // Mover a chave do pai para o filho
    child.keys.push(parent.keys[childIndex]);
    
    // Mover a primeira chave do irmão direito para o pai
    parent.keys[childIndex] = rightSibling.keys.shift()!;

    // Mover o primeiro filho do irmão direito se não for folha
    if (!child.leaf) {
      child.children.push(rightSibling.children.shift()!);
    }
  }

  private mergeChildren(parent: BTreeNode, childIndex: number): void {
    const leftChild = parent.children[childIndex];
    const rightChild = parent.children[childIndex + 1];
    const key = parent.keys[childIndex];

    // Mover a chave do pai para o filho esquerdo
    leftChild.keys.push(key);

    // Mover todas as chaves do filho direito
    leftChild.keys.push(...rightChild.keys);

    // Mover todos os filhos do filho direito se não forem folhas
    if (!leftChild.leaf) {
      leftChild.children.push(...rightChild.children);
    }

    // Remover a chave do pai e o filho direito
    parent.keys.splice(childIndex, 1);
    parent.children.splice(childIndex + 1, 1);
  }

  search(key: number): boolean {
    return this.searchNode(this.root, key);
  }

  private searchNode(node: BTreeNode, key: number): boolean {
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) {
      i++;
    }

    if (i < node.keys.length && key === node.keys[i]) {
      return true;
    }

    if (node.leaf) {
      return false;
    }

    return this.searchNode(node.children[i], key);
  }
}