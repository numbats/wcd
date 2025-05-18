######## Course info ########
library(tidyverse)

# Start of semester
start_semester <- "2025-03-03"

# Week of mid-semester break
mid_semester_break <- "2025-04-21"

# Schedule
schedule <- tribble(
    ~Week, ~Topic, ~Reference, ~Reference_URL,
    1, "Open data: definitions, sources and examples", "", "",
    2, "Introduction to data collection methods", "", "",
    3, "Case Study: US airline traffic", "", "",
    4, "Case Study: Australian census", "", "",
    5, "Case Study: Australian election data", "", "",
    6, "Case Study: Combining census and election data", "", "",
    7, "Case Study: PD model and credit risk", "", "",
    8, "Case Study: Data ethics", "", "",
    9, "Case Study: Data ethics and privacy", "", "",
    10, "Case Study: Introduction to webscraping", "", "", 
    11, "Case Study: Large Language Models for preparing data in R", "", "",
    12, "Revision: Proper care and feeding of wild caught data", "", "", 
)

# Assignment 1: details
# ...
# Assignment 4: details

all_dates <- seq(as.Date(start_semester), 
                      by = "week", 
                      length.out = 13)
selected_dates <- all_dates[all_dates != mid_semester_break]

# Add mid-semester break
calendar <- tibble(Date = selected_dates) |>
    mutate(Week = row_number()) |> 
    bind_rows(data.frame(Date = as_date(mid_semester_break), 
                         Week = NA)) |>
    arrange(Date)

# Add calendar to schedule
schedule <- schedule |>
    full_join(calendar, by = "Week") |>
    mutate(
        # Week = if_else(Date == mid_semester_break, NA, Week),
        Topic = if_else(Date == mid_semester_break, "Mid-semester break", Topic),
        # Reference = if_else(Date == mid_semester_break, NA, Reference),
        # Reference_URL = if_else(Date == mid_semester_break, NA, Reference_URL)
    ) |>
    select(Week, Date, everything()) |>
    arrange(Date)

# Add assignment details
lastmon <- function(x) {
    7 * floor(as.numeric(x - 1 + 4) / 7) + as.Date(1 - 4, origin = "1970-01-01")
}

assignments <- read_csv(here::here("assignments.csv")) |>
    mutate(
        Date = lastmon(Due),
        Moodle = paste0("https://learning.monash.edu/mod/assign/view.php?id=", Moodle),
        File = paste0("assignments/", File)
    )

schedule <- schedule 
    # full_join(assignments, by = "Date") |>
    # mutate(Week = if_else(is.na(Week) & Date > "2024-05-20", 13, Week))

show_assignments <- function(week) {
    ass <- schedule |>
        filter(
            Week >= week & (week > Week - 3 | week > 8),
            !is.na(Assignment),
        ) |>
        select(Assignment:File)
    if (NROW(ass) > 0) {
        cat("\n\n## Assignments\n\n")
        for (i in seq(NROW(ass))) {
            cat("* [", ass$Assignment[i], "](../", ass$File[i], ") is due on ",
                format(ass$Due[i], "%A %d %B.\n"),
                sep = ""
            )
        }
    }
}


submit <- function(schedule, assignment) {
    ass <- schedule |>
        filter(Assignment == assignment)
    due <- format(ass$Due, "%e %B %Y") |> stringr::str_trim()
    url <- ass$Moodle
    button <- paste0(
        "<br><br><hr><b>Due: ", due, "</b><br>",
        "<a href=", url, " class = 'badge badge-large badge-blue'>",
        "<font size='+2'>&nbsp;&nbsp;<b>Submit</b>&nbsp;&nbsp;</font><br></a>"
    )
    cat(button)
}
