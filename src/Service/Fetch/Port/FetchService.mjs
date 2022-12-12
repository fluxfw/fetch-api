/** @typedef {import("../../../Adapter/Fetch/authenticate.mjs").authenticate} _authenticate */
/** @typedef {import("../../../Adapter/Fetch/Fetch.mjs").Fetch} Fetch */
/** @typedef {import("../../../Adapter/Fetch/showError.mjs").showError} showError */

export class FetchService {
    /**
     * @type {_authenticate | null}
     */
    #authenticate;
    /**
     * @type {showError | null}
     */
    #show_error;

    /**
     * @param {_authenticate | null} authenticate
     * @param {showError | null} show_error
     * @returns {FetchService}
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
        return (await import("../Command/FetchCommand.mjs")).FetchCommand.new(
            this.#authenticate,
            this.#show_error
        )
            .fetch(
                _fetch
            );
    }
}
