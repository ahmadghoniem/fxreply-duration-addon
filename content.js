;(function () {
  console.clear()
  console.log("Trade Duration Calculator - Final Fixed Version")

  function calculateDuration(startDateStr, endDateStr) {
    const parseDate = (dateStr) => {
      dateStr = dateStr.trim()
      const date = new Date(dateStr)
      return isNaN(date.getTime()) ? null : date
    }

    const startDate = parseDate(startDateStr)
    const endDate = parseDate(endDateStr)

    if (!startDate || !endDate) return "Invalid"

    const diffMs = endDate - startDate
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${days > 0 ? days + "d " : ""}${
      days > 0 || hours > 0 ? hours + "h " : ""
    }${minutes}m`
  }

  function getCellText(cell) {
    const div = cell.querySelector("div")
    return (div || cell).textContent.trim()
  }

  function addDurationColumn() {
    const tables = document.querySelectorAll("table")
    console.log(`Found ${tables.length} tables on the page`)

    tables.forEach((table, tableIndex) => {
      const headerRow = table.querySelector("thead tr")
      if (!headerRow) return

      const headerCells = headerRow.querySelectorAll("th")
      const headers = Array.from(headerCells).map((th) => th.textContent.trim())

      if (headers.includes("Date Start") && headers.includes("Date End")) {
        const dateStartIndex = headers.findIndex((h) =>
          h.includes("Date Start")
        )
        const dateEndIndex = headers.findIndex((h) => h.includes("Date End"))

        let durationIndex = headers.indexOf("Duration")
        if (durationIndex === -1) {
          const durationHeader = document.createElement("th")
          durationHeader.className = "text-base p-3"
          durationHeader.textContent = "Duration"
          headerRow.appendChild(durationHeader)
          durationIndex = headerCells.length // new index is now last
        }

        const rows = table.querySelectorAll("tbody tr")
        rows.forEach((row) => {
          const cells = row.querySelectorAll("td")

          // Skip if duration cell already exists
          if (cells.length > durationIndex) return

          if (cells.length <= Math.max(dateStartIndex, dateEndIndex)) return

          const startDateText = getCellText(cells[dateStartIndex])
          const endDateText = getCellText(cells[dateEndIndex])
          const duration = calculateDuration(startDateText, endDateText)

          const durationCell = document.createElement("td")
          durationCell.className =
            "text-sm text-fxr-text-primary dark:text-fxr-text-primary-dark p-3"
          durationCell.textContent = duration
          row.appendChild(durationCell)
        })
      }
    })
  }

  function init() {
    addDurationColumn()

    const observer = new MutationObserver((mutations) => {
      const shouldUpdate = mutations.some(
        (mutation) =>
          mutation.type === "childList" &&
          (mutation.target.tagName === "TABLE" ||
            mutation.target.tagName === "TBODY" ||
            mutation.target.closest("table"))
      )
      if (shouldUpdate) {
        addDurationColumn()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
