async function onPageLoaded() {
    const buildButton = (icon, description, textToCopy, shortcut) => {
        return `<button class="my-shortcut gl-button btn btn-icon btn-sm btn-default btn-default-tertiary gl-display-none! gl-md-display-inline-block! js-copy-reference gl-mx-1" aria-live="polite" data-toggle="tooltip" data-placement="bottom" data-container="body" data-html="true" data-track-action="click_button" type="button"
        title="${description} <kbd class='flat ml-1' aria-hidden=true>${shortcut}</kbd>"
        data-clipboard-text="${textToCopy}"
        aria-keyshortcuts="${shortcut}"
        aria-label="${description}">
        <img class="copy-button s16 gl-icon gl-button-icon " title="Click to bookmark current timestamp" alt="copy" 
        src="${chrome.runtime.getURL(icon)}">
        </button>`
    }
    const mrIdElement = await waitForElement('[data-testid="breadcrumb-links"] > ul > li:last-of-type > a');
    const mrTitleElement = await waitForElement('[data-testid="title-content"]');

    function addButtons(parent) {
        parent.insertAdjacentHTML("afterend", buildButton(
                "assets/source_notes.svg",
                "Copy Review Request",
                "Please review [" + mrTitleElement.innerHTML.trim() + "](" + mrIdElement.href + ")",
                "r"
            )
        )
        parent.insertAdjacentHTML("afterend", buildButton(
                "assets/mark_chat_read.svg",
                "Copy Check Request",
                "Please check [" + mrTitleElement.innerHTML.trim() + "](" + mrIdElement.href + ")",
                "c"
            )
        )
    }

    addButtons(await waitForElement(`.detail-page-description > :last-child`))
    addButtons(await waitForElement('.issue-sticky-header > div > div > :last-child'));
}

function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

window.addEventListener('load', async function () {
    await onPageLoaded()
    const shortcutElements = document.querySelectorAll('.my-shortcut');
    shortcutElements.forEach(element => {
        const shortcuts = element.getAttribute('aria-keyshortcuts');
        document.addEventListener('keydown', function (event) {
            if (hasModifierKeys(event))
                return;
            if (["input", "textarea"].includes(event.target.tagName.toLowerCase()))
                return;
            if (!shortcuts.includes(event.key))
                return;
            if (isElementInViewport(element) && !isInInvisibleParent(element))
                element.click();
        });
    });
})
;

function hasModifierKeys(event) {
    return event.ctrlKey || event.altKey || event.shiftKey;
}

function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.bottom > 0 &&
        rect.right > 0 &&
        rect.left < window.innerWidth &&
        rect.top < window.innerHeight;
}

function isInInvisibleParent(element) {
    let parent = element;
    while (parent && parent !== document.body) {
        const computedStyle = window.getComputedStyle(parent);
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
            return true;
        }
        parent = parent.parentNode;
    }
    return false;
}
