import $ from "jquery";
import { html } from "lighterhtml";
import { log } from "../../helper/logger";
import { GCC_setValue } from "../../helper/storage.js";
import { GCC_getValue } from "../../helper/storage.js";

export const appendCheckBox = (
    id,
    label,
    extrafunction,
    floatLeft,
    imageURL
) => {
    const updateValue = () => {
        const checked = $("#" + id).is(":checked");
        log("debug", "update : " + id + " to new value " + !checked);
        GCC_setValue(id, !checked);

        if (extrafunction) {
            extrafunction.apply(this, [!checked]);
        }
    };

    var checked = GCC_getValue(id, false);

    if (checked === undefined || checked === null || checked == "undefined") {
        GCC_setValue(id, false);
        checked = false;
        log("debug", "update : " + id + " to new (default) value " + checked);
    }

    return html`
        <div id="div${id}" style="${floatLeft ? "float:left" : ""}">
            <input
                id="${id}"
                type="checkbox"
                checked=${checked}
                class="Checkbox"
                onmouseup=${updateValue}
                style="margin:3px"
            />
            ${label
                ? html`
                      <label
                          id="${id}_label"
                          for=${id}
                          onmouseup=${updateValue}
                      >
                          ${imageURL
                              ? html`
                                    <img
                                        src="${imageURL}"
                                        style="margin-right:3px;width:12px;"
                                    />
                                `
                              : null}
                          ${label}
                      </label>
                  `
                : null}
        </div>
    `;
};

export const appendRadioGroup = (settingsName, options, defaultSelection) => {
    const onInputMouseUp = (event) => {
        GCC_setValue(settingsName, event.target.value);
        log(
            "debug",
            "update : " + settingsName + " to new value " + event.target.value
        );
    };

    const onLabelMouseUp = (event) => {
        GCC_setValue(settingsName, event.target.previousSibling.value);
        log(
            "debug",
            "update : " +
                settingsName +
                " to new value " +
                event.target.previousSibling.value
        );
    };

    return html`
        <div>
            ${options.map((option, idx) => {
                var checked = false;
                if (defaultSelection && option.attr === defaultSelection) {
                    checked = true;
                    GCC_setValue(settingsName, defaultSelection);
                    log(
                        "debug",
                        "update : " +
                            settingsName +
                            " to new (default) value " +
                            defaultSelection
                    );
                }

                return html`
                    <input
                        id="id${settingsName}${option.attr}"
                        name=${settingsName}
                        type="radio"
                        value=${option.attr}
                        checked="${checked}"
                        onmouseup=${onInputMouseUp}
                    />
                    <label
                        for="id${settingsName}${option.attr}"
                        style="'margin: 0 8px 0 3px;"
                        onmouseup=${onLabelMouseUp}
                    >
                        ${option.label}
                    </label>
                `;
            })}
        </div>
    `;
};
