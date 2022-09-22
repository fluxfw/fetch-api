import { FetchCommand } from "../Command/FetchCommand.mjs";

/** @typedef {import("../../../Adapter/Fetch/Fetch.mjs").Fetch} Fetch */
/** @typedef {import("../../../Adapter/Fetch/showAuthentication.mjs").showAuthentication} showAuthentication */
/** @typedef {import("../../../Adapter/Fetch/showError.mjs").showError} showError */

export class FetchService {
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
     * @returns {FetchService}
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
     * @param {Fetch} fetch_
     * @returns {Promise<*>}
     */
    async fetch(fetch_) {
        return FetchCommand.new(
            this.#show_authentication,
            this.#show_error
        )
            .fetch(
                fetch_
            );
    }
}
