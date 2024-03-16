function onPageLoaded() {
    const copyButton = document.getElementsByClassName("copy-button")[0];
    if (!copyButton) {
        const buildButton = (icon, description, textToCopy, shortcut) => {
            const tempContainer = document.createElement("div")
            tempContainer.innerHTML = `<button class="my-shortcut gl-button btn btn-icon btn-sm btn-default btn-default-tertiary 
        gl-display-none! gl-md-display-inline-block! js-copy-reference gl-mx-1" 
         aria-keyshortcuts="${shortcut}"
          aria-live="polite" data-toggle="tooltip" 
         data-placement="bottom" data-container="body" data-html="true"  
         data-track-action="click_button"
          type="button">
         <img class="copy-button s16 gl-icon gl-button-icon " title="Click to bookmark current timestamp" alt="copy">
        </button>`
            const button = tempContainer.getElementsByTagName("button")[0]
            button.setAttribute("data-clipboard-text", textToCopy)
            button.setAttribute("title", description + ` <kbd class='flat ml-1' aria-hidden=true>${shortcut}</kbd>`)
            button.setAttribute("aria-label", description)
            const copyButton = tempContainer.getElementsByClassName("copy-button")[0];
            copyButton.src = chrome.runtime.getURL(icon);
            return tempContainer.firstElementChild
        }
        const mrIdElement = document.querySelector('[data-testid="breadcrumb-links"] > ul > li:last-of-type > a');
        if (!mrIdElement) {
            console.error("MR id element not found")
            return
        }

        const mrTitleElement = document.querySelector('[data-testid="title-content"]');
        if (!mrTitleElement) {
            console.error("MR title element not found")
            return
        }

        const copyReviewButton = buildButton(
            "assets/source_notes.svg",
            "Copy Review Request",
            "Please review [" + mrTitleElement.innerHTML.trim() + "](" + mrIdElement.href + ")",
            "r"
        )
        const copyCheckButton = buildButton(
            "assets/mark_chat_read.svg",
            "Copy Check Request",
            "Please check [" + mrTitleElement.innerHTML.trim() + "](" + mrIdElement.href + ")",
            "c"
        )
        const mergeDescription = document.getElementsByClassName("detail-page-description")[0];
        mergeDescription.append(copyReviewButton);
        mergeDescription.append(copyCheckButton);
        const stickyMergeDescription = document.querySelector('.issue-sticky-header > div > div')
        stickyMergeDescription.appendChild(copyReviewButton.cloneNode(true))
        stickyMergeDescription.appendChild(copyCheckButton.cloneNode(true))
    }
}
onPageLoaded()
window.addEventListener('load', function () {
    const shortcutElements = document.querySelectorAll('.my-shortcut');
    shortcutElements.forEach(element => {
        const shortcuts = element.getAttribute('aria-keyshortcuts');
        console.log(shortcuts)
        document.addEventListener('keydown', function(event) {
            if (shortcuts && shortcuts.includes(event.key)) {
                element.click();
            }
        });
    });
});
//document.addEventListener('DOMContentLoaded', onPageLoaded);
