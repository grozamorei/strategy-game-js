import {HexagonComponentConstructor} from './HexagonComponent'
import {
    entityAddChild, entityChildCount, entityGetChild, entityGetName,
    entityUpdate
} from "../entityBehaviours";
import {EntityConstructor} from "../Entity";
import {CONST} from "../../../util/const";
import {ThreejsComponentConstructor} from "./ThreejsComponent";
import {HexagonEntity} from "./HexagonEntity";

const GridUtils = (template) => {

    const width = template.meta.width
    const height = template.meta.height
    const angleStepDeg = CONST.CIRCLE_DEG / width

    return {
        angleFromIndex: (index) => {
            const y = Math.floor(index/width)
            const x = index % width

            const angleDeg = -(x * angleStepDeg) - (y * angleStepDeg / 2)
            return angleDeg * CONST.MATH.DEG_TO_RAD
        }
    }
}

export const HexagonGridConstructor = (template) => {

	const state = {
	    //
        // Entity state
	    name: 'HexagonalGrid',
	    components: new Map(),
	    children: [],

        //
        // Custom state
        template: template,
        utils: GridUtils(template),
        root: new THREE.Object3D()
	}

    let calculatedHeight = 0
    let calculatedHeight2 = 0

    const self = {
	    get calculatedHeight() { return calculatedHeight2 },
	    get visualRoot() { return state.root },
        get utils() { return state.utils },
        get children() { return state.children },
        get currentAngle() { return state.root.rotation.y },
        rotate: (angleRad) => { state.root.rotation.y += angleRad },
        setAngle: (angleRad) => { state.root.rotation.y = angleRad }
    }

    Object.assign(self, entityGetName(state))
    Object.assign(self, entityUpdate(state))
    Object.assign(self, entityAddChild(state))
    Object.assign(self, entityGetChild(state))
    Object.assign(self, entityChildCount(state))

    const facetWidth = 1 + template.meta.tileGap * 2
    const facetRadius = (facetWidth/2)/Math.sin(CONST.HEX_ANGLE_DEG * CONST.MATH.DEG_TO_RAD)
    const capHeight = facetRadius * Math.cos(CONST.HEX_ANGLE_DEG * CONST.MATH.DEG_TO_RAD)
    const rowOffset = facetRadius + capHeight
    calculatedHeight = rowOffset * (template.meta.height-1)
    calculatedHeight2 = rowOffset * template.meta.height + capHeight*2

	const gridRadius = facetWidth / (2 * Math.tan(Math.PI / template.meta.width))

    let centerY = calculatedHeight / 2

    for (let i = 0; i < template.layout.length; i++) {
	    const row = Math.floor(i/template.meta.width)
        const travelAngleRad = state.utils.angleFromIndex(i)

        const x = gridRadius * Math.cos(travelAngleRad)
        const y = centerY - row * rowOffset
        const z = gridRadius * Math.sin(travelAngleRad)
        const rotY = Math.PI/2 - travelAngleRad

        const hexagon = HexagonEntity('Hexagon' + i)
        self.addChild(hexagon)

        const logic = hexagon.addComponent('logic', HexagonComponentConstructor('logicHexagon' + i, i, template.layout[i]))
        const visual = hexagon.addComponent('visual', ThreejsComponentConstructor('visualHexagon' + i))
        visual.loadParametrized('assets/models/hex_test', x, y, z, 0, rotY, 0, state.root).then(logic.init)
    }

    return self
}