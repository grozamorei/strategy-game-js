/**
 * @param owner
 * @constructor
 */
import {UIUtils} from "./UIUtils";
import {GlobalPanelConstructor} from "./panels/GlobalPanel";
import {TileInfoPanelConstructor} from "./panels/TileInfoPanel";
import {SelectorPanelConstructor} from "./panels/SelectorPanel";
import {CommandPanelConstructor} from "./panels/CommandPanel";
export const MainPanelState = {
    GLOBAL: 'GLOBAL',
    SELECTOR: 'SELECTOR',
    TILE: 'TILE',
    COMMAND: 'COMMAND',
}

export const MainPanelConstructor = (owner) => {

    let showState = MainPanelState.GLOBAL

    const variations = {
        parentDiv: {
            'vertical': UIUtils.createElement('div', 'uiMainPanelVertical', owner.root, {display: 'none'}),
            'horizontal': UIUtils.createElement('div', 'uiMainPanelHorizontal', owner.root, {display: 'none'})
        }
    }

    /** @type {Element} */
    let currentMain
    /** @type {String} */
    let currentOrientation

    const self = {
        get showState() { return showState },
        setShowState(value, context = null) {
            if (value === showState) {
                if (context === null || context === undefined) return
            } else {
                variations[showState][currentOrientation].hide()
            }

            showState = value
            variations[showState][currentOrientation].show()
            if (context !== null && context !== undefined) {
                variations[showState][currentOrientation].injectContext(context)
            }
        },
        onOrientationChange: (orientation) => {
            console.log('orientation chaged: ' + orientation)
            currentOrientation = orientation
            currentMain = variations.parentDiv[orientation]
            currentMain.style.display = 'block'
            variations.parentDiv[UIUtils.oppositeOrientation[orientation]].style.display = 'none'
        },
        update: () => {

        }
    }

    const cancelBehaviour = () => self.setShowState(MainPanelState.GLOBAL)
    const selectorBehaviour = context => self.setShowState(MainPanelState.COMMAND, context)

    variations[MainPanelState.GLOBAL] = {
        'vertical': GlobalPanelConstructor(owner, variations.parentDiv.vertical)
    }
    variations[MainPanelState.SELECTOR] = {
        'vertical': SelectorPanelConstructor(variations.parentDiv.vertical, selectorBehaviour, cancelBehaviour)
    }
    variations[MainPanelState.TILE] = {
        'vertical': TileInfoPanelConstructor(variations.parentDiv.vertical, cancelBehaviour)
    }
    variations[MainPanelState.COMMAND] = {
        'vertical': CommandPanelConstructor(variations.parentDiv.vertical)
    }

    return self
}