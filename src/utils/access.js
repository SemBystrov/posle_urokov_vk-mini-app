import bridge from '@vkontakte/vk-bridge';

/***
 * пользовательский токен
 * @type {string}
 */
export const DEFAULT = 'default'
/***
 * доступ к списку друзей пользователя
 * @type {string}
 */
export const FRIENDS = 'friends'
/***
 * доступ к сообществам пользователя
 * @type {string}
 */
export const GROUPS = 'groups'
/***
 * доступ к статистике групп и приложений пользователя, администратором которых он является
 * @type {string}
 */
export const STATS = 'groups'

const possible = []

possible.push(STATS, GROUPS, FRIENDS, DEFAULT)

class AccessTokenManager {

    constructor() {
        this.access = {
            default: null,
            friends: null,
            groups: null,
            stats: null
        }
    }

    async getAccessToken (accessGet) {
        if (possible.findIndex(accessGet) === -1)
            throw new Error("Неизвестный модификатор доступа")

        if (!this.access[accessGet]) {
            const resp = await bridge.send("VKWebAppGetAuthToken", {
                "app_id": process.env.VK_MINI_APP_ID,
                "scope": accessGet
            })

            if (resp["type"] !== "VKWebAppAccessTokenFailed")
                throw new Error("Пользователь не дал разрешение")

            this.access[accessGet] = resp["data"]["access_token"]
        }

        return this.access[accessGet]
    }

}

const accessManager = new AccessTokenManager()

export default accessManager
