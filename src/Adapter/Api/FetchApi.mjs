import { FetchService } from "../../Service/Fetch/Port/FetchService.mjs";

/** @typedef {import("../Fetch/Fetch.mjs").Fetch} Fetch */
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
        this.#fetch_service ??= this.#getFetchService();
    }

    /**
     * @param {Fetch} fetch_
     * @returns {Promise<*>}
     */
    async fetch(fetch_) {
        return this.#fetch_service.fetch(
            fetch_
        );
    }

    /**
     * @returns {FetchService}
     */
    #getFetchService() {
        return FetchService.new(
            this.#show_authentication,
            this.#show_error
        );
    }
}
