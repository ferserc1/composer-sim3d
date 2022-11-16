app.addSource(() => {
    app.sim3dCommands = app.sim3dCommands || {};

    function mergeGroup(srcGroup) {
        let scene = app.render.Scene.Get();
        let gl = app.ComposerWindowController.Get().gl;
        let newNode = new bg.scene.Node(gl,srcGroup.name ? srcGroup.name + " merged" : "");
        newNode.addComponent(new bg.scene.Transform());
        let drw = new bg.scene.Drawable();
        newNode.addComponent(drw);
        srcGroup.children.forEach((child) => {
            let groupTrx = child.transform ? child.transform.matrix : null;
            if (child.drawable) {
                child.drawable.forEach((plist,mat,trx) => {
                    plist = plist.clone();
                    if (groupTrx) plist.applyTransform(groupTrx);
                    drw.addPolyList(plist,mat.clone(),trx);
                });
            }
        });

        this._newNodes.push(newNode);
        this._parent.addChild(newNode);
        scene.selectionManager.prepareNode(newNode);
    }

    class MergeGroups extends app.Command {
        constructor(parent,nodes) {
            super();
            this._parent = parent;
            this._nodes = nodes;
        }

        execute() {
            return new Promise((resolve) => {
                if (!this._newNodes) {
                    this._newNodes = [];
                    this._nodes.forEach((node) => {
                        mergeGroup.apply(this,[node]);
                    });
                    resolve();
                }
                else {
                    this._newNodes.forEach((node) => {
                        this._parent.addChild(node);
                    })
                }
            });
        }

        undo() {
            return new Promise((resolve) => {
                this._newNodes.forEach((node) => {
                    this._parent.removeChild(node);
                });
                resolve();
            });
        }
    }

    app.sim3dCommands.MergeGroups = MergeGroups;
})