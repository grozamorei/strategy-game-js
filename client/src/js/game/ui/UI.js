/**
 * @constructor
 */
import {UIUtils} from "./UIUtils";
import {StatsConstructor} from "./panels/Stats";
import {MainPanelConstructor} from "./MainPanel";

export const UIConstructor = () => {

    const ownerProxy = {
        root: document.body,
        fullscreenElement: window.document.documentElement,
        es: null,
        cmd: null
    }

    const gameCanvas = UIUtils.createElement('canvas', 'gameCanvas', ownerProxy.root)

    //
    // create main ui blocks
    const stats = StatsConstructor(ownerProxy.root)
    const main = MainPanelConstructor(ownerProxy)

    return {
        inject: (es, commands) => {
            ownerProxy.es = es
            ownerProxy.cmd = commands
        },
        /** @return {Element} */
        get root() { return ownerProxy.root },
        /** @return {Element} */
        get canvas() { return gameCanvas },
        /** @return {MainPanelConstructor} */
        get main() { return main },

        /** update all UI panels */
        update: () => {
            stats.update()
            main.update()
        }
    }
}