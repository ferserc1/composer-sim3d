module.exports = function(app,angularApp,bg) {
    function mergeGroup(parentNode) {

    }

    // Use app.addSource() to extend Composer source code.
    app.addSource(() => {

        new (class Sim3DCommandHandler extends app.CommandHandler {
            constructor() {
                super();
            }

            getNextChainName(parentNode) {
                let index = 1;
                let createName = () => `Chain_${ index }`;
                while (parentNode.children.some((node) => {
                    if (node.name==createName()) {
                        return true;
                    }
                })) {
                    index++;
                }
                return createName();
            }

            getMessages() {
                return [
                    "groupAndChain",
                    "copyAndChain",
                    "mergeGroups"
                ];
            }

            execute(message,params) {
                switch (message) {
                case 'groupAndChain':
                    this.groupAndChain();
                    break;
                case 'copyAndChain':
                    this.copyAndChain();
                    break;
                case 'mergeGroups':
                    this.mergeGroups();
                    break;
                }
            }

            groupAndChain() {
                let scene = app.render.Scene.Get();
                let sel = scene.selectionManager.selection;
                let winCtrl = app.ComposerWindowController.Get();
                let gl = winCtrl.gl;

                let x = bg.Math.random();
                let z = bg.Math.random();
                let name = this.getNextChainName(scene.root);
                let newNode = new bg.scene.Node(gl,name);
                newNode.addComponent(new bg.scene.Chain());
                newNode.addComponent(new bg.scene.Transform(bg.Matrix4.Translation(x,0, z)));
                let nodes = [];
                sel.forEach((selItem) => {
                    if (selItem.node && selItem.node.drawable && nodes.indexOf(selItem.node)==-1) {
                        nodes.push(selItem.node);
                    }
                });
                newNode.name = name;

                if (nodes.length) {
                    app.CommandManager.Get().doCommand(
                        new app.nodeCommands.SetParent(scene.root,[newNode])
                    )
                    .then(() => {
                        return app.CommandManager.Get().doCommand(
                            new app.nodeCommands.SetParent(newNode,nodes)
                        );
                    })
                    .then(() => {
                        scene.notifySceneChanged();
                        winCtrl.updateView();
                    })
                    .catch((err) => {
                        console.log(err.message,true);
                    })
                }
            }

            copyAndChain() {
                let scene = app.render.Scene.Get();
                let sel = scene.selectionManager.selection;
                let winCtrl = app.ComposerWindowController.Get();
                let gl = winCtrl.gl;

                let x = bg.Math.random();
                let z = bg.Math.random();
    
                let name = this.getNextChainName(scene.root);
                let newNode = new bg.scene.Node(gl,name);
                newNode.addComponent(new bg.scene.Chain());
                newNode.addComponent(new bg.scene.Transform(bg.Matrix4.Translation(x,0,z)));
                let nodes = [];
                sel.forEach((selItem) => {
                    if (selItem.node && selItem.node.drawable && nodes.indexOf(selItem.node)==-1) {
                        nodes.push(selItem.node);
                        newNode.addChild(selItem.node.cloneComponents());
                    }
                });
                newNode.name = name;

                if (newNode.children.length) {
                    app.CommandManager.Get().doCommand(
                        new app.nodeCommands.SetParent(scene.root,[newNode])
                    ).then(() => {
                        scene.notifySceneChanged();
                        winCtrl.updateView();
                    })
                    .catch((err) => {
                        console.log(err.message,true);
                    });
                }
                else {
                    alert("No elements selected");
                }
            }

            mergeGroups() {
                let scene = app.render.Scene.Get();
                let sel = scene.selectionManager.selection;
                let winCtrl = app.ComposerWindowController.Get();
                let gl = winCtrl.gl;

                let nodes = [];
                sel.forEach((selItem) => {
                    if (selItem.node) {
                        nodes.push(selItem.node);
                    }
                });

                if (nodes.length) {
                    app.CommandManager.Get().doCommand(
                        new app.sim3dCommands.MergeGroups(scene.root,nodes)
                    ).then(() => {
                        winCtrl.updateView();
                        scene.notifySceneChanged();
                    })
                    .catch((err) => {
                        console.log(err.message,true);
                    });
                }
                else {
                    alert("No elements selected");
                }

            }
        });
    });

    // Plugin copyright
    app.addCopyright(
        "Sim 3D tools",
        "http://www.sim3d.es",
        "El uso de las herramientas de producción de Sim 3D para bg2 Composer están sujetas a la contratación de uno de los servicios de Sim 3D que requieran su uso. Consulte con Grupo SIM en el enlace anterior.");
    
}