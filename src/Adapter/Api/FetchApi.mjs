/** @typedef {import("../Fetch/authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("../Fetch/Fetch.mjs").Fetch} Fetch */
/** @typedef {import("../../Service/Fetch/Port/FetchService.mjs").FetchService} FetchService */
/** @typedef {import("../Fetch/showError.mjs").showError} showError */

export class FetchApi {
    /**
     * @type {_authenticate | null}
     */
    #authenticate;
    /**
     * @type {FetchService | null}
     */
    #fetch_service = null;
    /**
     * @type {showError | null}
     */
    #show_error;

    /**
     * @param {_authenticate | null} authenticate
     * @param {showError | null} show_error
     * @returns {FetchApi}
     */
    static new(authenticate = null, show_error = null) {
        return new this(
            authenticate,
            show_error
        );
    }

    /**
     * @param {_authenticate | null} authenticate
     * @param {showError | null} show_error
     * @private
     */
    constructor(authenticate, show_error) {
        this.#authenticate = authenticate;
        this.#show_error = show_error;
    }

    /**
     * @param {Fetch} _fetch
     * @returns {Promise<*>}
     */
    async fetch(_fetch) {
        return (await this.#getFetchService()).fetch(
            _fetch
        );
    }

    /**
     * @returns {Promise<FetchService>}
     */
    async #getFetchService() {
        this.#fetch_service ??= (await import("../../Service/Fetch/Port/FetchService.mjs")).FetchService.new(
            this.#authenticate,
            this.#show_error
        );

        return this.#fetch_service;
    }
}
