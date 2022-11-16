
module.exports = {
    getMenu: function() {
        return {
            label:"Sim 3D",
            submenu:[
                {
                    label:"Group and create chain",
                    click: (item,frontWindow) => {
                        frontWindow.webContents.send('triggerMenu', {
                            msg: 'groupAndChain'
                        })
                    }
                },
                {
                    label:"Copy and create chain",
                    click: (item,frontWindow) => {
                        frontWindow.webContents.send('triggerMenu', {
                            msg: 'copyAndChain'
                        })
                    }
                },
                {
                    label:"Merge Groups",
                    click: (item,frontWindow) => {
                        frontWindow.webContents.send('triggerMenu', {
                            msg:'mergeGroups'
                        })
                    }
                }
            ]
        }
    }
}