/** @typedef {import("../Fetch/Fetch.mjs").Fetch} Fetch */
/** @typedef {import("../../Service/Fetch/Port/FetchService.mjs").FetchService} FetchService */
/** @typedef {import("../Fetch/showAuthentication.mjs").showAuthentication} showAuthentication */
/** @typedef {import("../Fetch/showError.mjs").showError} showError */

export class FetchApi {
    /**
     * @type {FetchService | null}
     */
    #fetch_service = null;
    /**
     * @type {showAuthentication | null}
     */
    #show_authentication;
    /**
     * @type {showError | null}
     */
    #show_error;

    /**
     * @param {showAuthentication | null} show_authentication
     * @param {showError | null} show_error
     * @returns {FetchApi}
     */
    static new(show_authentication = null, show_error = null) {
        return new this(
            show_authentication,
            show_error
        );
    }

    /**
     * @param {showAuthentication | null} show_authentication
     * @param {showError | null} show_error
     * @private
     */
    constructor(show_authentication, show_error) {
        this.#show_authentication = show_authentication;
        this.#show_error = show_error;
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        this.#fetch_service ??= await this.#getFetchService();
    }

    /**
     * @param {Fetch} _fetch
     * @returns {Promise<*>}
     */
    async fetch(_fetch) {
        return this.#fetch_service.fetch(
            _fetch
        );
    }

    /**
     * @returns {Promise<FetchService>}
     */
    async #getFetchService() {
        return (await import("../../Service/Fetch/Port/FetchService.mjs")).FetchService.new(
            this.#show_authentication,
            this.#show_error
        );
    }
}
