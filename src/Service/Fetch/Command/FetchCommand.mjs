import { METHOD_GET } from "../../../Adapter/Method/METHOD.mjs";
import { ASSERT_TYPE_CSS, ASSERT_TYPE_JSON } from "../../../Adapter/AssertType/ASSERT_TYPE.mjs";
import { CONTENT_TYPE_CSS, CONTENT_TYPE_JSON } from "../../../Adapter/ContentType/CONTENT_TYPE.mjs";
import { HEADER_ACCEPT, HEADER_CONTENT_TYPE } from "../../../Adapter/Header/HEADER.mjs";

/** @typedef {import("../../../Adapter/Fetch/Fetch.mjs").Fetch} Fetch */
/** @typedef {import("../../../Adapter/Fetch/showAuthentication.mjs").showAuthentication} showAuthentication */
/** @typedef {import("../../../Adapter/Fetch/showError.mjs").showError} showError */

export class FetchCommand {
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
     * @returns {FetchCommand}
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
        const query_params = fetch_.query_params ?? null;

        const method = fetch_.method ?? METHOD_GET;
        const data = fetch_.data ?? null;

        const error_ui = !fetch_.no_ui && this.#show_error !== null;
        const authentication_ui = !fetch_.no_ui && this.#show_authentication !== null;

        const assert_type = fetch_.assert_type ?? ASSERT_TYPE_JSON;

        try {
            const url = new URL(fetch_.url.startsWith("/") ? `${location.origin}${fetch_.url}` : fetch_.url);

            if (query_params !== null) {
                for (const [
                    key,
                    value
                ] of Object.entries(fetch_.query_params)) {
                    if ((value ?? null) === null) {
                        continue;
                    }
                    url.searchParams.append(key, Array.isArray(value) ? value.join(",") : value);
                }
            }

            const headers = new Headers();

            let accept;
            switch (assert_type) {
                case ASSERT_TYPE_CSS:
                    accept = CONTENT_TYPE_CSS;
                    break;

                case ASSERT_TYPE_JSON:
                    accept = CONTENT_TYPE_JSON;
                    break;

                default:
                    throw new Error(`Unknown assert type ${assert_type}`);
            }
            headers.set(HEADER_ACCEPT, accept);

            let body;
            if (data !== null) {
                headers.set(HEADER_CONTENT_TYPE, CONTENT_TYPE_JSON);
                body = JSON.stringify(data);
            } else {
                body = null;
            }

            const response = await fetch(url, {
                method,
                body,
                headers
            });

            if (authentication_ui && response.status === 401 && await this.#show_authentication()) {
                return this.fetch(
                    fetch_
                );
            }

            if (!response.ok) {
                console.error("Fetch non-ok response (", response, ")");

                if (error_ui && await this.#show_error(
                    response
                )) {
                    return this.fetch(
                        fetch_
                    );
                }

                return Promise.reject(response);
            }

            switch (assert_type) {
                case ASSERT_TYPE_CSS:
                    if (!response.headers.get(HEADER_CONTENT_TYPE).includes(CONTENT_TYPE_CSS)) {
                        throw new Error(`Response header ${HEADER_CONTENT_TYPE} need to be ${CONTENT_TYPE_CSS}`);
                    }

                    return response.text();

                case ASSERT_TYPE_JSON:
                    if (!response.headers.get(HEADER_CONTENT_TYPE).includes(CONTENT_TYPE_JSON)) {
                        throw new Error(`Response header ${HEADER_CONTENT_TYPE} need to be ${CONTENT_TYPE_JSON}`);
                    }

                    return response.json();

                default:
                    throw new Error(`Unknown assert type ${assert_type}`);
            }
        } catch (error) {
            console.error("Fetch error (", error, ")");

            if (error_ui && await this.#show_error(
                error
            )) {
                return this.fetch(
                    fetch_
                );
            }

            throw error;
        }
    }
}
