
export const visualLoader = (state) => ({loadVisual: () => {
        return new Promise((resolve, reject) => {
            const meshPath = state.visualPath + '.obj'
            const texturePath = state.visualPath + '_tex.png'

            const f = window.facade;
            f.resourceLoader.load(texturePath).then((texture) => {
                f.resourceLoader.load(meshPath).then((obj) => {
                    obj.traverse(child => {
                        if (child instanceof THREE.Mesh) {
                            child.material = new THREE.MeshPhongMaterial(
                                {
                                    color: 0xffffff,
                                    side: THREE.DoubleSide,
                                    map: texture
                                }
                            )
                        }
                    })
                    state.visual = obj
                    console.log('someones visual loaded: ', state)
                    resolve()
                }).catch(reject)
            }).catch(reject)
        })
}})